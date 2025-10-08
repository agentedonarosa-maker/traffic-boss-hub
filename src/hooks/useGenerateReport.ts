import { useState, useCallback } from 'react';
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

  const generateReport = useCallback(async (params: ReportParams) => {
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
      console.log('[Report] Starting report generation:', params);

      // Get client info
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('name, company')
        .eq('id', params.clientId)
        .eq('user_id', user.id)
        .single();

      if (clientError) {
        console.error('[Report] Client error:', clientError);
        throw new Error('Cliente não encontrado');
      }

      console.log('[Report] Client found:', client);

      // Get campaigns for this client
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id, name, platform')
        .eq('client_id', params.clientId)
        .eq('user_id', user.id);

      if (campaignsError) {
        console.error('[Report] Campaigns error:', campaignsError);
        throw new Error('Erro ao buscar campanhas');
      }

      console.log('[Report] Found campaigns:', campaigns?.length || 0);

      const campaignIds = campaigns?.map(c => c.id) || [];
      
      if (!campaigns || campaigns.length === 0) {
        console.warn('[Report] No campaigns found, generating empty report');
      }

      // Get metrics for these campaigns in the period
      let metrics = [];
      let metricsError = null;
      
      if (campaignIds.length > 0) {
        const result = await supabase
          .from('campaign_metrics')
          .select('*')
          .in('campaign_id', campaignIds)
          .gte('date', params.startDate)
          .lte('date', params.endDate)
          .eq('user_id', user.id);
        
        metrics = result.data;
        metricsError = result.error;
      }

      if (metricsError) {
        console.error('[Report] Metrics error:', metricsError);
        throw new Error('Erro ao buscar métricas');
      }

      console.log('[Report] Found metrics:', metrics?.length || 0, 'for period', params.startDate, 'to', params.endDate);

      if (!metrics || metrics.length === 0) {
        console.warn('[Report] No metrics found for the specified period');
      }

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

      console.log('[Report] Report generated successfully:', {
        hasClient: !!client,
        campaigns: report.campaigns.length,
        totalInvestment: report.summary.totalInvestment,
        totalRevenue: report.summary.totalRevenue,
        metricsCount: metrics?.length || 0,
      });

      setReportData(report);

      toast({
        title: "✅ Relatório gerado",
        description: `${report.campaigns.length} campanha(s) analisada(s)`,
      });
    } catch (error: any) {
      console.error('[Report] Error generating report:', error);
      toast({
        title: "❌ Erro ao gerar relatório",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    generateReport,
    reportData,
    loading,
    clearReport: () => setReportData(null),
  };
};
