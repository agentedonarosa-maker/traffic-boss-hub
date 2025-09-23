import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Eye,
  Edit,
  MoreVertical,
  Target,
  TrendingUp,
  DollarSign,
  MousePointer,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MetricCard } from "@/components/dashboard/MetricCard";

// Mock data
const campaigns = [
  {
    id: 1,
    name: "Black Friday - Loja XYZ",
    client: "Loja XYZ",
    platform: "Meta Ads",
    objective: "Conversões",
    budget: 2450,
    spend: 2280,
    impressions: 125000,
    clicks: 2840,
    ctr: 2.27,
    leads: 142,
    cpl: 16.06,
    sales: 38,
    roas: 4.2,
    status: "Ativa",
    startDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Campanha Produto A",
    client: "Empresa ABC",
    platform: "Google Ads",
    objective: "Tráfego",
    budget: 1850,
    spend: 1680,
    impressions: 89500,
    clicks: 2140,
    ctr: 2.39,
    leads: 95,
    cpl: 17.68,
    sales: 24,
    roas: 3.8,
    status: "Ativa",
    startDate: "2024-01-20",
  },
  {
    id: 3,
    name: "Leads Qualificados",
    client: "StartupTech",
    platform: "Meta Ads",
    objective: "Geração de Leads",
    budget: 980,
    spend: 890,
    impressions: 45200,
    clicks: 1120,
    ctr: 2.48,
    leads: 78,
    cpl: 11.41,
    sales: 19,
    roas: 5.1,
    status: "Pausada",
    startDate: "2024-02-01",
  },
];

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = 
      selectedPlatform === "all" || campaign.platform === selectedPlatform;
    
    return matchesSearch && matchesPlatform;
  });

  // Calculate totals
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
  const totalSales = campaigns.reduce((acc, c) => acc + c.sales, 0);
  const avgRoas = campaigns.reduce((acc, c) => acc + c.roas, 0) / campaigns.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campanhas</h1>
          <p className="text-muted-foreground mt-1">
            Monitore e gerencie suas campanhas de tráfego pago
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nome da Campanha</Label>
                  <Input id="campaignName" placeholder="Ex: Black Friday 2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loja-xyz">Loja XYZ</SelectItem>
                      <SelectItem value="empresa-abc">Empresa ABC</SelectItem>
                      <SelectItem value="startup-tech">StartupTech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meta-ads">Meta Ads</SelectItem>
                      <SelectItem value="google-ads">Google Ads</SelectItem>
                      <SelectItem value="tiktok-ads">TikTok Ads</SelectItem>
                      <SelectItem value="linkedin-ads">LinkedIn Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objective">Objetivo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Objetivo da campanha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversoes">Conversões</SelectItem>
                      <SelectItem value="trafego">Tráfego</SelectItem>
                      <SelectItem value="leads">Geração de Leads</SelectItem>
                      <SelectItem value="engajamento">Engajamento</SelectItem>
                      <SelectItem value="alcance">Alcance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Orçamento (R$)</Label>
                  <Input id="budget" type="number" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input id="startDate" type="date" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-gradient-primary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Criar Campanha
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Investimento Total"
          value={`R$ ${totalSpend.toLocaleString()}`}
          change={15.3}
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Este mês"
          variant="primary"
        />
        
        <MetricCard
          title="Leads Gerados"
          value={totalLeads.toLocaleString()}
          change={28.5}
          changeType="positive"
          icon={<UserCheck className="w-5 h-5" />}
          subtitle="Total"
        />

        <MetricCard
          title="Vendas"
          value={totalSales}
          change={22.1}
          changeType="positive"
          icon={<Target className="w-5 h-5" />}
          subtitle="Conversões"
          variant="success"
        />

        <MetricCard
          title="ROAS Médio"
          value={`${avgRoas.toFixed(1)}x`}
          change={8.7}
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Retorno"
        />
      </div>

      {/* Filtros */}
      <Card className="p-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar campanhas ou clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as plataformas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as plataformas</SelectItem>
              <SelectItem value="Meta Ads">Meta Ads</SelectItem>
              <SelectItem value="Google Ads">Google Ads</SelectItem>
              <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabela de Campanhas */}
      <Card className="shadow-card">
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Orçamento</TableHead>
                  <TableHead>Gasto</TableHead>
                  <TableHead>Impressões</TableHead>
                  <TableHead>Cliques</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>CPL</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.client}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {campaign.platform}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      R$ {campaign.budget.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {campaign.spend.toLocaleString()}
                    </TableCell>
                    <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell>{campaign.ctr.toFixed(2)}%</TableCell>
                    <TableCell className="font-medium text-primary">
                      {campaign.leads}
                    </TableCell>
                    <TableCell>R$ {campaign.cpl.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-success">
                      {campaign.roas.toFixed(1)}x
                    </TableCell>
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
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}