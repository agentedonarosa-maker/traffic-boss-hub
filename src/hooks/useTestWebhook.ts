import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useTestWebhook = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (webhookId: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase.functions.invoke('dispatch-webhook', {
        body: {
          event: 'test.webhook',
          payload: {
            message: 'Teste de webhook',
            timestamp: new Date().toISOString(),
          },
          userId: user.id,
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Teste enviado",
        description: "O webhook de teste foi disparado. Verifique os logs.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no teste",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
