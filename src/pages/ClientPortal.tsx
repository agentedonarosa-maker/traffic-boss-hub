import { useState } from "react";
import { useParams } from "react-router-dom";
import { useClientPortalData } from "@/hooks/useClientAccess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, TrendingUp, DollarSign, Target, FileText, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMeetingConfirmation } from "@/hooks/useMeetingConfirmation";
import { SuggestMeetingDialog } from "@/components/calendar/SuggestMeetingDialog";

export default function ClientPortal() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = useClientPortalData(token || "");
  const [suggestDialogOpen, setSuggestDialogOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const meetingConfirmation = useMeetingConfirmation();

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

  // Contar reuniões pendentes
  const pendingMeetingsCount = upcomingMeetings.filter(m => m.client_confirmation_status === 'pending').length;

  const handleConfirm = (meetingId: string) => {
    meetingConfirmation.mutate({
      token: token || "",
      meetingId,
      action: "confirm",
    });
  };

  const handleDecline = (meetingId: string, notes?: string) => {
    meetingConfirmation.mutate({
      token: token || "",
      meetingId,
      action: "decline",
      notes,
    });
  };

  const handleSuggest = (dates: Date[], notes: string) => {
    meetingConfirmation.mutate({
      token: token || "",
      meetingId: selectedMeetingId,
      action: "suggest",
      suggestedDates: dates,
      notes,
    });
    setSuggestDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmada
        </Badge>;
      case 'declined':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          Recusada
        </Badge>;
      case 'rescheduled':
        return <Badge variant="default" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
          <Calendar className="w-3 h-3 mr-1" />
          Reagendar
        </Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  Portal do Cliente
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  {client.name} {client.company && `- ${client.company}`}
                </p>
              </div>
              {pendingMeetingsCount > 0 && (
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                  {pendingMeetingsCount} {pendingMeetingsCount === 1 ? 'reunião pendente' : 'reuniões pendentes'}
                </Badge>
              )}
            </div>
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
                      className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium text-sm">{meeting.title}</p>
                            {getStatusBadge(meeting.client_confirmation_status || 'pending')}
                          </div>
                          {meeting.description && (
                            <p className="text-xs text-muted-foreground mt-1 mb-2">
                              {meeting.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(meeting.meeting_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      
                      {meeting.client_confirmation_status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/30">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleConfirm(meeting.id)}
                            disabled={meetingConfirmation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmar presença
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setSelectedMeetingId(meeting.id);
                              setSuggestDialogOpen(true);
                            }}
                            disabled={meetingConfirmation.isPending}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Sugerir outro horário
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive"
                            onClick={() => handleDecline(meeting.id)}
                            disabled={meetingConfirmation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Não posso comparecer
                          </Button>
                        </div>
                      )}

                      {meeting.client_confirmation_status === 'rescheduled' && meeting.client_suggested_dates && (
                        <div className="pt-2 border-t border-border/30">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Horários sugeridos:</p>
                          <div className="space-y-1">
                            {JSON.parse(meeting.client_suggested_dates as any).map((date: string, idx: number) => (
                              <p key={idx} className="text-xs text-muted-foreground">
                                • {format(new Date(date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {meeting.client_notes && (
                        <div className="pt-2 border-t border-border/30">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Observações:</p>
                          <p className="text-xs text-muted-foreground">{meeting.client_notes}</p>
                        </div>
                      )}
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

      <SuggestMeetingDialog
        open={suggestDialogOpen}
        onOpenChange={setSuggestDialogOpen}
        onSubmit={handleSuggest}
        isLoading={meetingConfirmation.isPending}
      />
    </div>
  );
}
