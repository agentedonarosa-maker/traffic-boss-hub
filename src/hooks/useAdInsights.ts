import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AdInsight {
  id: string;
  user_id: string;
  campaign_id: string;
  ad_id: string;
  ad_name: string | null;
  date: string;
  age_range: string | null;
  gender: string | null;
  country: string | null;
  region: string | null;
  device_type: string | null;
  publisher_platform: string | null;
  placement: string | null;
  hour_of_day: number | null;
  day_of_week: number | null;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  conversion_value: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  created_at: string;
  updated_at: string;
}

export interface AdInsightsFilters {
  campaignId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'age' | 'gender' | 'device' | 'placement' | 'hour' | 'platform';
}

export const useAdInsights = (filters?: AdInsightsFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["ad_insights", user?.id, filters],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      let query = supabase
        .from("ad_insights")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (filters?.campaignId) {
        query = query.eq("campaign_id", filters.campaignId);
      }

      if (filters?.startDate) {
        query = query.gte("date", filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte("date", filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AdInsight[];
    },
    enabled: !!user,
  });
};
