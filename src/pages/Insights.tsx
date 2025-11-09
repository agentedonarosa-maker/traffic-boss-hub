import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useCampaignMetrics } from "@/hooks/useCampaignMetrics";
import { useAdInsights } from "@/hooks/useAdInsights";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useClients } from "@/hooks/useClients";
import { TrendingUp, TrendingDown, DollarSign, Target, Users, MousePointerClick } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function Insights() {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30");

  const { data: campaigns } = useCampaigns();
  const { data: clients } = useClients();
  const { data: metrics } = useCampaignMetrics(selectedCampaign !== "all" ? selectedCampaign : undefined);
  const { data: insights } = useAdInsights({
    campaignId: selectedCampaign !== "all" ? selectedCampaign : undefined,
  });

  // Filter data based on selections
  const filteredMetrics = metrics?.filter(m => {
    const metricsDate = new Date(m.date);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
    
    if (metricsDate < daysAgo) return false;
    
    if (selectedClient !== "all") {
      const campaign = campaigns?.find(c => c.id === m.campaign_id);
      if (campaign?.client_id !== selectedClient) return false;
    }
    
    if (selectedPlatform !== "all") {
      const campaign = campaigns?.find(c => c.id === m.campaign_id);
      if (campaign?.platform !== selectedPlatform) return false;
    }
    
    return true;
  }) || [];

  // Calculate KPIs
  const totalInvestment = filteredMetrics.reduce((sum, m) => sum + (m.investment || 0), 0);
  const totalRevenue = filteredMetrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
  const totalImpressions = filteredMetrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
  const totalClicks = filteredMetrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
  const totalLeads = filteredMetrics.reduce((sum, m) => sum + (m.leads || 0), 0);
  
  const avgRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpl = totalLeads > 0 ? totalInvestment / totalLeads : 0;

  // Prepare trend data
  const trendData = filteredMetrics
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      roas: m.roas,
      investment: m.investment,
      revenue: m.revenue,
      ctr: m.ctr,
    }));

  // Top campaigns by ROAS
  const campaignPerformance = campaigns?.map(c => {
    const campaignMetrics = filteredMetrics.filter(m => m.campaign_id === c.id);
    const investment = campaignMetrics.reduce((sum, m) => sum + (m.investment || 0), 0);
    const revenue = campaignMetrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
    const roas = investment > 0 ? revenue / investment : 0;
    
    return {
      name: c.name,
      roas,
      investment,
      revenue,
    };
  }).filter(c => c.investment > 0)
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 5) || [];

  // Platform distribution
  const platformData = campaigns?.reduce((acc, c) => {
    const campaignMetrics = filteredMetrics.filter(m => m.campaign_id === c.id);
    const investment = campaignMetrics.reduce((sum, m) => sum + (m.investment || 0), 0);
    
    const existing = acc.find(p => p.name === c.platform);
    if (existing) {
      existing.value += investment;
    } else {
      acc.push({ name: c.platform, value: investment });
    }
    return acc;
  }, [] as { name: string; value: number }[]) || [];

  // Demographics insights
  const ageData = insights?.reduce((acc, i) => {
    if (!i.age_range) return acc;
    const existing = acc.find(a => a.age === i.age_range);
    if (existing) {
      existing.impressions += i.impressions;
      existing.clicks += i.clicks;
      existing.conversions += i.conversions;
    } else {
      acc.push({
        age: i.age_range,
        impressions: i.impressions,
        clicks: i.clicks,
        conversions: i.conversions,
      });
    }
    return acc;
  }, [] as { age: string; impressions: number; clicks: number; conversions: number }[]) || [];

  const genderData = insights?.reduce((acc, i) => {
    if (!i.gender) return acc;
    const existing = acc.find(g => g.gender === i.gender);
    if (existing) {
      existing.spend += i.spend;
      existing.conversions += i.conversions;
    } else {
      acc.push({
        gender: i.gender,
        spend: i.spend,
        conversions: i.conversions,
      });
    }
    return acc;
  }, [] as { gender: string; spend: number; conversions: number }[]) || [];

  const deviceData = insights?.reduce((acc, i) => {
    if (!i.device_type) return acc;
    const existing = acc.find(d => d.device === i.device_type);
    if (existing) {
      existing.impressions += i.impressions;
      existing.conversions += i.conversions;
    } else {
      acc.push({
        device: i.device_type,
        impressions: i.impressions,
        conversions: i.conversions,
      });
    }
    return acc;
  }, [] as { device: string; impressions: number; conversions: number }[]) || [];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))'];

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4 md:p-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Insights Avançados</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Análise detalhada de performance com KPIs e gráficos interativos</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Cliente</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os clientes</SelectItem>
                  {clients?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Campanha</label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as campanhas</SelectItem>
                  {campaigns?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Plataforma</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as plataformas</SelectItem>
                  <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="ROAS Médio"
          value={avgRoas.toFixed(2)}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="CTR Médio"
          value={`${avgCtr.toFixed(2)}%`}
          icon={<MousePointerClick className="w-5 h-5" />}
        />
        <MetricCard
          title="CPL Médio"
          value={`R$ ${avgCpl.toFixed(2)}`}
          icon={<Target className="w-5 h-5" />}
        />
        <MetricCard
          title="Investimento"
          value={`R$ ${totalInvestment.toLocaleString('pt-BR')}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          title="Receita"
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          title="Leads"
          value={totalLeads.toString()}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs sm:text-sm">Campanhas</TabsTrigger>
          <TabsTrigger value="platforms" className="text-xs sm:text-sm">Plataformas</TabsTrigger>
          <TabsTrigger value="demographics" className="text-xs sm:text-sm">Demográfico</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                roas: { label: "ROAS", color: "hsl(var(--primary))" },
                ctr: { label: "CTR %", color: "hsl(var(--secondary))" },
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="roas" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="ctr" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investimento vs Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                investment: { label: "Investimento", color: "hsl(var(--destructive))" },
                revenue: { label: "Receita", color: "hsl(var(--primary))" },
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="investment" fill="hsl(var(--destructive))" />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Campanhas por ROAS</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                roas: { label: "ROAS", color: "hsl(var(--primary))" },
              }}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={campaignPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="roas" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Investimento por Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Faixa Etária</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  impressions: { label: "Impressões", color: "hsl(var(--primary))" },
                  conversions: { label: "Conversões", color: "hsl(var(--secondary))" },
                }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="impressions" fill="hsl(var(--primary))" />
                      <Bar dataKey="conversions" fill="hsl(var(--secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Gênero</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  spend: { label: "Gasto", color: "hsl(var(--destructive))" },
                  conversions: { label: "Conversões", color: "hsl(var(--primary))" },
                }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={genderData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gender" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="spend" fill="hsl(var(--destructive))" />
                      <Bar dataKey="conversions" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Dispositivo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="impressions"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
