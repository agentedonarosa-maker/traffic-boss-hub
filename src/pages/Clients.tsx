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
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Building,
  DollarSign,
  Loader2,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClients } from "@/hooks/useClients";
import { useCreateClient } from "@/hooks/useCreateClient";
import { useUpdateClient } from "@/hooks/useUpdateClient";
import { useDeleteClient } from "@/hooks/useDeleteClient";
import { useClientAccess, useGenerateClientAccess } from "@/hooks/useClientAccess";
import { ClientForm } from "@/components/clients/ClientForm";
import { SharePortalWrapper } from "@/components/clients/SharePortalWrapper";
import { toast } from "@/hooks/use-toast";
import type { ClientFormData } from "@/lib/validations/client";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import type { Client } from "@/hooks/useClients";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const generateAccess = useGenerateClientAccess();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.niche?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = clients.reduce(
    (sum, client) => sum + (client.monthly_budget || 0),
    0
  );

  const handleCreateClient = (data: ClientFormData) => {
    createClient.mutate(
      {
        name: data.name,
        company: data.company,
        contact: data.contact,
        niche: data.niche,
        monthly_budget: data.monthly_budget,
        strategic_notes: data.strategic_notes,
      },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
        },
      }
    );
  };

  const handleUpdateClient = (data: ClientFormData) => {
    if (!selectedClient) return;
    updateClient.mutate(
      {
        id: selectedClient.id,
        name: data.name,
        company: data.company,
        contact: data.contact,
        niche: data.niche,
        monthly_budget: data.monthly_budget,
        strategic_notes: data.strategic_notes,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedClient(null);
        },
      }
    );
  };

  const handleDeleteClient = () => {
    if (!clientToDelete) return;
    deleteClient.mutate(clientToDelete, {
      onSuccess: () => {
        setClientToDelete(null);
      },
    });
  };

  const handleGenerateAccess = (clientId: string) => {
    generateAccess.mutate(clientId);
  };

  const ClientAccessButton = ({ clientId }: { clientId: string }) => {
    const { data: access } = useClientAccess(clientId);

    const handleShare = () => {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        if (access) {
          setSelectedClient(client);
          setIsShareDialogOpen(true);
        } else {
          generateAccess.mutate(clientId, {
            onSuccess: () => {
              setSelectedClient(client);
              setTimeout(() => setIsShareDialogOpen(true), 500);
            }
          });
        }
      }
    };

    return (
      <DropdownMenuItem onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar Portal
      </DropdownMenuItem>
    );
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Gerencie seus clientes de tráfego pago
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary w-full sm:w-auto text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm
              onSubmit={handleCreateClient}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createClient.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Busca */}
      <Card className="p-3 sm:p-4 shadow-card">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, empresa ou nicho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {clients.length}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">Total de Clientes</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg flex-shrink-0">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {clients.length}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">Clientes Ativos</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg flex-shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                {formatCurrency(totalBudget)}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">Orçamento Total</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela de Clientes */}
      <Card className="shadow-card">
        <div className="p-3 sm:p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                {searchTerm
                  ? "Nenhum cliente encontrado com esse termo."
                  : "Nenhum cliente cadastrado ainda."}
              </p>
            </div>
          ) : (
            <ResponsiveTable>
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Cliente</TableHead>
                <TableHead className="text-xs sm:text-sm">Contato</TableHead>
                <TableHead className="text-xs sm:text-sm">Nicho</TableHead>
                <TableHead className="text-xs sm:text-sm">Orçamento</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="text-xs sm:text-sm">
                    <div>
                      <p className="font-medium text-foreground">
                        {client.name}
                      </p>
                      {client.company && (
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {client.company}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <p className="text-xs sm:text-sm">
                      {client.contact || "Não informado"}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">{client.niche || "—"}</TableCell>
                  <TableCell className="font-medium text-success text-xs sm:text-sm">
                    {formatCurrency(client.monthly_budget)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <ClientAccessButton clientId={client.id} />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedClient(client);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedClient(client);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setClientToDelete(client.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
               ))}
             </TableBody>
           </Table>
            </ResponsiveTable>
           )}
         </div>
       </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              defaultValues={{
                name: selectedClient.name,
                company: selectedClient.company || "",
                contact: selectedClient.contact || "",
                niche: selectedClient.niche || "",
                monthly_budget: selectedClient.monthly_budget || 0,
                strategic_notes: selectedClient.strategic_notes || "",
              }}
              onSubmit={handleUpdateClient}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedClient(null);
              }}
              isLoading={updateClient.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-foreground">{selectedClient.name}</p>
              </div>
              {selectedClient.company && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Empresa
                  </p>
                  <p className="text-foreground">{selectedClient.company}</p>
                </div>
              )}
              {selectedClient.contact && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contato
                  </p>
                  <p className="text-foreground">{selectedClient.contact}</p>
                </div>
              )}
              {selectedClient.niche && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nicho
                  </p>
                  <p className="text-foreground">{selectedClient.niche}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Orçamento Mensal
                </p>
                <p className="text-foreground">
                  {formatCurrency(selectedClient.monthly_budget)}
                </p>
              </div>
              {selectedClient.strategic_notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Observações Estratégicas
                  </p>
                  <p className="text-foreground">
                    {selectedClient.strategic_notes}
                  </p>
                </div>
              )}
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!clientToDelete}
        onOpenChange={() => setClientToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Portal Dialog */}
      {selectedClient && (
        <SharePortalWrapper
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          agencyName="Sua Agência"
        />
      )}
    </div>
  );
}
