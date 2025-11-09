import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { useSendContract } from "@/hooks/useSendContract";
import { usePayments } from "@/hooks/usePayments";
import { usePaymentMetrics } from "@/hooks/usePaymentMetrics";
import { useUpdatePayment } from "@/hooks/useUpdatePayment";
import { useDeletePayment } from "@/hooks/useDeletePayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, Loader2, CheckCircle, BookOpen, DollarSign, AlertCircle, Clock, Trash2, Check } from "lucide-react";
import { PaymentForm } from "@/components/onboarding/PaymentForm";
import { BriefingForm } from "@/components/onboarding/BriefingForm";
import { StrategyForm } from "@/components/onboarding/StrategyForm";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const DEFAULT_CONTRACT = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GESTÃO DE TRÁFEGO PAGO

CONTRATANTE: [NOME DO CLIENTE]
CONTRATADA: [SUA EMPRESA]

1. DO OBJETO
O presente contrato tem como objeto a prestação de serviços de gestão de tráfego pago, incluindo:
- Planejamento estratégico de campanhas
- Criação e otimização de anúncios
- Análise de métricas e ROI
- Relatórios mensais de performance
- Suporte e consultoria

2. DO VALOR E FORMA DE PAGAMENTO
Investimento Mensal: R$ [VALOR]
Data de Vencimento: Todo dia [DIA] de cada mês
Forma de Pagamento: [PIX/BOLETO/TRANSFERÊNCIA]

3. DA VIGÊNCIA
Início: [DATA DE INÍCIO]
Duração: [12 MESES] (renovação automática)

4. DAS OBRIGAÇÕES DA CONTRATADA
- Gerenciar campanhas nos canais acordados
- Otimizar diariamente os resultados
- Apresentar relatórios mensais detalhados
- Manter comunicação constante sobre o andamento

5. DAS OBRIGAÇÕES DO CONTRATANTE
- Fornecer materiais necessários (imagens, textos, logos)
- Disponibilizar acessos às plataformas
- Efetuar pagamento nas datas acordadas
- Aprovar criativos em até 48h

6. DO INVESTIMENTO EM MÍDIA
O investimento em mídia (budget das plataformas) é de responsabilidade do contratante e não está incluído no valor deste contrato.

7. DA RESCISÃO
Qualquer parte pode rescindir mediante aviso prévio de 30 dias.

8. DO FORO
Fica eleito o foro da comarca de [CIDADE] para dirimir quaisquer questões oriundas deste contrato.

[CIDADE], [DATA]

