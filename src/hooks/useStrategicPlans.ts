import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStrategicPlans = () => {
  return useQuery({
    queryKey: ["strategic-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5,
  });
};
