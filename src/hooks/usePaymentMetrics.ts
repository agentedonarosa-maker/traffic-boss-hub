import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfMonth, endOfMonth, addDays } from "date-fns";

interface PaymentMetrics {
  totalReceivedThisMonth: number;
  totalPending: number;
  totalOverdue: number;
  upcomingPayments: number;
}

export const usePaymentMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payment_metrics", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const upcomingDate = addDays(now, 7);

      const { data: payments, error } = await supabase
        .from("client_payments")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const totalReceivedThisMonth = payments
        ?.filter(
          (p) =>
            p.payment_status === "paid" &&
            p.paid_date &&
            new Date(p.paid_date) >= monthStart &&
            new Date(p.paid_date) <= monthEnd
        )
        .reduce((sum, p) => sum + Number(p.contract_value || 0), 0) || 0;

      const totalPending = payments
        ?.filter((p) => p.payment_status === "pending")
        .reduce((sum, p) => sum + Number(p.contract_value || 0), 0) || 0;

      const totalOverdue = payments
        ?.filter((p) => p.payment_status === "overdue")
        .reduce((sum, p) => sum + Number(p.contract_value || 0), 0) || 0;

      const upcomingPayments =
        payments?.filter(
          (p) =>
            p.payment_status === "pending" &&
            new Date(p.due_date) >= now &&
            new Date(p.due_date) <= upcomingDate
        ).length || 0;

      return {
        totalReceivedThisMonth,
        totalPending,
        totalOverdue,
        upcomingPayments,
      } as PaymentMetrics;
    },
    enabled: !!user,
  });
};
