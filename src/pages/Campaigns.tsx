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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  UserCheck,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useCreateCampaign } from "@/hooks/useCreateCampaign";
import { useUpdateCampaign } from "@/hooks/useUpdateCampaign";
import { useDeleteCampaign } from "@/hooks/useDeleteCampaign";
import { useCampaignMetrics } from "@/hooks/useCampaignMetrics";
import { useClients } from "@/hooks/useClients";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import type { CampaignFormData } from "@/lib/validations/campaign";
import type { Campaign } from "@/hooks/useCampaigns";
export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");

  const { data: campaigns = [], isLoading } = useCampaigns();
  const { data: clients = [] } = useClients();
  const { data: allMetrics = [] } = useCampaignMetrics();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const filteredCampaigns = campaigns.filter((campaign) => {
    const client = clients.find(c => c.id === campaign.client_id);
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = 
      selectedPlatform === "all" || campaign.platform === selectedPlatform;
    
    const matchesClient = 
      selectedClient === "all" || campaign.client_id === selectedClient;
    
    return matchesSearch && matchesPlatform && matchesClient;
  });

  const getCampaignMetrics = (campaignId: string) => {
    const metrics = allMetrics.filter(m => m.campaign_id === campaignId);
    const totalInvestment = metrics.reduce((sum, m) => sum + (m.investment || 0), 0);
    const totalLeads = metrics.reduce((sum, m) => sum + (m.leads || 0), 0);
    const totalSales = metrics.reduce((sum, m) => sum + (m.sales || 0), 0);
    const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
    const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
    const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cpl = totalLeads > 0 ? totalInvestment / totalLeads : 0;
    const roas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
    
    return {
      totalInvestment,
      totalLeads,
      totalSales,
      totalImpressions,
      totalClicks,
      ctr,
      cpl,
      roas,
    };
  };

  const totalSpend = campaigns.reduce((acc, c) => {
    const { totalInvestment } = getCampaignMetrics(c.id);
    return acc + totalInvestment;
  }, 0);

  const totalLeads = campaigns.reduce((acc, c) => {
    const { totalLeads } = getCampaignMetrics(c.id);
    return acc + totalLeads;
  }, 0);

  const totalSales = campaigns.reduce((acc, c) => {
    const { totalSales } = getCampaignMetrics(c.id);
    return acc + totalSales;
  }, 0);

  const avgRoas = campaigns.length > 0
    ? campaigns.reduce((acc, c) => {
        const { roas } = getCampaignMetrics(c.id);
        return acc + roas;
      }, 0) / campaigns.length
    : 0;

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

  const handleCreateCampaign = (data: CampaignFormData) => {
    createCampaign.mutate(
      {
        name: data.name,
        client_id: data.client_id,
        platform: data.platform,
        objective: data.objective,
        budget: data.budget ?? undefined,
        start_date: data.start_date ?? undefined,
        end_date: data.end_date ?? undefined,
        status: data.status,
      },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
        },
      }
    );
  };

  const handleUpdateCampaign = (data: CampaignFormData) => {
    if (!selectedCampaign) return;
    updateCampaign.mutate(
      {
        id: selectedCampaign.id,
        name: data.name,
        client_id: data.client_id,
        platform: data.platform,
        objective: data.objective,
        budget: data.budget,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedCampaign(null);
        },
      }
    );
  };

  const handleDeleteCampaign = () => {
    if (!campaignToDelete) return;
    deleteCampaign.mutate(campaignToDelete, {
      onSuccess: () => {
        setCampaignToDelete(null);
      },
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Campanhas</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Monitore e gerencie suas campanhas de tráfego pago
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <Button 
            className="bg-gradient-primary w-full sm:w-auto"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nova Campanha</span>
            <span className="sm:hidden">Nova</span>
          </Button>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
            </DialogHeader>
            <CampaignForm
              onSubmit={handleCreateCampaign}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createCampaign.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Investimento Total"
          value={formatCurrency(totalSpend)}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Todas as campanhas"
          variant="primary"
        />
        
        <MetricCard
          title="Leads Gerados"
          value={totalLeads.toLocaleString()}
          icon={<UserCheck className="w-5 h-5" />}
          subtitle="Total"
        />

        <MetricCard
          title="Vendas"
          value={totalSales}
          icon={<Target className="w-5 h-5" />}
          subtitle="Conversões"
          variant="success"
        />

        <MetricCard
          title="ROAS Médio"
          value={`${avgRoas.toFixed(1)}x`}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Retorno"
        />
      </div>

      {/* Filtros */}
      <Card className="p-4 shadow-card">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar campanhas ou clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-full md:w-[180px]">
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

      <Card className="shadow-card">
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm md:text-base text-muted-foreground">
                {searchTerm
                  ? "Nenhuma campanha encontrada com esse termo."
                  : "Nenhuma campanha cadastrada ainda."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>CPL</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => {
                    const metrics = getCampaignMetrics(campaign.id);
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getClientName(campaign.client_id)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            {campaign.platform}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {campaign.budget ? formatCurrency(campaign.budget) : "—"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(metrics.totalInvestment)}
                        </TableCell>
                        <TableCell className="font-medium text-primary">
                          {metrics.totalLeads}
                        </TableCell>
                        <TableCell>
                          {metrics.cpl > 0 ? formatCurrency(metrics.cpl) : "—"}
                        </TableCell>
                        <TableCell className="font-bold text-success">
                          {metrics.roas > 0 ? `${metrics.roas.toFixed(1)}x` : "—"}
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCampaign(campaign);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCampaign(campaign);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setCampaignToDelete(campaign.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Campanha</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <CampaignForm
              defaultValues={{
                name: selectedCampaign.name,
                client_id: selectedCampaign.client_id,
                platform: selectedCampaign.platform,
                objective: selectedCampaign.objective,
                budget: selectedCampaign.budget || undefined,
                start_date: selectedCampaign.start_date || undefined,
                end_date: selectedCampaign.end_date || undefined,
                status: selectedCampaign.status as any,
              }}
              onSubmit={handleUpdateCampaign}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedCampaign(null);
              }}
              isLoading={updateCampaign.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Campanha</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-foreground">{selectedCampaign.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                <p className="text-foreground">{getClientName(selectedCampaign.client_id)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plataforma</p>
                <p className="text-foreground">{selectedCampaign.platform}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Objetivo</p>
                <p className="text-foreground">{selectedCampaign.objective}</p>
              </div>
              {selectedCampaign.budget && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Orçamento</p>
                  <p className="text-foreground">{formatCurrency(selectedCampaign.budget)}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!campaignToDelete}
        onOpenChange={() => setCampaignToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCampaign}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}