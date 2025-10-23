import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MetaAdsCredentials {
  access_token: string;
  ad_account_id: string;
}

interface MetaInsight {
  date_start: string;
  impressions: string;
  clicks: string;
  spend: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Buscar todas as integrações ativas do Meta Ads
    const { data: integrations, error: intError } = await supabaseAdmin
      .from("integrations")
      .select("id, client_id, user_id, credentials, vault_secret_name, last_sync_at")
      .eq("platform", "meta")
      .eq("is_active", true);

    if (intError) {
      console.error("Erro ao buscar integrações:", intError);
      throw intError;
    }

    if (!integrations || integrations.length === 0) {
      console.log("Nenhuma integração Meta Ads ativa encontrada");
      return new Response(
        JSON.stringify({ message: "Nenhuma integração ativa", synced: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Encontradas ${integrations.length} integrações Meta Ads ativas`);
    let syncedCount = 0;
    const errors: any[] = [];

    for (const integration of integrations) {
      try {
        // Buscar credenciais do Vault se disponível
        let credentials: MetaAdsCredentials;
        
        if (integration.vault_secret_name) {
          const { data: secretData } = await supabaseAdmin.rpc('vault.decrypted_secret', {
            secret_name: integration.vault_secret_name
          });
          
          if (secretData?.decrypted_secret) {
            credentials = JSON.parse(secretData.decrypted_secret);
          } else {
            console.error(`Integração ${integration.id}: falha ao buscar credenciais do Vault`);
            errors.push({ integration_id: integration.id, error: "Falha ao buscar credenciais do Vault" });
            continue;
          }
        } else {
          // Fallback para credenciais antigas
          credentials = integration.credentials as MetaAdsCredentials;
        }
        
        if (!credentials.access_token || !credentials.ad_account_id) {
          console.error(`Integração ${integration.id}: credenciais inválidas`);
          errors.push({ integration_id: integration.id, error: "Credenciais inválidas" });
          continue;
        }
        
        // Garantir que o ad_account_id tenha o prefixo "act_"
        let adAccountId = credentials.ad_account_id.toString();
        if (!adAccountId.startsWith('act_')) {
          adAccountId = `act_${adAccountId}`;
        }
        
        console.log(`Processando integração ${integration.id} com Ad Account: ${adAccountId}`)

        // Buscar campanhas do cliente
        const { data: campaigns } = await supabaseAdmin
          .from("campaigns")
          .select("id, name")
          .eq("client_id", integration.client_id)
          .eq("platform", "Meta Ads");

        if (!campaigns || campaigns.length === 0) {
          console.log(`Integração ${integration.id}: nenhuma campanha encontrada`);
          continue;
        }

        // Definir período de sincronização (últimos 7 dias)
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const dateStart = sevenDaysAgo.toISOString().split('T')[0];
        const dateEnd = today.toISOString().split('T')[0];

        // Chamar API do Meta Ads (Graph API) - BUSCAR POR CAMPANHA
        const metaApiUrl = `https://graph.facebook.com/v18.0/${adAccountId}/insights`;
        const params = new URLSearchParams({
          access_token: credentials.access_token,
          time_range: JSON.stringify({ since: dateStart, until: dateEnd }),
          time_increment: "1", // diário
          level: "campaign", // MUDANÇA: de "account" para "campaign"
          fields: "campaign_id,campaign_name,impressions,clicks,spend,actions,action_values",
        });

        console.log(`Sincronizando Meta Ads para integração ${integration.id}...`);
        
        const metaResponse = await fetch(`${metaApiUrl}?${params.toString()}`);
        
        if (!metaResponse.ok) {
          const errorData = await metaResponse.text();
          console.error(`Meta API error (${metaResponse.status}):`, errorData);
          errors.push({ 
            integration_id: integration.id, 
            error: `Meta API error: ${metaResponse.status}`,
            details: errorData 
          });
          continue;
        }

        const metaData = await metaResponse.json();
        
        if (!metaData.data || metaData.data.length === 0) {
          console.log(`Integração ${integration.id}: sem dados no período`);
          continue;
        }

        // Processar e salvar métricas POR CAMPANHA
        for (const insight of metaData.data as any[]) {
          // Buscar campanha no banco pelo nome retornado pela API
          const campaignName = insight.campaign_name;
          const matchedCampaign = campaigns.find(c => c.name === campaignName);
          
          if (!matchedCampaign) {
            console.log(`Campanha "${campaignName}" da API não encontrada no banco, ignorando...`);
            continue;
          }
          
          // Extrair leads e sales das actions
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

          const impressions = parseInt(insight.impressions);
          const clicks = parseInt(insight.clicks);
          const investment = parseFloat(insight.spend);

          // Calcular métricas derivadas
          const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
          const cpl = leads > 0 ? investment / leads : 0;
          const roas = investment > 0 ? revenue / investment : 0;

          // Salvar métrica APENAS para a campanha específica retornada pela API
          const { error: metricError } = await supabaseAdmin
            .from("campaign_metrics")
            .upsert({
              campaign_id: matchedCampaign.id,
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

          if (metricError) {
            console.error(`Erro ao salvar métrica para campanha ${matchedCampaign.name}:`, metricError);
          } else {
            console.log(`✓ Métrica salva para campanha ${matchedCampaign.name} na data ${insight.date_start}`);
          }
        }

        // Atualizar last_sync_at
        await supabaseAdmin
          .from("integrations")
          .update({ last_sync_at: new Date().toISOString() })
          .eq("id", integration.id);

        syncedCount++;
        console.log(`Integração ${integration.id}: sincronizada com sucesso`);

      } catch (error: any) {
        console.error(`Erro ao sincronizar integração ${integration.id}:`, error);
        errors.push({ integration_id: integration.id, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        message: "Sincronização Meta Ads concluída",
        synced: syncedCount,
        total: integrations.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Erro geral na sincronização Meta Ads:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
