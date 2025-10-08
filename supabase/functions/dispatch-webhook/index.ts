import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

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
    const { event, payload, userId } = await req.json();

    console.log(`Dispatching webhook for event: ${event}`);

    // Buscar webhooks ativos para esse evento e usuário
    const { data: webhooks } = await supabase
      .from('webhooks')
      .select('*')
      .eq('is_active', true)
      .eq('user_id', userId)
      .contains('events', [event]);

    if (!webhooks || webhooks.length === 0) {
      console.log('No active webhooks found for this event');
      return new Response(JSON.stringify({ message: 'No webhooks to dispatch' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const results = [];

    for (const webhook of webhooks) {
      let attempt = 0;
      let success = false;

      while (attempt < webhook.retry_count && !success) {
        attempt++;

        try {
          // Gerar HMAC signature
          const signature = createHmac('sha256', webhook.secret)
            .update(JSON.stringify(payload))
            .digest('hex');

          console.log(`Sending webhook to ${webhook.url}, attempt ${attempt}`);

          // Enviar webhook
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), webhook.timeout_ms);

          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Signature': signature,
              'X-Event-Type': event,
              'X-Webhook-Id': webhook.id,
            },
            body: JSON.stringify({
              event,
              timestamp: new Date().toISOString(),
              data: payload,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          const responseBody = await response.text().catch(() => '');

          // Logar resultado
          await supabase.from('webhook_logs').insert({
            webhook_id: webhook.id,
            event_type: event,
            payload,
            status: response.ok ? 'success' : 'failed',
            response_code: response.status,
            response_body: responseBody.slice(0, 1000), // Limitar tamanho
            attempt_number: attempt,
          });

          success = response.ok;
          results.push({ webhookId: webhook.id, success, status: response.status });

          if (success) {
            console.log(`Webhook sent successfully to ${webhook.url}`);
          } else {
            console.error(`Webhook failed with status ${response.status}`);
          }

        } catch (error) {
          console.error(`Webhook error on attempt ${attempt}:`, error);

          // Logar erro
          await supabase.from('webhook_logs').insert({
            webhook_id: webhook.id,
            event_type: event,
            payload,
            status: attempt < webhook.retry_count ? 'retrying' : 'failed',
            error_message: error.message,
            attempt_number: attempt,
          });

          if (attempt >= webhook.retry_count) {
            results.push({ webhookId: webhook.id, success: false, error: error.message });
          } else {
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Dispatch webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
