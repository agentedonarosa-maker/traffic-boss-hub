import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Campaign {
  id: string;
  name: string;
  client_id: string;
  platform: string;
  objective: string;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["campaigns", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
    enabled: !!user,
  });
};
