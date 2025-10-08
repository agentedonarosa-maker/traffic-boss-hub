import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateWebhookData {
  name: string;
  url: string;
  secret: string;
  events: string[];
  retry_count?: number;
  timeout_ms?: number;
}

export const useCreateWebhook = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWebhookData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: webhook, error } = await supabase
        .from('webhooks')
        .insert({
          ...data,
          user_id: user.id,
          retry_count: data.retry_count || 3,
          timeout_ms: data.timeout_ms || 5000,
        })
        .select()
        .single();

      if (error) throw error;
      return webhook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook criado",
        description: "O webhook foi configurado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar webhook",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
