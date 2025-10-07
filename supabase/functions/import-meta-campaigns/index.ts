import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MetaAdsCredentials {
  access_token: string;
  ad_account_id: string;
}

interface MetaCampaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { client_id } = await req.json();

    if (!client_id) {
      return new Response(
        JSON.stringify({ error: "client_id é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Buscar integração Meta Ads do cliente
    const { data: integration, error: intError } = await supabaseAdmin
      .from("integrations")
      .select("id, client_id, user_id, credentials, vault_secret_name")
      .eq("client_id", client_id)
      .eq("platform", "meta")
      .eq("is_active", true)
      .single();

    if (intError || !integration) {
      console.error("Integração não encontrada:", intError);
      return new Response(
        JSON.stringify({ error: "Integração Meta Ads não encontrada para este cliente" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Buscar credenciais
    let credentials: MetaAdsCredentials;
    
    if (integration.vault_secret_name) {
      const { data: secretData } = await supabaseAdmin.rpc('vault.decrypted_secret', {
        secret_name: integration.vault_secret_name
      });
      
      if (secretData?.decrypted_secret) {
        credentials = JSON.parse(secretData.decrypted_secret);
      } else {
        return new Response(
          JSON.stringify({ error: "Falha ao buscar credenciais do Vault" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      credentials = integration.credentials as MetaAdsCredentials;
    }

    if (!credentials.access_token || !credentials.ad_account_id) {
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Garantir que o ad_account_id tenha o prefixo "act_"
    let adAccountId = credentials.ad_account_id.toString();
    if (!adAccountId.startsWith('act_')) {
      adAccountId = `act_${adAccountId}`;
    }

    console.log(`Importando campanhas do Meta Ads para cliente ${client_id}...`);
    console.log(`Usando Ad Account ID: ${adAccountId}`);

    // Buscar campanhas do Meta Ads via Graph API
    const metaApiUrl = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns`;
    const params = new URLSearchParams({
      access_token: credentials.access_token,
      fields: "id,name,objective,status,daily_budget,lifetime_budget,start_time,stop_time",
      limit: "100",
    });

    const metaResponse = await fetch(`${metaApiUrl}?${params.toString()}`);

    if (!metaResponse.ok) {
      const errorData = await metaResponse.text();
      console.error(`Meta API error (${metaResponse.status}):`, errorData);
      
      let errorMessage = `Erro ao conectar com Meta Ads (${metaResponse.status})`;
      
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
          
          // Mensagens mais amigáveis para erros comuns
          if (errorMessage.includes("does not exist") || errorMessage.includes("missing permissions")) {
            errorMessage = "Conta de anúncios não encontrada ou sem permissões. Verifique o Account ID e permissões do token.";
          } else if (errorMessage.includes("access token")) {
            errorMessage = "Token de acesso inválido ou expirado. Reconecte sua conta Meta Ads.";
          }
        }
      } catch (e) {
        // Se não conseguir parsear o erro, usa a mensagem padrão
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const metaData = await metaResponse.json();
    const metaCampaigns = metaData.data as MetaCampaign[];

    if (!metaCampaigns || metaCampaigns.length === 0) {
      return new Response(
        JSON.stringify({ message: "Nenhuma campanha encontrada no Meta Ads", imported: 0, skipped: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Encontradas ${metaCampaigns.length} campanhas no Meta Ads`);

    // Filtrar apenas campanhas ativas
    const activeCampaigns = metaCampaigns.filter(c => c.status === "ACTIVE");
    
    let imported = 0;
    let skipped = 0;
    const errors: any[] = [];
    const importedCampaignIds: string[] = [];

    // Buscar campanhas já existentes no banco
    const { data: existingCampaigns } = await supabaseAdmin
      .from("campaigns")
      .select("name")
      .eq("client_id", client_id)
      .eq("platform", "Meta Ads");

    const existingNames = new Set(existingCampaigns?.map(c => c.name) || []);

    for (const metaCampaign of activeCampaigns) {
      try {
        // Verificar se já existe
        if (existingNames.has(metaCampaign.name)) {
          console.log(`Campanha "${metaCampaign.name}" já existe, pulando...`);
          skipped++;
          continue;
        }

        // Calcular orçamento (preferir diário, senão lifetime)
        let budget = null;
        if (metaCampaign.daily_budget) {
          budget = parseFloat(metaCampaign.daily_budget) / 100; // Converter de centavos
        } else if (metaCampaign.lifetime_budget) {
          budget = parseFloat(metaCampaign.lifetime_budget) / 100;
        }

        // Converter datas
        const startDate = metaCampaign.start_time ? new Date(metaCampaign.start_time).toISOString().split('T')[0] : null;
        const endDate = metaCampaign.stop_time ? new Date(metaCampaign.stop_time).toISOString().split('T')[0] : null;

        // Mapear objetivo do Meta para formato amigável
        const objectiveMap: Record<string, string> = {
          "OUTCOME_LEADS": "Geração de Leads",
          "OUTCOME_SALES": "Conversões/Vendas",
          "OUTCOME_TRAFFIC": "Tráfego",
          "OUTCOME_AWARENESS": "Reconhecimento",
          "OUTCOME_ENGAGEMENT": "Engajamento",
        };
        
        const objective = objectiveMap[metaCampaign.objective] || metaCampaign.objective;

        // Criar campanha no banco
        const { data: newCampaign, error: insertError } = await supabaseAdmin
          .from("campaigns")
          .insert({
            name: metaCampaign.name,
            client_id: client_id,
            user_id: integration.user_id,
            platform: "Meta Ads",
            objective: objective,
            budget: budget,
            start_date: startDate,
            end_date: endDate,
            status: "active",
          })
          .select()
          .single();

        if (insertError) {
          console.error(`Erro ao criar campanha "${metaCampaign.name}":`, insertError);
          errors.push({ campaign: metaCampaign.name, error: insertError.message });
        } else {
          console.log(`Campanha "${metaCampaign.name}" importada com sucesso`);
          imported++;
          importedCampaignIds.push(newCampaign.id);
        }

      } catch (error: any) {
        console.error(`Erro ao processar campanha "${metaCampaign.name}":`, error);
        errors.push({ campaign: metaCampaign.name, error: error.message });
      }
    }

    // Sincronizar métricas das campanhas importadas
    let metricsSynced = 0;
    if (importedCampaignIds.length > 0) {
      console.log(`Sincronizando métricas para ${importedCampaignIds.length} campanhas...`);
      
      // Definir período dos últimos 7 dias
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const dateStart = sevenDaysAgo.toISOString().split('T')[0];
      const dateEnd = today.toISOString().split('T')[0];

      // Buscar métricas da conta de anúncios
      const metricsUrl = `https://graph.facebook.com/v18.0/${adAccountId}/insights`;
      const params = new URLSearchParams({
        access_token: credentials.access_token,
        time_range: JSON.stringify({ since: dateStart, until: dateEnd }),
        time_increment: "1",
        level: "account",
        fields: "impressions,clicks,spend,actions,action_values",
      });

      try {
        const metricsResponse = await fetch(`${metricsUrl}?${params.toString()}`);
        
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          
          if (metricsData.data && metricsData.data.length > 0) {
            for (const insight of metricsData.data) {
              // Extrair leads e sales
              let leads = 0;
              let sales = 0;
              let revenue = 0;

              if (insight.actions) {
                const leadAction = insight.actions.find((a: any) => a.action_type === "lead");
                const purchaseAction = insight.actions.find((a: any) => a.action_type === "purchase");
                leads = leadAction ? parseInt(leadAction.value) : 0;
                sales = purchaseAction ? parseInt(purchaseAction.value) : 0;
              }

              if (insight.action_values) {
                const purchaseValue = insight.action_values.find((a: any) => a.action_type === "purchase");
                revenue = purchaseValue ? parseFloat(purchaseValue.value) : 0;
              }

              const impressions = parseInt(insight.impressions || "0");
              const clicks = parseInt(insight.clicks || "0");
              const investment = parseFloat(insight.spend || "0");
              const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
              const cpl = leads > 0 ? investment / leads : 0;
              const roas = investment > 0 ? revenue / investment : 0;

              // Salvar métrica para cada campanha importada
              for (const campaignId of importedCampaignIds) {
                const { error: metricError } = await supabaseAdmin
                  .from("campaign_metrics")
                  .upsert({
                    campaign_id: campaignId,
                    user_id: integration.user_id,
                    date: insight.date_start,
                    impressions,
                    clicks,
                    investment,
                    leads,
                    sales,
                    revenue,
                    ctr,
                    cpl,
                    roas,
                  }, {
                    onConflict: "campaign_id,date",
                  });

                if (!metricError) {
                  metricsSynced++;
                }
              }
            }
            console.log(`${metricsSynced} métricas sincronizadas`);
          }
        } else {
          console.error("Erro ao buscar métricas:", await metricsResponse.text());
        }
      } catch (error) {
        console.error("Erro ao sincronizar métricas:", error);
      }
    }

    // Criar notificação para o usuário
    if (imported > 0) {
      await supabaseAdmin.rpc('create_notification_secure', {
        p_user_id: integration.user_id,
        p_title: 'Campanhas importadas',
        p_message: `${imported} campanha(s) importadas e ${metricsSynced} métricas sincronizadas`,
        p_type: 'success'
      });
    }

    return new Response(
      JSON.stringify({
        message: "Importação e sincronização concluídas",
        imported,
        skipped,
        metricsSynced,
        total: activeCampaigns.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Erro na importação de campanhas:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
