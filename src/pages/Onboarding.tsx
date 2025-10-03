import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { useSendContract } from "@/hooks/useSendContract";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, Loader2, CheckCircle, BookOpen } from "lucide-react";

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
  const sendContract = useSendContract();

  const [selectedClient, setSelectedClient] = useState<string>("");
  const [managerName, setManagerName] = useState("");
  const [contractContent, setContractContent] = useState(DEFAULT_CONTRACT);

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

      // Reset form
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
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="contract" className="gap-2">
            <FileText className="w-4 h-4" />
            Contrato
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Guia
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
