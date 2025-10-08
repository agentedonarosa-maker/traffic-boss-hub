import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    if (path === 'start') {
      // Iniciar OAuth flow
      const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID');
      const redirectUri = `${supabaseUrl}/functions/v1/google-calendar-auth/callback`;
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId!);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email');
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      return new Response(JSON.stringify({ authUrl: authUrl.toString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === 'callback') {
      const code = url.searchParams.get('code');
      
      if (!code) {
        throw new Error('Código de autorização não encontrado');
      }

      // Trocar código por tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID')!,
          client_secret: Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET')!,
          redirect_uri: `${supabaseUrl}/functions/v1/google-calendar-auth/callback`,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        throw new Error(tokens.error_description || tokens.error);
      }

      // Buscar email do usuário
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });
      const userInfo = await userInfoResponse.json();

      // Pegar o user_id do JWT
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Armazenar tokens no banco
      const { error: dbError } = await supabase
        .from('user_google_tokens')
        .upsert({
          user_id: user.id,
          refresh_token: tokens.refresh_token,
          access_token: tokens.access_token,
          token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          calendar_id: userInfo.email,
        });

      if (dbError) throw dbError;

      // Redirecionar para página de sucesso
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${url.origin}/settings?google_calendar_connected=true`,
        },
      });
    }

  } catch (error) {
    console.error('Google Calendar Auth Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Invalid path' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
