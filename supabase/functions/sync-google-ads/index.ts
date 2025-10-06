import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GoogleAdsCredentials {
  refresh_token: string;
  client_id: string;
  client_secret: string;
  customer_id: string;
  developer_token: string;
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

    // Buscar todas as integrações ativas do Google Ads
    const { data: integrations, error: intError } = await supabaseAdmin
      .from("integrations")
      .select("id, client_id, user_id, credentials, last_sync_at")
      .eq("platform", "google_ads")
      .eq("is_active", true);

    if (intError) {
      console.error("Erro ao buscar integrações:", intError);
      throw intError;
    }

    if (!integrations || integrations.length === 0) {
      console.log("Nenhuma integração Google Ads ativa encontrada");
      return new Response(
        JSON.stringify({ message: "Nenhuma integração ativa", synced: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Encontradas ${integrations.length} integrações Google Ads ativas`);
    let syncedCount = 0;
    const errors: any[] = [];

    for (const integration of integrations) {
      try {
        // Buscar credenciais do Vault
        let credentials: GoogleAdsCredentials;
        
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
          credentials = integration.credentials as GoogleAdsCredentials;
        }
        
        console.log(`[sync-google-ads] Processing integration ${integration.id} (credentials: ***MASKED***)`);
        
        if (!credentials.refresh_token || !credentials.customer_id || !credentials.developer_token) {
          console.error(`Integração ${integration.id}: credenciais inválidas`);
          errors.push({ integration_id: integration.id, error: "Credenciais inválidas" });
          continue;
        }

        // 1. Obter Access Token via OAuth refresh
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: credentials.client_id,
            client_secret: credentials.client_secret,
            refresh_token: credentials.refresh_token,
            grant_type: "refresh_token",
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.text();
          console.error(`Erro ao renovar token Google:`, errorData);
          errors.push({ integration_id: integration.id, error: "Falha ao renovar token" });
          continue;
        }

        const { access_token } = await tokenResponse.json();

        // Buscar campanhas do cliente
        const { data: campaigns } = await supabaseAdmin
          .from("campaigns")
          .select("id, name")
          .eq("client_id", integration.client_id)
          .eq("platform", "Google Ads");

        if (!campaigns || campaigns.length === 0) {
          console.log(`Integração ${integration.id}: nenhuma campanha encontrada`);
          continue;
        }

        // Definir período (últimos 7 dias)
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const dateStart = sevenDaysAgo.toISOString().split('T')[0].replace(/-/g, '');
        const dateEnd = today.toISOString().split('T')[0].replace(/-/g, '');

        // 2. Chamar Google Ads API usando GoogleAdsService.SearchStream
        const query = `
          SELECT
            segments.date,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversions_value
          FROM campaign
          WHERE segments.date BETWEEN '${dateStart}' AND '${dateEnd}'
        `;

        const googleAdsApiUrl = `https://googleads.googleapis.com/v16/customers/${credentials.customer_id.replace(/-/g, '')}/googleAds:searchStream`;

        console.log(`Sincronizando Google Ads para integração ${integration.id}...`);

        const adsResponse = await fetch(googleAdsApiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${access_token}`,
            "developer-token": credentials.developer_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!adsResponse.ok) {
          const errorData = await adsResponse.text();
          console.error(`Google Ads API error (${adsResponse.status}):`, errorData);
          errors.push({ 
            integration_id: integration.id, 
            error: `Google Ads API error: ${adsResponse.status}`,
            details: errorData 
          });
          continue;
        }

        const adsData = await adsResponse.json();

        if (!adsData.results || adsData.results.length === 0) {
          console.log(`Integração ${integration.id}: sem dados no período`);
          continue;
        }

        // Processar e salvar métricas
        for (const row of adsData.results) {
          const date = row.segments?.date;
          const impressions = parseInt(row.metrics?.impressions || "0");
          const clicks = parseInt(row.metrics?.clicks || "0");
          const investment = parseFloat(row.metrics?.cost_micros || "0") / 1000000; // micros para reais
          const leads = parseInt(row.metrics?.conversions || "0");
          const revenue = parseFloat(row.metrics?.conversions_value || "0");

          // Assumir que 10% das conversões são vendas (ajustar conforme necessário)
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
                date: date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"), // formato YYYYMMDD -> YYYY-MM-DD
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
        message: "Sincronização Google Ads concluída",
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
    console.error("Erro geral na sincronização Google Ads:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
