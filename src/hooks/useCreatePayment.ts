import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { PaymentFormData } from "@/lib/validations/payment";

export const useCreatePayment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentFormData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: payment, error } = await supabase
        .from("client_payments")
        .insert([{
          client_id: data.client_id,
          contract_value: data.contract_value,
          payment_frequency: data.payment_frequency,
          payment_method: data.payment_method,
          payment_status: data.payment_status || "pending",
          due_date: data.due_date,
          paid_date: data.paid_date,
          payment_code: data.payment_code,
          notes: data.notes,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment_metrics"] });
      toast.success("Pagamento registrado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar pagamento: ${error.message}`);
    },
  });
};
