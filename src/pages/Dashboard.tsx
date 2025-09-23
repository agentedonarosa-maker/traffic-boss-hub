import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  Target,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  UserCheck,
  ShoppingCart,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock data
const recentCampaigns = [
  {
    id: 1,
    name: "Black Friday - Loja XYZ",
    client: "Loja XYZ",
    platform: "Meta Ads",
    spend: "R$ 2.450",
    roas: "4.2x",
    status: "Ativa",
  },
  {
    id: 2,
    name: "Campanha Produto A",
    client: "Empresa ABC",
    platform: "Google Ads",
    spend: "R$ 1.850",
    roas: "3.8x",
    status: "Ativa",
  },
  {
    id: 3,
    name: "Leads Qualificados",
    client: "StartupTech",
    platform: "Meta Ads",
    spend: "R$ 980",
    roas: "5.1x",
    status: "Pausada",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral dos seus clientes e campanhas de tráfego pago
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Clientes"
          value={12}
          change={8.2}
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
          subtitle="Ativos este mês"
        />
        
        <MetricCard
          title="Campanhas Ativas"
          value={28}
          change={12.5}
          changeType="positive"
          icon={<Target className="w-5 h-5" />}
          subtitle="Em andamento"
        />

        <MetricCard
          title="Investimento Total"
          value="R$ 24.580"
          change={15.3}
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Este mês"
          variant="primary"
        />

        <MetricCard
          title="ROAS Médio"
          value="4.2x"
          change={5.8}
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Últimos 30 dias"
          variant="success"
        />
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Impressões"
          value="1.2M"
          change={22.1}
          changeType="positive"
          icon={<Eye className="w-5 h-5" />}
        />

        <MetricCard
          title="Cliques"
          value="45.2K"
          change={18.7}
          changeType="positive"
          icon={<MousePointer className="w-5 h-5" />}
        />

        <MetricCard
          title="Leads Gerados"
          value={1.247}
          change={31.2}
          changeType="positive"
          icon={<UserCheck className="w-5 h-5" />}
        />

        <MetricCard
          title="Vendas"
          value={342}
          change={25.8}
          changeType="positive"
          icon={<ShoppingCart className="w-5 h-5" />}
        />
      </div>

      {/* Campanhas Recentes */}
      <Card className="shadow-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Campanhas Recentes</h2>
              <p className="text-muted-foreground text-sm">Últimas campanhas cadastradas</p>
            </div>
            <Button variant="outline">Ver Todas</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Investimento</TableHead>
                <TableHead>ROAS</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.client}</TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>{campaign.spend}</TableCell>
                  <TableCell className="text-success font-medium">{campaign.roas}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === "Ativa"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Ações Rápidas */}
      <Card className="shadow-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2 bg-gradient-primary">
              <Users className="w-6 h-6" />
              Novo Cliente
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Target className="w-6 h-6" />
              Nova Campanha
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}