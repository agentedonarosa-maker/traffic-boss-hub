import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidateTokenRequest {
  token: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token }: ValidateTokenRequest = await req.json();

    if (!token) {
      console.error("Token not provided");
      return new Response(
        JSON.stringify({ error: "Token é obrigatório" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Usar service_role para validar token (bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Buscar acesso do cliente pelo token
    const { data: access, error: accessError } = await supabaseAdmin
      .from("client_access")
      .select(`
        id,
        client_id,
        is_active,
        created_at,
        last_accessed_at,
        client:clients(
          id,
          name,
          company,
          contact,
          niche,
          monthly_budget,
          strategic_notes
        )
      `)
      .eq("access_token", token)
      .eq("is_active", true)
      .single();

    if (accessError || !access) {
      console.error("Token inválido ou inativo:", accessError);
      return new Response(
        JSON.stringify({ error: "Token inválido ou inativo" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const clientId = access.client_id;

    // Buscar reuniões do cliente
    const { data: meetings, error: meetingsError } = await supabaseAdmin
      .from("meetings")
      .select("id, title, description, meeting_date, feedback, created_at")
      .eq("client_id", clientId)
      .order("meeting_date", { ascending: true });

    if (meetingsError) {
      console.error("Erro ao buscar reuniões:", meetingsError);
    }

    // Buscar campanhas do cliente
    const { data: campaigns, error: campaignsError } = await supabaseAdmin
      .from("campaigns")
      .select("id, name, platform, objective, budget, start_date, end_date, status, created_at")
      .eq("client_id", clientId);

    if (campaignsError) {
      console.error("Erro ao buscar campanhas:", campaignsError);
    }

    const campaignIds = campaigns?.map((c) => c.id) || [];

    // Buscar métricas das campanhas
    let metrics = null;
    if (campaignIds.length > 0) {
      const { data: metricsData, error: metricsError } = await supabaseAdmin
        .from("campaign_metrics")
        .select("*")
        .in("campaign_id", campaignIds)
        .order("date", { ascending: false })
        .limit(30);

      if (metricsError) {
        console.error("Erro ao buscar métricas:", metricsError);
      } else {
        metrics = metricsData;
      }
    }

    // Buscar tarefas do cliente
    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from("tasks")
      .select("id, title, description, due_date, priority, status, completed_at, created_at")
      .eq("client_id", clientId)
      .order("due_date", { ascending: true });

    if (tasksError) {
      console.error("Erro ao buscar tarefas:", tasksError);
    }

    // Atualizar last_accessed_at
    await supabaseAdmin
      .from("client_access")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("access_token", token);

    console.log(`Token validado com sucesso para cliente: ${access.client.name}`);

    return new Response(
      JSON.stringify({
        client: access.client,
        meetings: meetings || [],
        campaigns: campaigns || [],
        metrics: metrics || [],
        tasks: tasks || [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erro na função validate-client-token:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
