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

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { meetingId, action } = await req.json();

    // Pegar o user_id do JWT
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar tokens do usuário
    const { data: tokens } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!tokens) {
      throw new Error('Google Calendar não conectado');
    }

    // Verificar se o token expirou e renovar se necessário
    let accessToken = tokens.access_token;
    if (new Date(tokens.token_expiry) <= new Date()) {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID')!,
          client_secret: Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET')!,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      const newTokens = await tokenResponse.json();
      accessToken = newTokens.access_token;

      // Atualizar token no banco
      await supabase
        .from('user_google_tokens')
        .update({
          access_token: accessToken,
          token_expiry: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
        })
        .eq('user_id', user.id);
    }

    switch (action) {
      case 'create': {
        // Buscar dados da reunião
        const { data: meeting } = await supabase
          .from('meetings')
          .select('*, clients(*)')
          .eq('id', meetingId)
          .single();

        if (!meeting) {
          throw new Error('Reunião não encontrada');
        }

        // Criar evento no Google Calendar com Meet
        const eventData = {
          summary: meeting.title,
          description: meeting.description || '',
          start: {
            dateTime: meeting.meeting_date,
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: new Date(new Date(meeting.meeting_date).getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
          attendees: meeting.clients?.contact ? [
            { email: meeting.clients.contact, displayName: meeting.clients.name }
          ] : [],
        };

        const eventResponse = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
          }
        );

        const event = await eventResponse.json();

        if (event.error) {
          throw new Error(event.error.message);
        }

        // Atualizar reunião com google_event_id e meet_link
        await supabase
          .from('meetings')
          .update({
            google_event_id: event.id,
            google_meet_link: event.hangoutLink,
            is_synced_with_google: true,
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', meetingId);

        return new Response(
          JSON.stringify({ success: true, meetLink: event.hangoutLink }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { data: meeting } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', meetingId)
          .single();

        if (!meeting || !meeting.google_event_id) {
          throw new Error('Reunião não encontrada ou não sincronizada');
        }

        const eventData = {
          summary: meeting.title,
          description: meeting.description || '',
          start: {
            dateTime: meeting.meeting_date,
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: new Date(new Date(meeting.meeting_date).getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
        };

        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${meeting.google_event_id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
          }
        );

        await supabase
          .from('meetings')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', meetingId);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { data: meeting } = await supabase
          .from('meetings')
          .select('google_event_id')
          .eq('id', meetingId)
          .single();

        if (meeting?.google_event_id) {
          await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${meeting.google_event_id}`,
            {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${accessToken}` },
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Ação inválida');
    }
  } catch (error) {
    console.error('Sync Google Calendar Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
