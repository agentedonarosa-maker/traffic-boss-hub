import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdatePaymentData {
  id: string;
  payment_status?: string;
  paid_date?: string;
  payment_code?: string;
  notes?: string;
}

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePaymentData) => {
      const { data: payment, error } = await supabase
        .from("client_payments")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment_metrics"] });
      toast.success("Pagamento atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar pagamento: ${error.message}`);
    },
  });
};
