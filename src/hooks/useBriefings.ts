import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBriefings = () => {
  return useQuery({
    queryKey: ["briefings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_briefings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
