import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/useClients";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAdInsights } from "@/hooks/useAdInsights";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { BarChart3, Users, Smartphone, Clock, MapPin, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: campaigns, isLoading: loadingCampaigns } = useCampaigns();
  
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("7");

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - parseInt(dateRange));

  const { data: insights, isLoading: loadingInsights } = useAdInsights({
    campaignId: selectedCampaign || undefined,
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  });

  const filteredCampaigns = campaigns?.filter(c => !selectedClient || c.client_id === selectedClient);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          Analytics Avançada
        </h1>
        <p className="text-muted-foreground mt-2">
          Análise granular de performance: demografia, dispositivos, horários e plataformas
        </p>
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
                  <SelectItem value="">Todos os clientes</SelectItem>
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
                  <SelectItem value="">Todas as campanhas</SelectItem>
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
                  setSelectedClient("");
                  setSelectedCampaign("");
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
      ) : !insights || insights.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Nenhum dado disponível</p>
            <p className="text-sm text-muted-foreground mt-2">
              Importe campanhas do Meta Ads para visualizar analytics granulares
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance por Faixa Etária */}
          {ageData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Performance por Faixa Etária
                </CardTitle>
                <CardDescription>Conversões e ROAS por idade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="conversions" fill="hsl(var(--primary))" name="Conversões" />
                    <Bar dataKey="roas" fill="hsl(var(--chart-2))" name="ROAS" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance por Gênero */}
          {genderData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Distribuição por Gênero
                </CardTitle>
                <CardDescription>Conversões por gênero</CardDescription>
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
                      outerRadius={80}
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
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance por Dispositivo */}
          {deviceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Performance por Dispositivo
                </CardTitle>
                <CardDescription>Conversões e ROAS por tipo de dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deviceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="conversions" fill="hsl(var(--primary))" name="Conversões" />
                    <Bar dataKey="roas" fill="hsl(var(--chart-3))" name="ROAS" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance por Plataforma */}
          {platformData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Distribuição por Plataforma
                </CardTitle>
                <CardDescription>Impressões por plataforma</CardDescription>
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
                      outerRadius={80}
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
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance por Horário */}
          {hourData.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Performance por Horário do Dia
                </CardTitle>
                <CardDescription>Conversões e CTR por hora</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="conversions" stroke="hsl(var(--primary))" strokeWidth={2} name="Conversões" />
                    <Line type="monotone" dataKey="ctr" stroke="hsl(var(--chart-4))" strokeWidth={2} name="CTR (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
