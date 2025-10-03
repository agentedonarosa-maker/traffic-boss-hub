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
    mutationFn: async ({ id, ...data }: UpdateIntegrationData) => {
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
