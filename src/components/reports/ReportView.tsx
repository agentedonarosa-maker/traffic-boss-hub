import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, DollarSign, Target, Users, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface ReportViewProps {
  data: ReportData;
  onExport?: () => void;
}

export default function ReportView({ data, onExport }: ReportViewProps) {
  useEffect(() => {
    console.log('[ReportView] Rendering with data:', {
      hasClient: !!data?.client,
      clientName: data?.client?.name,
      hasPeriod: !!data?.period,
      hasSummary: !!data?.summary,
      campaignsCount: data?.campaigns?.length || 0,
    });
  }, [data]);

  // Validate required data
  if (!data || !data.client || !data.period || !data.summary) {
    console.error('[ReportView] Invalid data structure:', data);
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <p className="text-destructive">Dados do relatório inválidos ou incompletos</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const formatPercentage = (value: number) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  const formatSafeDate = (dateString: string, formatStr: string) => {
    try {
      return format(new Date(dateString), formatStr, { locale: ptBR });
    } catch (error) {
      console.error('[ReportView] Date formatting error:', error);
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Relatório - {data.client.name}
                {data.client.company && ` (${data.client.company})`}
              </CardTitle>
              <CardDescription>
                Período: {formatSafeDate(data.period.start, "dd 'de' MMMM")} até{' '}
                {formatSafeDate(data.period.end, "dd 'de' MMMM 'de' yyyy")}
              </CardDescription>
            </div>
            <Button onClick={onExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investimento Total</p>
                <p className="text-2xl font-bold">{formatCurrency(data.summary.totalInvestment)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROAS Médio</p>
                <p className="text-2xl font-bold">{data.summary.avgRoas.toFixed(2)}x</p>
              </div>
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Leads</p>
                <p className="text-2xl font-bold">{formatNumber(data.summary.totalLeads)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Impressões</p>
              <p className="text-xl font-semibold">{formatNumber(data.summary.totalImpressions)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">CTR Médio</p>
              <p className="text-xl font-semibold">{formatPercentage(data.summary.avgCtr)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">CPL Médio</p>
              <p className="text-xl font-semibold">{formatCurrency(data.summary.avgCpl)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Performance por Campanha</CardTitle>
          <CardDescription>Detalhamento de cada campanha no período</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead className="text-right">Investimento</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Vendas</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">CPL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Nenhuma campanha encontrada no período
                  </TableCell>
                </TableRow>
              ) : (
                data.campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.platform}</TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.investment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.revenue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {campaign.roas >= 3 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        {campaign.roas.toFixed(2)}x
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(campaign.leads)}</TableCell>
                    <TableCell className="text-right">{formatNumber(campaign.sales)}</TableCell>
                    <TableCell className="text-right">{formatPercentage(campaign.ctr)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.cpl)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
