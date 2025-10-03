import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ReportParams {
  clientId: string;
  startDate: string;
  endDate: string;
  reportType: 'monthly' | 'weekly' | 'custom';
}

interface ReportData {
  client: {
    name: string;
    company: string | null;
  };
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalInvestment: number;
    totalRevenue: number;
    totalImpressions: number;
    totalClicks: number;
    totalLeads: number;
    totalSales: number;
    avgRoas: number;
    avgCtr: number;
    avgCpl: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    platform: string;
    investment: number;
    revenue: number;
    leads: number;
    sales: number;
    roas: number;
    ctr: number;
    cpl: number;
  }>;
}

export const useGenerateReport = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const generateReport = async (params: ReportParams) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get client info
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('name, company')
        .eq('id', params.clientId)
        .eq('user_id', user.id)
        .single();

      if (clientError) throw clientError;

      // Get campaigns for this client
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id, name, platform')
        .eq('client_id', params.clientId)
        .eq('user_id', user.id);

      if (campaignsError) throw campaignsError;

      const campaignIds = campaigns?.map(c => c.id) || [];

      // Get metrics for these campaigns in the period
      const { data: metrics, error: metricsError } = await supabase
        .from('campaign_metrics')
        .select('*')
        .in('campaign_id', campaignIds)
        .gte('date', params.startDate)
        .lte('date', params.endDate)
        .eq('user_id', user.id);

      if (metricsError) throw metricsError;

      // Calculate summary metrics
      const totalInvestment = metrics?.reduce((sum, m) => sum + (m.investment || 0), 0) || 0;
      const totalRevenue = metrics?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
      const totalImpressions = metrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0;
      const totalClicks = metrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0;
      const totalLeads = metrics?.reduce((sum, m) => sum + (m.leads || 0), 0) || 0;
      const totalSales = metrics?.reduce((sum, m) => sum + (m.sales || 0), 0) || 0;

      const avgRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
      const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const avgCpl = totalLeads > 0 ? totalInvestment / totalLeads : 0;

      // Calculate metrics per campaign
      const campaignMetrics = campaigns?.map(campaign => {
        const campaignData = metrics?.filter(m => m.campaign_id === campaign.id) || [];
        
        const investment = campaignData.reduce((sum, m) => sum + (m.investment || 0), 0);
        const revenue = campaignData.reduce((sum, m) => sum + (m.revenue || 0), 0);
        const impressions = campaignData.reduce((sum, m) => sum + (m.impressions || 0), 0);
        const clicks = campaignData.reduce((sum, m) => sum + (m.clicks || 0), 0);
        const leads = campaignData.reduce((sum, m) => sum + (m.leads || 0), 0);
        const sales = campaignData.reduce((sum, m) => sum + (m.sales || 0), 0);

        const roas = investment > 0 ? revenue / investment : 0;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const cpl = leads > 0 ? investment / leads : 0;

        return {
          id: campaign.id,
          name: campaign.name,
          platform: campaign.platform,
          investment,
          revenue,
          leads,
          sales,
          roas,
          ctr,
          cpl,
        };
      }) || [];

      const report: ReportData = {
        client: {
          name: client.name,
          company: client.company,
        },
        period: {
          start: params.startDate,
          end: params.endDate,
        },
        summary: {
          totalInvestment,
          totalRevenue,
          totalImpressions,
          totalClicks,
          totalLeads,
          totalSales,
          avgRoas,
          avgCtr,
          avgCpl,
        },
        campaigns: campaignMetrics,
      };

      setReportData(report);

      toast({
        title: "Sucesso",
        description: "Relatório gerado com sucesso",
      });
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    generateReport,
    reportData,
    loading,
    clearReport: () => setReportData(null),
  };
};
