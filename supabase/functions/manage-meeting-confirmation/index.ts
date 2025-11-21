import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmationRequest {
  token: string;
  meeting_id: string;
  action: 'confirm' | 'decline' | 'suggest';
  suggested_dates?: string[];
  notes?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { token, meeting_id, action, suggested_dates, notes } = await req.json() as ConfirmationRequest;

    console.log('Processing confirmation:', { meeting_id, action });

    // Validate token
    const { data: clientAccess, error: tokenError } = await supabaseClient
      .from('client_access')
      .select('client_id, is_active')
      .eq('access_token', token)
      .eq('is_active', true)
      .single();

    if (tokenError || !clientAccess) {
      console.error('Invalid token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get meeting and validate it belongs to this client
    const { data: meeting, error: meetingError } = await supabaseClient
      .from('meetings')
      .select('*, clients!inner(user_id, name)')
      .eq('id', meeting_id)
      .eq('client_id', clientAccess.client_id)
      .single();

    if (meetingError || !meeting) {
      console.error('Meeting not found:', meetingError);
      return new Response(
        JSON.stringify({ error: 'Reunião não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update meeting based on action
    let updateData: any = {
      client_confirmed_at: new Date().toISOString(),
      client_notes: notes || null,
    };

    let notificationMessage = '';
    let notificationTitle = '';

    switch (action) {
      case 'confirm':
        updateData.client_confirmation_status = 'confirmed';
        notificationTitle = '✅ Reunião confirmada';
        notificationMessage = `${meeting.clients.name} confirmou presença na reunião "${meeting.title}"`;
        break;

      case 'decline':
        updateData.client_confirmation_status = 'declined';
        notificationTitle = '❌ Reunião recusada';
        notificationMessage = `${meeting.clients.name} não poderá comparecer à reunião "${meeting.title}"`;
        if (notes) {
          notificationMessage += `. Motivo: ${notes}`;
        }
        break;

      case 'suggest':
        if (!suggested_dates || suggested_dates.length === 0) {
          return new Response(
            JSON.stringify({ error: 'É necessário fornecer pelo menos uma sugestão de data' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        updateData.client_confirmation_status = 'rescheduled';
        updateData.client_suggested_dates = JSON.stringify(suggested_dates);
        notificationTitle = '📅 Reagendamento solicitado';
        notificationMessage = `${meeting.clients.name} sugeriu novos horários para a reunião "${meeting.title}"`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Ação inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Update meeting
    const { data: updatedMeeting, error: updateError } = await supabaseClient
      .from('meetings')
      .update(updateData)
      .eq('id', meeting_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating meeting:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao atualizar reunião' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create notification for agency
    const { error: notificationError } = await supabaseClient.rpc(
      'create_notification_secure',
      {
        p_user_id: meeting.clients.user_id,
        p_title: notificationTitle,
        p_message: notificationMessage,
        p_type: action === 'confirm' ? 'success' : action === 'decline' ? 'warning' : 'info',
      }
    );

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    // Update last_accessed_at for client access
    await supabaseClient
      .from('client_access')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('access_token', token);

    console.log('Meeting confirmation processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        meeting: updatedMeeting,
        message: action === 'confirm' 
          ? 'Presença confirmada com sucesso!' 
          : action === 'decline'
          ? 'Resposta registrada'
          : 'Sugestões enviadas com sucesso!',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in manage-meeting-confirmation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
