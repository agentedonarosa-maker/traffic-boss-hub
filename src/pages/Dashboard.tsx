import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useCampaignMetrics } from "@/hooks/useCampaignMetrics";
import { useClients } from "@/hooks/useClients";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: dashboardMetrics, isLoading: isLoadingMetrics } = useDashboardMetrics();
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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Visão geral do desempenho das suas campanhas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Total de Clientes"
          value={dashboardMetrics?.totalClients || 0}
          icon={<Building className="w-5 h-5" />}
          subtitle="Clientes ativos"
          variant="primary"
        />

        <MetricCard
          title="Campanhas Ativas"
          value={dashboardMetrics?.activeCampaigns || 0}
          icon={<Target className="w-5 h-5" />}
          subtitle="Em execução"
        />

        <MetricCard
          title="Investimento Total"
          value={formatCurrency(dashboardMetrics?.totalInvestment || 0)}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Período atual"
        />

        <MetricCard
          title="ROAS Médio"
          value={`${(dashboardMetrics?.avgRoas || 0).toFixed(1)}x`}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Retorno sobre investimento"
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Impressões"
          value={(dashboardMetrics?.totalImpressions || 0).toLocaleString()}
          icon={<Eye className="w-5 h-5" />}
          subtitle="Total de visualizações"
        />

        <MetricCard
          title="Cliques"
          value={(dashboardMetrics?.totalClicks || 0).toLocaleString()}
          icon={<MousePointer className="w-5 h-5" />}
          subtitle={`CTR: ${(dashboardMetrics?.avgCtr || 0).toFixed(2)}%`}
        />

        <MetricCard
          title="Leads Gerados"
          value={dashboardMetrics?.totalLeads || 0}
          icon={<UserCheck className="w-5 h-5" />}
          subtitle="Contatos qualificados"
        />

        <MetricCard
          title="Vendas"
          value={dashboardMetrics?.totalSales || 0}
          icon={<ShoppingCart className="w-5 h-5" />}
          subtitle="Conversões realizadas"
          variant="success"
        />
      </div>

      <Card className="shadow-card">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Campanhas Recentes
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/campaigns")}
            >
              Ver todas
            </Button>
          </div>

          {recentCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm md:text-base text-muted-foreground">
                Nenhuma campanha cadastrada ainda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCampaigns.map((campaign) => {
                  const { totalInvestment, roas } = getCampaignMetrics(campaign.id);
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium text-foreground">
                        {campaign.name}
                      </TableCell>
                      <TableCell>{getClientName(campaign.client_id)}</TableCell>
                      <TableCell>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {campaign.platform}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(totalInvestment)}</TableCell>
                      <TableCell className="font-bold text-success">
                        {roas.toFixed(1)}x
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    </TableRow>
                   );
                 })}
               </TableBody>
             </Table>
              </div>
            </div>
           )}
         </div>
       </Card>

      <Card className="shadow-card">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
            Ações Rápidas
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button 
              className="bg-gradient-primary w-full sm:w-auto"
              onClick={() => navigate("/clients")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cliente
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate("/campaigns")}
            >
              <Target className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
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