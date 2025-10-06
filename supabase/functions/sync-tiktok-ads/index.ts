import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TikTokAdsCredentials {
  access_token: string;
  advertiser_id: string;
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

    // Buscar todas as integrações ativas do TikTok Ads
    const { data: integrations, error: intError } = await supabaseAdmin
      .from("integrations")
      .select("id, client_id, user_id, credentials, last_sync_at")
      .eq("platform", "tiktok_ads")
      .eq("is_active", true);

    if (intError) {
      console.error("Erro ao buscar integrações:", intError);
      throw intError;
    }

    if (!integrations || integrations.length === 0) {
      console.log("Nenhuma integração TikTok Ads ativa encontrada");
      return new Response(
        JSON.stringify({ message: "Nenhuma integração ativa", synced: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Encontradas ${integrations.length} integrações TikTok Ads ativas`);
    let syncedCount = 0;
    const errors: any[] = [];

    for (const integration of integrations) {
      try {
        // Buscar credenciais do Vault
        let credentials: TikTokAdsCredentials;
        
        if (integration.vault_secret_name) {
          const { data: secretData } = await supabaseClient.rpc('vault.decrypted_secret', {
            secret_name: integration.vault_secret_name
          });
          
          if (secretData) {
            credentials = JSON.parse(secretData.decrypted_secret);
          } else {
            throw new Error('Failed to retrieve credentials from Vault');
          }
        } else {
          // Fallback para credenciais antigas (será removido após migração)
          credentials = integration.credentials as TikTokAdsCredentials;
        }
        
        console.log(`[sync-tiktok-ads] Processing integration ${integration.id} (credentials: ***MASKED***)`);
        
        if (!credentials.access_token || !credentials.advertiser_id) {
          console.error(`Integração ${integration.id}: credenciais inválidas`);
          errors.push({ integration_id: integration.id, error: "Credenciais inválidas" });
          continue;
        }

        // Buscar campanhas do cliente
        const { data: campaigns } = await supabaseAdmin
          .from("campaigns")
          .select("id, name")
          .eq("client_id", integration.client_id)
          .eq("platform", "TikTok Ads");

        if (!campaigns || campaigns.length === 0) {
          console.log(`Integração ${integration.id}: nenhuma campanha encontrada`);
          continue;
        }

        // Definir período (últimos 7 dias)
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const dateStart = sevenDaysAgo.toISOString().split('T')[0];
        const dateEnd = today.toISOString().split('T')[0];

        // Chamar TikTok Ads API (Reporting API)
        const tiktokApiUrl = "https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/";
        
        const requestBody = {
          advertiser_id: credentials.advertiser_id,
          service_type: "AUCTION",
          report_type: "BASIC",
          data_level: "AUCTION_ADVERTISER",
          dimensions: ["stat_time_day"],
          metrics: [
            "impressions",
            "clicks",
            "spend",
            "conversion",
            "total_onsite_shopping_value",
          ],
          start_date: dateStart,
          end_date: dateEnd,
          page: 1,
          page_size: 1000,
        };

        console.log(`Sincronizando TikTok Ads para integração ${integration.id}...`);

        const tiktokResponse = await fetch(tiktokApiUrl, {
          method: "POST",
          headers: {
            "Access-Token": credentials.access_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!tiktokResponse.ok) {
          const errorData = await tiktokResponse.text();
          console.error(`TikTok API error (${tiktokResponse.status}):`, errorData);
          errors.push({ 
            integration_id: integration.id, 
            error: `TikTok API error: ${tiktokResponse.status}`,
            details: errorData 
          });
          continue;
        }

        const tiktokData = await tiktokResponse.json();

        if (tiktokData.code !== 0) {
          console.error(`TikTok API retornou erro:`, tiktokData.message);
          errors.push({ 
            integration_id: integration.id, 
            error: tiktokData.message 
          });
          continue;
        }

        if (!tiktokData.data?.list || tiktokData.data.list.length === 0) {
          console.log(`Integração ${integration.id}: sem dados no período`);
          continue;
        }

        // Processar e salvar métricas
        for (const row of tiktokData.data.list) {
          const date = row.dimensions?.stat_time_day;
          const impressions = parseInt(row.metrics?.impressions || "0");
          const clicks = parseInt(row.metrics?.clicks || "0");
          const investment = parseFloat(row.metrics?.spend || "0");
          const leads = parseInt(row.metrics?.conversion || "0");
          const revenue = parseFloat(row.metrics?.total_onsite_shopping_value || "0");

          // Assumir que 10% das conversões são vendas
          const sales = Math.round(leads * 0.1);

          const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
          const cpl = leads > 0 ? investment / leads : 0;
          const roas = investment > 0 ? revenue / investment : 0;

          // Salvar métrica para cada campanha
          for (const campaign of campaigns) {
            const { error: metricError } = await supabaseAdmin
              .from("campaign_metrics")
              .upsert({
                campaign_id: campaign.id,
                user_id: integration.user_id,
                date,
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
              console.error(`Erro ao salvar métrica:`, metricError);
            }
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
        message: "Sincronização TikTok Ads concluída",
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
    console.error("Erro geral na sincronização TikTok Ads:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
