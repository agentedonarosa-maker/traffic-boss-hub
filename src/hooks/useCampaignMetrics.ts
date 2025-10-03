import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CampaignMetric {
  id: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  investment: number;
  leads: number;
  sales: number;
  revenue: number;
  ctr: number;
  cpl: number;
  roas: number;
  created_at: string;
  updated_at: string;
}

export const useCampaignMetrics = (campaignId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["campaign_metrics", user?.id, campaignId],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      let query = supabase
        .from("campaign_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (campaignId) {
        query = query.eq("campaign_id", campaignId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as CampaignMetric[];
    },
    enabled: !!user,
  });
};
