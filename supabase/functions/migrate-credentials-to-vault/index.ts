import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[migrate-credentials-to-vault] Starting migration...');

    // Buscar todas as integrações que ainda não foram migradas
    const { data: integrations, error: fetchError } = await supabase
      .from('integrations')
      .select('id, credentials, vault_secret_name')
      .is('vault_secret_name', null);

    if (fetchError) {
      throw new Error(`Failed to fetch integrations: ${fetchError.message}`);
    }

    if (!integrations || integrations.length === 0) {
      console.log('[migrate-credentials-to-vault] No integrations to migrate');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No integrations to migrate',
          migrated: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[migrate-credentials-to-vault] Found ${integrations.length} integrations to migrate`);

    let migratedCount = 0;
    const errors: any[] = [];

    for (const integration of integrations) {
      try {
        // Verificar se há credenciais para migrar
        if (!integration.credentials || Object.keys(integration.credentials).length === 0) {
          console.log(`[migrate-credentials-to-vault] Integration ${integration.id} has no credentials to migrate`);
          continue;
        }

        const vaultSecretName = `integration_${integration.id}_credentials`;

        // Criar secret no Vault
        const { error: vaultError } = await supabase.rpc('vault.create_secret', {
          secret: JSON.stringify(integration.credentials),
          name: vaultSecretName,
        });

        if (vaultError) {
          console.error(`[migrate-credentials-to-vault] Vault error for ${integration.id}:`, vaultError);
          errors.push({
            integrationId: integration.id,
            error: `Vault error: ${vaultError.message}`
          });
          continue;
        }

        // Atualizar integração
        const { error: updateError } = await supabase
          .from('integrations')
          .update({ 
            vault_secret_name: vaultSecretName,
            credentials: {} // Limpar credenciais
          })
          .eq('id', integration.id);

        if (updateError) {
          console.error(`[migrate-credentials-to-vault] Update error for ${integration.id}:`, updateError);
          errors.push({
            integrationId: integration.id,
            error: `Update error: ${updateError.message}`
          });
          continue;
        }

        migratedCount++;
        console.log(`[migrate-credentials-to-vault] Successfully migrated integration ${integration.id}`);

      } catch (error: any) {
        console.error(`[migrate-credentials-to-vault] Error migrating ${integration.id}:`, error);
        errors.push({
          integrationId: integration.id,
          error: error.message
        });
      }
    }

    console.log(`[migrate-credentials-to-vault] Migration complete: ${migratedCount}/${integrations.length} migrated`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration completed',
        migrated: migratedCount,
        total: integrations.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[migrate-credentials-to-vault] Fatal error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});