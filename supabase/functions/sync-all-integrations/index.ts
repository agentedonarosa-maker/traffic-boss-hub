import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("🚀 Iniciando sincronização de todas as integrações...");

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const results = {
      meta_ads: null as any,
      google_ads: null as any,
      tiktok_ads: null as any,
    };

    const errors: string[] = [];

    // 1. Sincronizar Meta Ads
    console.log("📱 Sincronizando Meta Ads...");
    try {
      const { data: metaData, error: metaError } = await supabase.functions.invoke(
        "sync-meta-ads",
        { body: {} }
      );

      if (metaError) {
        console.error("Erro Meta Ads:", metaError);
        errors.push(`Meta Ads: ${metaError.message}`);
      } else {
        results.meta_ads = metaData;
        console.log("✅ Meta Ads sincronizado:", metaData);
      }
    } catch (error: any) {
      console.error("Exceção Meta Ads:", error);
      errors.push(`Meta Ads: ${error.message}`);
    }

    // 2. Sincronizar Google Ads
    console.log("🔍 Sincronizando Google Ads...");
    try {
      const { data: googleData, error: googleError } = await supabase.functions.invoke(
        "sync-google-ads",
        { body: {} }
      );

      if (googleError) {
        console.error("Erro Google Ads:", googleError);
        errors.push(`Google Ads: ${googleError.message}`);
      } else {
        results.google_ads = googleData;
        console.log("✅ Google Ads sincronizado:", googleData);
      }
    } catch (error: any) {
      console.error("Exceção Google Ads:", error);
      errors.push(`Google Ads: ${error.message}`);
    }

    // 3. Sincronizar TikTok Ads
    console.log("🎵 Sincronizando TikTok Ads...");
    try {
      const { data: tiktokData, error: tiktokError } = await supabase.functions.invoke(
        "sync-tiktok-ads",
        { body: {} }
      );

      if (tiktokError) {
        console.error("Erro TikTok Ads:", tiktokError);
        errors.push(`TikTok Ads: ${tiktokError.message}`);
      } else {
        results.tiktok_ads = tiktokData;
        console.log("✅ TikTok Ads sincronizado:", tiktokData);
      }
    } catch (error: any) {
      console.error("Exceção TikTok Ads:", error);
      errors.push(`TikTok Ads: ${error.message}`);
    }

    console.log("✨ Sincronização completa!");

    return new Response(
      JSON.stringify({
        message: "Sincronização de todas as integrações concluída",
        timestamp: new Date().toISOString(),
        results,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Erro geral na sincronização:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
