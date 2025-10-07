import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateIntegrationData {
  client_id: string;
  platform: 'meta' | 'google' | 'tiktok';
  credentials: {
    access_token?: string;
    refresh_token?: string;
    ad_account_id?: string;
    account_id?: string;
    client_id?: string;
    client_secret?: string;
    customer_id?: string;
    developer_token?: string;
    advertiser_id?: string;
    [key: string]: any;
  };
}

export const useCreateIntegration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIntegrationData) => {
      if (!user) throw new Error("Usuário não autenticado");

      // Primeiro, criar a integração sem credenciais
      const { data: integration, error } = await supabase
        .from("integrations")
        .insert({
          client_id: data.client_id,
          platform: data.platform,
          credentials: {}, // Temporariamente vazio
          is_active: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Depois, armazenar credenciais no Vault usando edge function
      const { data: vaultResult, error: vaultError } = await supabase.functions.invoke(
        "manage-integration-credentials",
        {
          body: {
            action: "store",
            integrationId: integration.id,
            credentials: data.credentials,
          },
        }
      );

      if (vaultError) {
        // Rollback: deletar integração se falhar ao armazenar credenciais
        await supabase.from("integrations").delete().eq("id", integration.id);
        throw new Error("Falha ao armazenar credenciais de forma segura");
      }

      return integration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast({
        title: "Integração criada",
        description: "A integração foi conectada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar integração",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
