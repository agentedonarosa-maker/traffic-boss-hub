import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webhookId: string) => {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook removido",
        description: "O webhook foi deletado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao deletar webhook",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
