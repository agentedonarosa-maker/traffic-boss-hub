import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UpdateIntegrationData {
  id: string;
  credentials?: any;
  is_active?: boolean;
}

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, credentials, ...data }: UpdateIntegrationData) => {
      // Se houver credenciais para atualizar, usar Vault
      if (credentials) {
        const { error: vaultError } = await supabase.functions.invoke(
          "manage-integration-credentials",
          {
            body: {
              action: "store",
              integrationId: id,
              credentials,
            },
          }
        );

        if (vaultError) {
          throw new Error("Falha ao atualizar credenciais de forma segura");
        }
      }

      // Atualizar outros campos da integração
      const { data: integration, error } = await supabase
        .from("integrations")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return integration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast({
        title: "Integração atualizada",
        description: "As credenciais foram atualizadas com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar integração",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
