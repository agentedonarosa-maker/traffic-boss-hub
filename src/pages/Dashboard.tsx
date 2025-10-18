import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  Target,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  UserCheck,
  ShoppingCart,
  Plus,
  FileText,
  Loader2,
  CalendarIcon,
  Filter,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useCampaignMetrics } from "@/hooks/useCampaignMetrics";
import { useClients } from "@/hooks/useClients";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<"7days" | "30days" | "month" | "custom">("30days");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const getDateRange = () => {
    const now = new Date();
    switch (dateFilter) {
      case "7days":
        return {
          startDate: format(subDays(now, 7), "yyyy-MM-dd"),
          endDate: format(now, "yyyy-MM-dd"),
        };
      case "30days":
        return {
          startDate: format(subDays(now, 30), "yyyy-MM-dd"),
          endDate: format(now, "yyyy-MM-dd"),
        };
      case "month":
        return {
          startDate: format(startOfMonth(now), "yyyy-MM-dd"),
          endDate: format(endOfMonth(now), "yyyy-MM-dd"),
        };
      case "custom":
        return {
          startDate: customStartDate ? format(customStartDate, "yyyy-MM-dd") : undefined,
          endDate: customEndDate ? format(customEndDate, "yyyy-MM-dd") : undefined,
        };
      default:
        return {};
    }
  };

  const { data: dashboardMetrics, isLoading: isLoadingMetrics } = useDashboardMetrics(getDateRange());
  const { data: campaigns = [] } = useCampaigns();
  const { data: allMetrics = [] } = useCampaignMetrics();
  const { data: clients = [] } = useClients();

  const recentCampaigns = campaigns.slice(0, 5);

  const getCampaignMetrics = (campaignId: string) => {
    const metrics = allMetrics.filter(m => m.campaign_id === campaignId);
    const totalInvestment = metrics.reduce((sum, m) => sum + (m.investment || 0), 0);
    const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
    const roas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
    return { totalInvestment, roas };
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || "Cliente";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      active: { label: "Ativa", className: "bg-success/10 text-success" },
      paused: { label: "Pausada", className: "bg-warning/10 text-warning" },
      completed: { label: "Concluída", className: "bg-muted text-muted-foreground" },
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (isLoadingMetrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Visão geral do desempenho das suas campanhas
          </p>
        </div>
        
        <Card className="p-3 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="month">Mês atual</SelectItem>
                <SelectItem value="custom">Período customizado</SelectItem>
              </SelectContent>
            </Select>
            
            {dateFilter === "custom" && (
              <div className="flex gap-2 flex-col sm:flex-row">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[140px] justify-start text-left font-normal h-9 text-xs",
                        !customStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {customStartDate ? format(customStartDate, "dd/MM/yy") : "Início"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[140px] justify-start text-left font-normal h-9 text-xs",
                        !customEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {customEndDate ? format(customEndDate, "dd/MM/yy") : "Fim"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <MetricCard
          title="Total de Clientes"
          value={dashboardMetrics?.totalClients || 0}
          icon={<Building className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle="Clientes ativos"
          variant="primary"
        />

        <MetricCard
          title="Campanhas Ativas"
          value={dashboardMetrics?.activeCampaigns || 0}
          icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle="Em execução"
        />

        <MetricCard
          title="Investimento Total"
          value={formatCurrency(dashboardMetrics?.totalInvestment || 0)}
          icon={<DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle="Período atual"
        />

        <MetricCard
          title="ROAS Médio"
          value={`${(dashboardMetrics?.avgRoas || 0).toFixed(1)}x`}
          icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle="Retorno sobre investimento"
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <MetricCard
          title="Impressões"
          value={(dashboardMetrics?.totalImpressions || 0).toLocaleString()}
          icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle="Total de visualizações"
        />

        <MetricCard
          title="Cliques"
          value={(dashboardMetrics?.totalClicks || 0).toLocaleString()}
          icon={<MousePointer className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle={`CTR: ${(dashboardMetrics?.avgCtr || 0).toFixed(2)}%`}
        />

        <MetricCard
          title="Leads Gerados"
          value={dashboardMetrics?.totalLeads || 0}
          icon={<UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle="Contatos qualificados"
        />

        <MetricCard
          title="Vendas"
          value={dashboardMetrics?.totalSales || 0}
          icon={<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />}
          subtitle="Conversões realizadas"
          variant="success"
        />
      </div>

      <Card className="shadow-card">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
              Campanhas Recentes
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/campaigns")}
              className="h-8 text-xs sm:text-sm"
            >
              Ver todas
            </Button>
          </div>

          {recentCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Nenhuma campanha cadastrada ainda.
              </p>
            </div>
          ) : (
            <ResponsiveTable>
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Nome</TableHead>
                <TableHead className="text-xs sm:text-sm">Cliente</TableHead>
                <TableHead className="text-xs sm:text-sm">Plataforma</TableHead>
                <TableHead className="text-xs sm:text-sm">Investimento</TableHead>
                <TableHead className="text-xs sm:text-sm">ROAS</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCampaigns.map((campaign) => {
                const { totalInvestment, roas } = getCampaignMetrics(campaign.id);
                return (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium text-foreground text-xs sm:text-sm">
                      {campaign.name}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{getClientName(campaign.client_id)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                        {campaign.platform}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{formatCurrency(totalInvestment)}</TableCell>
                    <TableCell className="font-bold text-success text-xs sm:text-sm">
                      {roas.toFixed(1)}x
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{getStatusBadge(campaign.status)}</TableCell>
                  </TableRow>
                 );
               })}
             </TableBody>
           </Table>
            </ResponsiveTable>
           )}
         </div>
       </Card>

      <Card className="shadow-card">
        <div className="p-3 sm:p-4 md:p-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 sm:mb-4">
            Ações Rápidas
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <Button 
              className="bg-gradient-primary w-full sm:w-auto text-sm"
              onClick={() => navigate("/clients")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cliente
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto text-sm"
              onClick={() => navigate("/campaigns")}
            >
              <Target className="w-4 h-4 mr-2" />
              Ver Campanhas
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto text-sm"
              onClick={() => navigate("/reports")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}