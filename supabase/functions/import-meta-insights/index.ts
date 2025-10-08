import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MetaAdsCredentials {
  access_token: string;
  ad_account_id: string;
}

interface MetaAdInsight {
  ad_id: string;
  ad_name?: string;
  date_start: string;
  age?: string;
  gender?: string;
  country?: string;
  region?: string;
  device_platform?: string;
  publisher_platform?: string;
  impression_device?: string;
  hourly_stats_aggregated_by_advertiser_time_zone?: string;
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

    console.log("🔍 Iniciando importação de insights detalhados do Meta Ads...");

    // Buscar integrações ativas do Meta Ads
    const { data: integrations, error: intError } = await supabaseAdmin
      .from("integrations")
      .select("id, client_id, user_id, credentials, vault_secret_name")
      .eq("platform", "meta")
      .eq("is_active", true);

    if (intError) {
      console.error("❌ Erro ao buscar integrações:", intError);
      throw intError;
    }

    if (!integrations || integrations.length === 0) {
      console.log("⚠️ Nenhuma integração Meta Ads ativa encontrada");
      return new Response(
        JSON.stringify({ message: "Nenhuma integração ativa", imported: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ Encontradas ${integrations.length} integrações Meta Ads ativas`);
    let totalImported = 0;
    const errors: any[] = [];

    for (const integration of integrations) {
      try {
        console.log(`\n📊 Processando integração ${integration.id}...`);

        // Buscar credenciais
        let credentials: MetaAdsCredentials;
        
        if (integration.vault_secret_name) {
          const { data: secretData } = await supabaseAdmin.rpc('vault.decrypted_secret', {
            secret_name: integration.vault_secret_name
          });
          
          if (secretData?.decrypted_secret) {
            credentials = JSON.parse(secretData.decrypted_secret);
          } else {
            console.error(`❌ Integração ${integration.id}: falha ao buscar credenciais do Vault`);
            errors.push({ integration_id: integration.id, error: "Falha ao buscar credenciais" });
            continue;
          }
        } else {
          credentials = integration.credentials as MetaAdsCredentials;
        }
        
        if (!credentials.access_token || !credentials.ad_account_id) {
          console.error(`❌ Integração ${integration.id}: credenciais inválidas`);
          errors.push({ integration_id: integration.id, error: "Credenciais inválidas" });
          continue;
        }

        // Garantir prefixo "act_"
        let adAccountId = credentials.ad_account_id.toString();
        if (!adAccountId.startsWith('act_')) {
          adAccountId = `act_${adAccountId}`;
        }

        // Buscar campanhas do cliente
        const { data: campaigns } = await supabaseAdmin
          .from("campaigns")
          .select("id, name")
          .eq("client_id", integration.client_id)
          .eq("platform", "Meta Ads");

        if (!campaigns || campaigns.length === 0) {
          console.log(`⚠️ Integração ${integration.id}: nenhuma campanha encontrada`);
          continue;
        }

        console.log(`📌 ${campaigns.length} campanhas encontradas`);

        // Período: últimos 30 dias
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const dateStart = thirtyDaysAgo.toISOString().split('T')[0];
        const dateEnd = today.toISOString().split('T')[0];

        console.log(`📅 Período: ${dateStart} a ${dateEnd}`);

        // Buscar todos os anúncios da conta
        const adsUrl = `https://graph.facebook.com/v18.0/${adAccountId}/ads`;
        const adsParams = new URLSearchParams({
          access_token: credentials.access_token,
          fields: "id,name,status",
          limit: "100",
        });

        console.log("🔎 Buscando anúncios...");
        const adsResponse = await fetch(`${adsUrl}?${adsParams.toString()}`);
        
        if (!adsResponse.ok) {
          const errorData = await adsResponse.text();
          console.error(`❌ Meta API error ao buscar ads (${adsResponse.status}):`, errorData);
          errors.push({ 
            integration_id: integration.id, 
            error: `Meta API error: ${adsResponse.status}`,
            details: errorData 
          });
          continue;
        }

        const adsData = await adsResponse.json();
        
        if (!adsData.data || adsData.data.length === 0) {
          console.log(`⚠️ Integração ${integration.id}: nenhum anúncio encontrado`);
          continue;
        }

        console.log(`✅ ${adsData.data.length} anúncios encontrados`);

        // Para cada anúncio, buscar insights com breakdowns
        let adInsightsCount = 0;

        for (const ad of adsData.data.slice(0, 10)) { // Limitar a 10 ads por execução para não estourar timeout
          console.log(`\n📍 Processando anúncio: ${ad.name} (${ad.id})`);

          // Buscar insights com breakdowns detalhados
          const insightsUrl = `https://graph.facebook.com/v18.0/${ad.id}/insights`;
          const breakdowns = ["age,gender", "device_platform", "publisher_platform", "region", "country"];

          for (const breakdown of breakdowns) {
            const insightsParams = new URLSearchParams({
              access_token: credentials.access_token,
              time_range: JSON.stringify({ since: dateStart, until: dateEnd }),
              time_increment: "1",
              level: "ad",
              breakdowns: breakdown,
              fields: "impressions,clicks,spend,actions,action_values",
            });

            const insightsResponse = await fetch(`${insightsUrl}?${insightsParams.toString()}`);
            
            if (!insightsResponse.ok) {
              console.error(`⚠️ Erro ao buscar insights para ad ${ad.id} (${insightsResponse.status})`);
              continue;
            }

            const insightsData = await insightsResponse.json();
            
            if (!insightsData.data || insightsData.data.length === 0) {
              continue;
            }

            console.log(`  ✓ ${insightsData.data.length} registros de insights (${breakdown})`);

            // Processar e salvar cada insight
            for (const insight of insightsData.data as MetaAdInsight[]) {
              // Extrair conversões e valores
              let conversions = 0;
              let conversionValue = 0;

              if (insight.actions) {
                const conversionActions = insight.actions.filter(a => 
                  a.action_type === "purchase" || 
                  a.action_type === "lead" || 
                  a.action_type === "complete_registration"
                );
                conversions = conversionActions.reduce((sum, a) => sum + parseInt(a.value || "0"), 0);
              }

              if (insight.action_values) {
                const valueActions = insight.action_values.filter(a => a.action_type === "purchase");
                conversionValue = valueActions.reduce((sum, a) => sum + parseFloat(a.value || "0"), 0);
              }

              const impressions = parseInt(insight.impressions || "0");
              const clicks = parseInt(insight.clicks || "0");
              const spend = parseFloat(insight.spend || "0");

              // Calcular métricas
              const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
              const cpc = clicks > 0 ? spend / clicks : 0;
              const cpa = conversions > 0 ? spend / conversions : 0;
              const roas = spend > 0 ? conversionValue / spend : 0;

              // Extrair hora do dia se disponível
              let hourOfDay: number | null = null;
              if (insight.hourly_stats_aggregated_by_advertiser_time_zone) {
                const hourMatch = insight.hourly_stats_aggregated_by_advertiser_time_zone.match(/(\d+):/);
                if (hourMatch) {
                  hourOfDay = parseInt(hourMatch[1]);
                }
              }

              // Dia da semana (calculado da data)
              const date = new Date(insight.date_start);
              const dayOfWeek = date.getDay();

              // Encontrar campanha correspondente (primeira campanha do cliente)
              const campaignId = campaigns[0].id;

              // Inserir no banco
              const { error: insertError } = await supabaseAdmin
                .from("ad_insights")
                .upsert({
                  user_id: integration.user_id,
                  campaign_id: campaignId,
                  ad_id: insight.ad_id,
                  ad_name: ad.name,
                  date: insight.date_start,
                  age_range: insight.age || null,
                  gender: insight.gender || null,
                  country: insight.country || null,
                  region: insight.region || null,
                  device_type: insight.device_platform || insight.impression_device || null,
                  publisher_platform: insight.publisher_platform || null,
                  placement: null,
                  hour_of_day: hourOfDay,
                  day_of_week: dayOfWeek,
                  impressions,
                  clicks,
                  spend,
                  conversions,
                  conversion_value: conversionValue,
                  ctr,
                  cpc,
                  cpa,
                  roas,
                }, {
                  onConflict: "ad_id,date,age_range,gender,device_type,publisher_platform",
                  ignoreDuplicates: false,
                });

              if (insertError) {
                console.error(`  ⚠️ Erro ao inserir insight:`, insertError.message);
              } else {
                adInsightsCount++;
              }
            }
          }
        }

        console.log(`\n✅ Integração ${integration.id}: ${adInsightsCount} insights importados`);
        totalImported += adInsightsCount;

      } catch (error: any) {
        console.error(`❌ Erro ao processar integração ${integration.id}:`, error);
        errors.push({ integration_id: integration.id, error: error.message });
      }
    }

    console.log(`\n🎉 Importação concluída! Total: ${totalImported} insights`);

    return new Response(
      JSON.stringify({
        message: "Importação de insights concluída",
        imported: totalImported,
        integrations: integrations.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Erro geral na importação:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