_______________________________          _______________________________
CONTRATANTE                              CONTRATADA`;

export default function Onboarding() {
  const { toast } = useToast();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: payments = [] } = usePayments();
  const { data: paymentMetrics } = usePaymentMetrics();
  const sendContract = useSendContract();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();

  const [selectedClient, setSelectedClient] = useState<string>("");
  const [managerName, setManagerName] = useState("");
  const [contractContent, setContractContent] = useState(DEFAULT_CONTRACT);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  const handleSendContract = async () => {
    if (!selectedClient || !managerName) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um cliente e preencha seu nome.",
        variant: "destructive",
      });
      return;
    }

    const client = clients?.find(c => c.id === selectedClient);
    if (!client?.contact) {
      toast({
        title: "Email não encontrado",
        description: "O cliente selecionado não possui email cadastrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendContract.mutateAsync({
        clientName: client.name,
        clientEmail: client.contact,
        contractContent,
        managerName,
      });

      toast({
        title: "Contrato enviado!",
        description: `Email enviado para ${client.contact}`,
      });

      setSelectedClient("");
      setManagerName("");
      setContractContent(DEFAULT_CONTRACT);
    } catch (error) {
      console.error("Erro ao enviar contrato:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    await updatePayment.mutateAsync({
      id: paymentId,
      payment_status: "paid",
      paid_date: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    await deletePayment.mutateAsync(paymentToDelete);
    setPaymentToDelete(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendente", className: "bg-warning/10 text-warning" },
      paid: { label: "Pago", className: "bg-success/10 text-success" },
      overdue: { label: "Atrasado", className: "bg-destructive/10 text-destructive" },
      cancelled: { label: "Cancelado", className: "bg-muted text-muted-foreground" },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getClientName = (clientId: string) => {
    const client = clients?.find(c => c.id === clientId);
    return client?.name || "Cliente";
  };

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 max-w-6xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
          📋 Onboarding de Clientes
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Processo profissional para iniciar contratos e gerir novos clientes
        </p>
      </div>

      <Tabs defaultValue="contract" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:w-auto">
          <TabsTrigger value="contract" className="gap-1 flex-col sm:flex-row py-2 text-[10px] sm:text-xs md:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Contrato</span>
          </TabsTrigger>
          <TabsTrigger value="briefing" className="gap-1 flex-col sm:flex-row py-2 text-[10px] sm:text-xs md:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Briefing</span>
          </TabsTrigger>
          <TabsTrigger value="planning" className="gap-1 flex-col sm:flex-row py-2 text-[10px] sm:text-xs md:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Planejamento</span>
            <span className="sm:hidden">Plano</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-1 flex-col sm:flex-row py-2 text-[10px] sm:text-xs md:text-sm">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Pagamentos</span>
            <span className="sm:hidden">$</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-1 flex-col sm:flex-row py-2 text-[10px] sm:text-xs md:text-sm">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Guia</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contract" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Modelo de Contrato
              </CardTitle>
              <CardDescription>
                Preencha as informações e envie automaticamente para o email do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                    disabled={clientsLoading}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.contact && `- ${client.contact}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Seu Nome (Gestor) *</Label>
                  <Input
                    id="manager"
                    placeholder="Ex: João Silva"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract">Conteúdo do Contrato</Label>
                <Textarea
                  id="contract"
                  value={contractContent}
                  onChange={(e) => setContractContent(e.target.value)}
                  className="min-h-[300px] md:min-h-[500px] font-mono text-xs md:text-sm"
                  placeholder="Digite ou edite o contrato..."
                />
                <p className="text-xs text-muted-foreground">
                  💡 Dica: Substitua os valores entre colchetes pelos dados do cliente
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSendContract}
                  disabled={sendContract.isPending}
                  className="gap-2 w-full sm:w-auto"
                  size="lg"
                >
                  {sendContract.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Enviar Contrato por Email</span>
                      <span className="sm:hidden">Enviar Contrato</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setContractContent(DEFAULT_CONTRACT)}
                  disabled={sendContract.isPending}
                >
                  Restaurar Modelo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="briefing" className="space-y-6">
          <BriefingForm />
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <StrategyForm />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard
              title="Recebido no Mês"
              value={formatCurrency(paymentMetrics?.totalReceivedThisMonth || 0)}
              icon={<DollarSign className="w-4 h-4" />}
              variant="success"
            />
            <MetricCard
              title="Pendente"
              value={formatCurrency(paymentMetrics?.totalPending || 0)}
              icon={<Clock className="w-4 h-4" />}
              variant="warning"
            />
            <MetricCard
              title="Atrasado"
              value={formatCurrency(paymentMetrics?.totalOverdue || 0)}
              icon={<AlertCircle className="w-4 h-4" />}
              variant="warning"
            />
            <MetricCard
              title="Próximos 7 dias"
              value={paymentMetrics?.upcomingPayments || 0}
              icon={<Clock className="w-4 h-4" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Novo Pagamento
              </CardTitle>
              <CardDescription>
                Registre um novo pagamento ou contrato com cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Registrados</CardTitle>
              <CardDescription>
                Histórico de contratos e pagamentos dos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Nenhum pagamento registrado ainda.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Cliente</TableHead>
                        <TableHead className="text-xs">Valor</TableHead>
                        <TableHead className="text-xs">Frequência</TableHead>
                        <TableHead className="text-xs">Vencimento</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment: any) => (
                        <TableRow key={payment.id}>
                          <TableCell className="text-xs font-medium">
                            {getClientName(payment.client_id)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {formatCurrency(payment.contract_value)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {payment.payment_frequency === "monthly" && "Mensal"}
                            {payment.payment_frequency === "quarterly" && "Trimestral"}
                            {payment.payment_frequency === "annual" && "Anual"}
                            {payment.payment_frequency === "one_time" && "Único"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {format(new Date(payment.due_date), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="text-xs">
                            {getStatusBadge(payment.payment_status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {payment.payment_status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsPaid(payment.id)}
                                  className="h-7 text-xs"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Marcar Pago
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPaymentToDelete(payment.id)}
                                className="h-7 text-xs text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <AlertDialog open={!!paymentToDelete} onOpenChange={() => setPaymentToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Pagamento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePayment}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Checklist de Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">1. Informações Básicas</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Cadastrar cliente no sistema</li>
                    <li>Coletar dados de contato e empresa</li>
                    <li>Definir nicho e público-alvo</li>
                    <li>Estabelecer budget mensal</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">2. Acessos e Integrações</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Solicitar acesso ao Gerenciador de Negócios</li>
                    <li>Configurar pixels de rastreamento</li>
                    <li>Integrar Google Analytics</li>
                    <li>Conectar plataformas de anúncio</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">3. Planejamento Estratégico</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Definir objetivos mensuráveis</li>
                    <li>Criar personas e segmentações</li>
                    <li>Planejar funil de vendas</li>
                    <li>Estabelecer KPIs principais</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Boas Práticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Comunicação com Cliente</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Agende reunião inicial de alinhamento</li>
                    <li>Estabeleça canal principal de comunicação</li>
                    <li>Defina frequência de relatórios</li>
                    <li>Crie expectativas realistas sobre resultados</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Documentação</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Mantenha histórico de todas as decisões</li>
                    <li>Documente briefings e aprovações</li>
                    <li>Salve provas de aprovação de criativos</li>
                    <li>Registre alterações de estratégia</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Primeiras Campanhas</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Comece com testes A/B de criativos</li>
                    <li>Use 20% do budget para testes</li>
                    <li>Monitore diariamente na primeira semana</li>
                    <li>Ajuste segmentações baseado em dados</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>📊 Métricas Essenciais para Acompanhar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm">Desempenho Inicial</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• CTR (Click-Through Rate)</li>
                      <li>• CPC (Custo por Clique)</li>
                      <li>• CPM (Custo por Mil Impressões)</li>
                      <li>• Taxa de Conversão</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm">ROI e Vendas</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• ROAS (Return on Ad Spend)</li>
                      <li>• CPA (Custo por Aquisição)</li>
                      <li>• Valor do Ticket Médio</li>
                      <li>• LTV (Lifetime Value)</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm">Engajamento</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Taxa de Rejeição</li>
                      <li>• Tempo no Site</li>
                      <li>• Páginas por Sessão</li>
                      <li>• Taxa de Retorno</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
