import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/useClients";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAdInsights } from "@/hooks/useAdInsights";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { BarChart3, Users, Smartphone, Clock, MapPin, TrendingUp, Eye, MousePointer, ShoppingCart, DollarSign, FileDown, Lightbulb, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { generateReportPDF } from "@/lib/pdfExport";
import { toast } from "@/hooks/use-toast";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: campaigns, isLoading: loadingCampaigns } = useCampaigns();
  
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7");

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - parseInt(dateRange));

  const { data: insights, isLoading: loadingInsights } = useAdInsights({
    campaignId: selectedCampaign !== "all" ? selectedCampaign : undefined,
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  });

  const filteredCampaigns = campaigns?.filter(c => selectedClient === "all" || c.client_id === selectedClient);

  // Calcular métricas de resumo
  const totalImpressions = insights?.reduce((sum, i) => sum + i.impressions, 0) || 0;
  const totalClicks = insights?.reduce((sum, i) => sum + i.clicks, 0) || 0;
  const totalConversions = insights?.reduce((sum, i) => sum + i.conversions, 0) || 0;
  const totalSpend = insights?.reduce((sum, i) => sum + i.spend, 0) || 0;
  const totalRevenue = insights?.reduce((sum, i) => sum + i.conversion_value, 0) || 0;
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  // Agregações por faixa etária
  const ageData = insights?.reduce((acc: any[], insight) => {
    if (!insight.age_range) return acc;
    const existing = acc.find(item => item.name === insight.age_range);
    if (existing) {
      existing.impressions += insight.impressions;
      existing.clicks += insight.clicks;
      existing.conversions += insight.conversions;
      existing.spend += insight.spend;
      existing.revenue += insight.conversion_value;
    } else {
      acc.push({
        name: insight.age_range,
        impressions: insight.impressions,
        clicks: insight.clicks,
        conversions: insight.conversions,
        spend: insight.spend,
        revenue: insight.conversion_value,
      });
    }
    return acc;
  }, []) || [];

  // Calcular ROAS por faixa etária
  ageData.forEach((item: any) => {
    item.roas = item.spend > 0 ? (item.revenue / item.spend).toFixed(2) : 0;
    item.ctr = item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : 0;
  });

  // Agregações por gênero
  const genderData = insights?.reduce((acc: any[], insight) => {
    if (!insight.gender) return acc;
    const genderLabel = insight.gender === 'male' ? 'Masculino' : insight.gender === 'female' ? 'Feminino' : 'Não especificado';
    const existing = acc.find(item => item.name === genderLabel);
    if (existing) {
      existing.value += insight.conversions;
      existing.spend += insight.spend;
      existing.revenue += insight.conversion_value;
    } else {
      acc.push({
        name: genderLabel,
        value: insight.conversions,
        spend: insight.spend,
        revenue: insight.conversion_value,
      });
    }
    return acc;
  }, []) || [];

  // Agregações por dispositivo
  const deviceData = insights?.reduce((acc: any[], insight) => {
    if (!insight.device_type) return acc;
    const deviceLabel = insight.device_type === 'mobile' ? 'Mobile' : insight.device_type === 'desktop' ? 'Desktop' : 'Tablet';
    const existing = acc.find(item => item.name === deviceLabel);
    if (existing) {
      existing.conversions += insight.conversions;
      existing.spend += insight.spend;
      existing.revenue += insight.conversion_value;
    } else {
      acc.push({
        name: deviceLabel,
        conversions: insight.conversions,
        spend: insight.spend,
        revenue: insight.conversion_value,
      });
    }
    return acc;
  }, []) || [];

  deviceData.forEach((item: any) => {
    item.roas = item.spend > 0 ? (item.revenue / item.spend).toFixed(2) : 0;
  });

  // Agregações por plataforma
  const platformData = insights?.reduce((acc: any[], insight) => {
    if (!insight.publisher_platform) return acc;
    const platformLabel = insight.publisher_platform === 'facebook' ? 'Facebook' : 
                         insight.publisher_platform === 'instagram' ? 'Instagram' : 
                         insight.publisher_platform === 'messenger' ? 'Messenger' : 'Audience Network';
    const existing = acc.find(item => item.name === platformLabel);
    if (existing) {
      existing.value += insight.impressions;
      existing.conversions += insight.conversions;
    } else {
      acc.push({
        name: platformLabel,
        value: insight.impressions,
        conversions: insight.conversions,
      });
    }
    return acc;
  }, []) || [];

  // Agregações por horário
  const hourData = insights?.reduce((acc: any[], insight) => {
    if (insight.hour_of_day === null) return acc;
    const existing = acc.find(item => item.hour === insight.hour_of_day);
    if (existing) {
      existing.conversions += insight.conversions;
      existing.clicks += insight.clicks;
      existing.impressions += insight.impressions;
    } else {
      acc.push({
        hour: insight.hour_of_day,
        conversions: insight.conversions,
        clicks: insight.clicks,
        impressions: insight.impressions,
      });
    }
    return acc;
  }, []) || [];

  hourData.sort((a: any, b: any) => a.hour - b.hour);
  hourData.forEach((item: any) => {
    item.name = `${item.hour}h`;
    item.ctr = item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : 0;
  });

  // Gerar insights automáticos
  const generateInsights = () => {
    const insights: string[] = [];

    // Melhor faixa etária
    const bestAge = ageData.reduce((best: any, current: any) => 
      (parseFloat(current.roas) > parseFloat(best?.roas || 0)) ? current : best, null);
    if (bestAge) {
      insights.push(`Faixa etária ${bestAge.name} apresenta o melhor ROAS (${parseFloat(bestAge.roas).toFixed(1)}x)`);
    }

    // Melhor horário
    const bestHour = hourData.reduce((best: any, current: any) => 
      current.conversions > (best?.conversions || 0) ? current : best, null);
    if (bestHour) {
      insights.push(`Horário de pico: ${bestHour.name} com ${bestHour.conversions} conversões`);
    }

    // Melhor dispositivo
    const bestDevice = deviceData.reduce((best: any, current: any) => 
      (parseFloat(current.roas) > parseFloat(best?.roas || 0)) ? current : best, null);
    if (bestDevice) {
      insights.push(`${bestDevice.name} gera ROAS ${parseFloat(bestDevice.roas).toFixed(1)}x superior`);
    }

    // Melhor plataforma por conversões
    const bestPlatform = platformData.reduce((best: any, current: any) => 
      current.conversions > (best?.conversions || 0) ? current : best, null);
    if (bestPlatform && platformData.length > 1) {
      const total = platformData.reduce((sum: number, p: any) => sum + p.conversions, 0);
      const percentage = ((bestPlatform.conversions / total) * 100).toFixed(0);
      insights.push(`${bestPlatform.name} gera ${percentage}% das conversões`);
    }

    return insights;
  };

  const autoInsights = generateInsights();

  // Função para exportar relatório
  const handleExportPDF = () => {
    try {
      const selectedCampaignData = campaigns?.find(c => c.id === selectedCampaign);
      const selectedClientData = clients?.find(c => c.id === selectedClient);
      
      const reportData = {
        client: {
          name: selectedClientData?.name || "Todos os Clientes",
          company: selectedClientData?.company || null,
        },
        period: {
          start: startDate.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        },
        summary: {
          totalInvestment: totalSpend,
          totalRevenue: totalRevenue,
          totalImpressions: totalImpressions,
          totalClicks: totalClicks,
          totalLeads: totalConversions,
          totalSales: totalConversions,
          avgRoas: avgRoas,
          avgCtr: avgCtr,
          avgCpl: totalConversions > 0 ? totalSpend / totalConversions : 0,
        },
        campaigns: selectedCampaignData ? [{
          id: selectedCampaignData.id,
          name: selectedCampaignData.name,
          platform: selectedCampaignData.platform,
          investment: totalSpend,
          revenue: totalRevenue,
          leads: totalConversions,
          sales: totalConversions,
          roas: avgRoas,
          ctr: avgCtr,
          cpl: totalConversions > 0 ? totalSpend / totalConversions : 0,
        }] : [],
      };

      generateReportPDF(reportData);
      toast({
        title: "✅ Relatório exportado",
        description: "O PDF foi gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao exportar",
        description: "Ocorreu um erro ao gerar o PDF.",
        variant: "destructive",
      });
    }
  };

  // Custom tooltip formatter
  const formatTooltipValue = (value: any, name: string) => {
    if (name === "ROAS" || name.toLowerCase().includes("roas")) {
      return `${parseFloat(value).toFixed(2)}x`;
    }
    if (name === "CTR" || name.toLowerCase().includes("ctr")) {
      return `${parseFloat(value).toFixed(2)}%`;
    }
    if (name.toLowerCase().includes("spend") || name.toLowerCase().includes("investment") || name.toLowerCase().includes("revenue")) {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    }
    return value.toLocaleString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Analytics Avançada
          </h1>
          <p className="text-muted-foreground mt-2">
            Análise granular de performance: demografia, dispositivos, horários e plataformas
          </p>
        </div>
        {insights && insights.length > 0 && (
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>Selecione os parâmetros para análise detalhada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os clientes</SelectItem>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Campanha</label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as campanhas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as campanhas</SelectItem>
                  {filteredCampaigns?.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="14">Últimos 14 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="60">Últimos 60 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSelectedClient("all");
                  setSelectedCampaign("all");
                  setDateRange("7");
                }}
                variant="outline"
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loadingInsights ? (
        <>
          {/* Loading Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-10 w-1/2" />
              </Card>
            ))}
          </div>

          {/* Loading Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : !insights || insights.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <BarChart3 className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum dado disponível</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Importe campanhas do Meta Ads para visualizar análises detalhadas de performance, demografia e comportamento do público.
            </p>
            <Button onClick={() => window.location.href = "/settings"} className="gap-2">
              <Target className="w-4 h-4" />
              Configurar Integrações
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard
              title="Total de Impressões"
              value={totalImpressions.toLocaleString("pt-BR")}
              icon={<Eye className="w-5 h-5" />}
              subtitle={`Últimos ${dateRange} dias`}
              variant="primary"
            />
            <MetricCard
              title="Conversões"
              value={totalConversions.toLocaleString("pt-BR")}
              icon={<ShoppingCart className="w-5 h-5" />}
              subtitle={`CTR: ${avgCtr.toFixed(2)}%`}
              variant="success"
            />
            <MetricCard
              title="Investimento"
              value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalSpend)}
              icon={<DollarSign className="w-5 h-5" />}
              subtitle={`${totalClicks.toLocaleString()} cliques`}
            />
            <MetricCard
              title="ROAS Médio"
              value={`${avgRoas.toFixed(1)}x`}
              icon={<TrendingUp className="w-5 h-5" />}
              subtitle={`Receita: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(totalRevenue)}`}
              variant="success"
            />
          </div>

          {/* Insights Automáticos */}
          {autoInsights.length > 0 && (
            <Card className="shadow-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Principais Descobertas
                </CardTitle>
                <CardDescription>Insights automáticos baseados nos dados analisados</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {autoInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                        <TrendingUp className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-sm text-foreground flex-1">{insight}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance por Faixa Etária */}
          {ageData.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Performance por Faixa Etária
                    </CardTitle>
                    <CardDescription>Conversões e ROAS por idade</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Melhor segmento</p>
                    <p className="text-lg font-bold text-primary">
                      {ageData.reduce((best: any, curr: any) => 
                        parseFloat(curr.roas) > parseFloat(best.roas) ? curr : best
                      ).name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={formatTooltipValue}
                    />
                    <Legend />
                    <Bar dataKey="conversions" fill="hsl(var(--primary))" name="Conversões" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="roas" fill="hsl(var(--chart-2))" name="ROAS" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance por Gênero */}
          {genderData.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Distribuição por Gênero
                    </CardTitle>
                    <CardDescription>Conversões por gênero</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-primary">
                      {genderData.reduce((sum: number, item: any) => sum + item.value, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {genderData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={formatTooltipValue}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

            {/* Performance por Dispositivo */}
            {deviceData.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        Performance por Dispositivo
                      </CardTitle>
                      <CardDescription>Conversões e ROAS por tipo de dispositivo</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Melhor ROAS</p>
                      <p className="text-lg font-bold text-primary">
                        {deviceData.reduce((best: any, curr: any) => 
                          parseFloat(curr.roas) > parseFloat(best.roas) ? curr : best
                        ).name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deviceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={formatTooltipValue}
                      />
                      <Legend />
                      <Bar dataKey="conversions" fill="hsl(var(--primary))" name="Conversões" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="roas" fill="hsl(var(--chart-3))" name="ROAS" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Performance por Plataforma */}
            {platformData.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Distribuição por Plataforma
                      </CardTitle>
                      <CardDescription>Impressões por plataforma</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Líder</p>
                      <p className="text-lg font-bold text-primary">
                        {platformData.reduce((best: any, curr: any) => 
                          curr.value > best.value ? curr : best
                        ).name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {platformData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={formatTooltipValue}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Performance por Horário */}
            {hourData.length > 0 && (
              <Card className="md:col-span-2 shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Performance por Horário do Dia
                      </CardTitle>
                      <CardDescription>Conversões e CTR por hora</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Horário de Pico</p>
                      <p className="text-lg font-bold text-primary">
                        {hourData.reduce((best: any, curr: any) => 
                          curr.conversions > best.conversions ? curr : best
                        ).name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={hourData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={formatTooltipValue}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="conversions" stroke="hsl(var(--primary))" strokeWidth={3} name="Conversões" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="ctr" stroke="hsl(var(--chart-4))" strokeWidth={3} name="CTR (%)" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
