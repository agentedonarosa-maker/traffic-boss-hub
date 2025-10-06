import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, integrationId, credentials } = await req.json();

    console.log(`[manage-integration-credentials] Action: ${action}, Integration: ${integrationId}`);

    if (action === 'store') {
      // Armazenar credenciais no Vault
      const vaultSecretName = `integration_${integrationId}_credentials`;

      // Criar ou atualizar secret no Vault
      const { error: vaultError } = await supabase.rpc('vault.create_secret', {
        secret: JSON.stringify(credentials),
        name: vaultSecretName,
      });

      if (vaultError) {
        console.error('[manage-integration-credentials] Vault error:', vaultError);
        throw new Error(`Failed to store credentials in Vault: ${vaultError.message}`);
      }

      // Atualizar integração com nome do secret
      const { error: updateError } = await supabase
        .from('integrations')
        .update({ 
          vault_secret_name: vaultSecretName,
          credentials: {} // Limpar credenciais do campo JSON por segurança
        })
        .eq('id', integrationId);

      if (updateError) {
        console.error('[manage-integration-credentials] Update error:', updateError);
        throw new Error(`Failed to update integration: ${updateError.message}`);
      }

      console.log(`[manage-integration-credentials] Credentials stored successfully for ${vaultSecretName}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          vaultSecretName,
          message: 'Credentials stored securely in Vault' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'retrieve') {
      // Buscar integração
      const { data: integration, error: intError } = await supabase
        .from('integrations')
        .select('vault_secret_name')
        .eq('id', integrationId)
        .single();

      if (intError || !integration?.vault_secret_name) {
        throw new Error('Integration not found or vault secret not configured');
      }

      // Buscar credenciais do Vault
      const { data: vaultData, error: vaultError } = await supabase.rpc('vault.decrypted_secret', {
        secret_name: integration.vault_secret_name
      });

      if (vaultError) {
        console.error('[manage-integration-credentials] Vault retrieval error:', vaultError);
        throw new Error(`Failed to retrieve credentials from Vault: ${vaultError.message}`);
      }

      console.log('[manage-integration-credentials] Credentials retrieved successfully (***MASKED***)');

      return new Response(
        JSON.stringify({ 
          success: true, 
          credentials: JSON.parse(vaultData.decrypted_secret)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      throw new Error(`Invalid action: ${action}`);
    }

  } catch (error) {
    console.error('[manage-integration-credentials] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});