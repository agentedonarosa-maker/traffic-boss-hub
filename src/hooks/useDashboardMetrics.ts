import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardMetrics {
  totalClients: number;
  activeCampaigns: number;
  totalInvestment: number;
  totalRevenue: number;
  avgRoas: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  totalSales: number;
  avgCtr: number;
}

interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export const useDashboardMetrics = (dateFilter?: DateFilter) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboard_metrics", user?.id, dateFilter],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      // Get total clients
      const { count: totalClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get active campaigns
      const { count: activeCampaigns } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active");

      // Get metrics aggregations with date filter
      let metricsQuery = supabase
        .from("campaign_metrics")
        .select("*")
        .eq("user_id", user.id);
      
      if (dateFilter?.startDate) {
        metricsQuery = metricsQuery.gte("date", dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        metricsQuery = metricsQuery.lte("date", dateFilter.endDate);
      }

      const { data: metrics } = await metricsQuery;

      const totalInvestment = metrics?.reduce((sum, m) => sum + (m.investment || 0), 0) || 0;
      const totalRevenue = metrics?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
      const totalImpressions = metrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0;
      const totalClicks = metrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0;
      const totalLeads = metrics?.reduce((sum, m) => sum + (m.leads || 0), 0) || 0;
      const totalSales = metrics?.reduce((sum, m) => sum + (m.sales || 0), 0) || 0;

      const avgRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
      const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      return {
        totalClients: totalClients || 0,
        activeCampaigns: activeCampaigns || 0,
        totalInvestment,
        totalRevenue,
        avgRoas,
        totalImpressions,
        totalClicks,
        totalLeads,
        totalSales,
        avgCtr,
      } as DashboardMetrics;
    },
    enabled: !!user,
  });
};
