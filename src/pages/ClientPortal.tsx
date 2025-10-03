import { useParams } from "react-router-dom";
import { useClientPortalData } from "@/hooks/useClientAccess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, TrendingUp, DollarSign, Target, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function ClientPortal() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = useClientPortalData(token || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <Skeleton className="h-16 md:h-20 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64 md:h-96" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso negado</AlertTitle>
          <AlertDescription>
            Link inválido ou expirado. Entre em contato com seu gestor.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { client, meetings, campaigns, metrics, tasks } = data;

  // Calcular métricas resumidas
  const totalInvestment = metrics?.reduce((sum, m) => sum + (m.investment || 0), 0) || 0;
  const totalRevenue = metrics?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
  const avgRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
  const activeCampaigns = campaigns?.filter(c => c.status === "active").length || 0;

  // Filtrar reuniões futuras
  const upcomingMeetings = meetings?.filter(m => new Date(m.meeting_date) >= new Date()) || [];
  
  // Filtrar tarefas pendentes
  const pendingTasks = tasks?.filter(t => t.status !== "completed") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Portal do Cliente
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              {client.name} {client.company && `- ${client.company}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalInvestment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgRoas.toFixed(2)}x
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Retorno sobre investimento
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em andamento
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orçamento Mensal</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(client.monthly_budget || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Contrato atual
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Próximas Reuniões */}
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Calendar className="h-5 w-5" />
                Próximas Reuniões
              </CardTitle>
              <CardDescription className="text-sm">
                Agenda de reuniões e acompanhamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma reunião agendada
                </p>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {upcomingMeetings.slice(0, 5).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/30"
                    >
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{meeting.title}</p>
                        {meeting.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {meeting.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(meeting.meeting_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarefas de Otimização */}
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Target className="h-5 w-5" />
                Tarefas de Otimização
              </CardTitle>
              <CardDescription className="text-sm">
                Ações planejadas para suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma tarefa pendente
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/30"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-sm truncate">{task.title}</p>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs flex-shrink-0"
                          >
                            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Prazo: {format(new Date(task.due_date), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informações do Contrato */}
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FileText className="h-5 w-5" />
              Informações do Contrato
            </CardTitle>
            <CardDescription className="text-sm">
              Detalhes sobre o acordo comercial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Cliente</p>
                <p className="text-sm md:text-base font-semibold break-words">{client.name}</p>
              </div>
              {client.company && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Empresa</p>
                  <p className="text-sm md:text-base font-semibold break-words">{client.company}</p>
                </div>
              )}
              {client.niche && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Nicho</p>
                  <p className="text-sm md:text-base font-semibold break-words">{client.niche}</p>
                </div>
              )}
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Orçamento Mensal</p>
                <p className="text-sm md:text-base font-semibold">
                  R$ {(client.monthly_budget || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              {client.contact && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Contato</p>
                  <p className="text-sm md:text-base font-semibold break-all">{client.contact}</p>
                </div>
              )}
            </div>
            {client.strategic_notes && (
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border/50">
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Notas Estratégicas</p>
                <p className="text-sm text-foreground/80">{client.strategic_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
