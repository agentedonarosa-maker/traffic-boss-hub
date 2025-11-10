import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payments", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("client_payments")
        .select(`
          *,
          clients (
            id,
            name,
            company
          )
        `)
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      if (error) {
        console.error("Error loading payments with client data:", error);
        
        // Fallback: carregar sem join se FK não existir
        const { data: paymentsOnly, error: fallbackError } = await supabase
          .from("client_payments")
          .select("*")
          .eq("user_id", user.id)
          .order("due_date", { ascending: true });
        
        if (fallbackError) throw fallbackError;
        return paymentsOnly;
      }
      
      return data;
    },
    enabled: !!user,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
