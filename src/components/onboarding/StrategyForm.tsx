import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { strategicPlanSchema, type StrategicPlanFormData, type KpiData, type TimelineItemData } from "@/lib/validations/strategy";
import { useClients } from "@/hooks/useClients";
import { useBriefings } from "@/hooks/useBriefings";
import { useStrategicPlans } from "@/hooks/useStrategicPlans";
import { useCreateStrategicPlan } from "@/hooks/useCreateStrategicPlan";
import { useUpdateStrategicPlan } from "@/hooks/useUpdateStrategicPlan";
import { useDeleteStrategicPlan } from "@/hooks/useDeleteStrategicPlan";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SwotAnalysis } from "./SwotAnalysis";
import { PersonaBuilder } from "./PersonaBuilder";
import { FunnelStrategy } from "./FunnelStrategy";
import { ChannelPlanning } from "./ChannelPlanning";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Trash2, Plus, Edit, X } from "lucide-react";

export const StrategyForm = () => {
  const { data: clients } = useClients();
  const { data: briefings } = useBriefings();
  const { data: plans } = useStrategicPlans();
  const createPlan = useCreateStrategicPlan();
  const updatePlan = useUpdateStrategicPlan();
  const deletePlan = useDeleteStrategicPlan();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newKpi, setNewKpi] = useState<KpiData>({ name: "", target: "", current: "", priority: "medium" });
  const [newTimeline, setNewTimeline] = useState<TimelineItemData>({ month: "", activities: [] });
  const [timelineActivity, setTimelineActivity] = useState("");

  const form = useForm<StrategicPlanFormData>({
    resolver: zodResolver(strategicPlanSchema),
    defaultValues: {
      client_id: "",
      briefing_id: "",
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      personas: [],
      funnel_stages: {},
      channel_strategy: {},
      kpis: [],
      timeline: [],
      status: "draft",
    },
  });

  const onSubmit = async (data: StrategicPlanFormData) => {
    if (selectedPlan) {
      await updatePlan.mutateAsync({ id: selectedPlan.id, data });
    } else {
      await createPlan.mutateAsync(data);
    }
    handleReset();
  };

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    form.reset({
      ...plan,
      briefing_id: plan.briefing_id || "",
    });
    setShowForm(true);
  };

  const handleReset = () => {
    setSelectedPlan(null);
    form.reset();
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deletePlan.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const addKpi = () => {
    if (!newKpi.name) return;
    const currentKpis = form.getValues("kpis");
    form.setValue("kpis", [...currentKpis, newKpi]);
    setNewKpi({ name: "", target: "", current: "", priority: "medium" });
  };

  const removeKpi = (index: number) => {
    const currentKpis = form.getValues("kpis");
    form.setValue("kpis", currentKpis.filter((_, i) => i !== index));
  };

  const addTimeline = () => {
    if (!newTimeline.month) return;
    const currentTimeline = form.getValues("timeline");
    form.setValue("timeline", [...currentTimeline, newTimeline]);
    setNewTimeline({ month: "", activities: [] });
  };

  const removeTimeline = (index: number) => {
    const currentTimeline = form.getValues("timeline");
    form.setValue("timeline", currentTimeline.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      draft: "outline",
      complete: "default",
      in_review: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Planejamento Estratégico</h2>
          <p className="text-muted-foreground">Gerencie seus planejamentos estratégicos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Ver Lista" : "Novo Planejamento"}
        </Button>
      </div>

      {!showForm ? (
        <div className="grid gap-4 md:grid-cols-2">
          {plans?.map((plan) => {
            const client = clients?.find((c) => c.id === plan.client_id);
            return (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{client?.name || "Cliente"}</CardTitle>
                      <CardDescription>
                        {Array.isArray(plan.personas) ? plan.personas.length : 0} personas, {Array.isArray(plan.kpis) ? plan.kpis.length : 0} KPIs
                      </CardDescription>
                    </div>
                    {getStatusBadge(plan.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(plan)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileDown className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(plan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="briefing_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Briefing (opcional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vincular a um briefing" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Nenhum</SelectItem>
                          {briefings?.map((briefing) => (
                            <SelectItem key={briefing.id} value={briefing.id}>
                              {briefing.company_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise SWOT</CardTitle>
                <CardDescription>Forças, Fraquezas, Oportunidades e Ameaças</CardDescription>
              </CardHeader>
              <CardContent>
                <SwotAnalysis
                  strengths={form.watch("strengths")}
                  weaknesses={form.watch("weaknesses")}
                  opportunities={form.watch("opportunities")}
                  threats={form.watch("threats")}
                  onChange={(field, value) => form.setValue(field, value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personas</CardTitle>
                <CardDescription>Defina as personas do cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <PersonaBuilder
                  personas={form.watch("personas")}
                  onChange={(personas) => form.setValue("personas", personas)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funil de Marketing</CardTitle>
                <CardDescription>Estratégia para cada etapa do funil</CardDescription>
              </CardHeader>
              <CardContent>
                <FunnelStrategy
                  funnel={form.watch("funnel_stages")}
                  onChange={(stage, data) => {
                    const current = form.getValues("funnel_stages");
                    form.setValue("funnel_stages", { ...current, [stage]: data });
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estratégia por Canal</CardTitle>
                <CardDescription>Planejamento detalhado por canal de mídia</CardDescription>
              </CardHeader>
              <CardContent>
                <ChannelPlanning
                  channels={form.watch("channel_strategy")}
                  onChange={(channel, data) => {
                    const current = form.getValues("channel_strategy");
                    form.setValue("channel_strategy", { ...current, [channel]: data });
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KPIs e Metas</CardTitle>
                <CardDescription>Indicadores de performance e objetivos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do KPI"
                    value={newKpi.name}
                    onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
                  />
                  <Input
                    placeholder="Meta"
                    value={newKpi.target}
                    onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })}
                  />
                  <Select
                    value={newKpi.priority}
                    onValueChange={(value: "high" | "medium" | "low") => setNewKpi({ ...newKpi, priority: value })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addKpi}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>KPI</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.watch("kpis").map((kpi, index) => (
                      <TableRow key={index}>
                        <TableCell>{kpi.name}</TableCell>
                        <TableCell>{kpi.target}</TableCell>
                        <TableCell>
                          <Badge variant={kpi.priority === "high" ? "default" : "outline"}>
                            {kpi.priority === "high" ? "Alta" : kpi.priority === "medium" ? "Média" : "Baixa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => removeKpi(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline de Implementação</CardTitle>
                <CardDescription>Cronograma de atividades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Mês (ex: Mês 1)"
                    value={newTimeline.month}
                    onChange={(e) => setNewTimeline({ ...newTimeline, month: e.target.value })}
                  />
                  <Input
                    placeholder="Atividades (separadas por vírgula)"
                    value={timelineActivity}
                    onChange={(e) => setTimelineActivity(e.target.value)}
                    onBlur={() => {
                      if (timelineActivity) {
                        setNewTimeline({
                          ...newTimeline,
                          activities: timelineActivity.split(",").map((a) => a.trim()),
                        });
                        setTimelineActivity("");
                      }
                    }}
                  />
                  <Button type="button" onClick={addTimeline}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {form.watch("timeline").map((item, index) => (
                    <Card key={index}>
                      <CardContent className="flex justify-between items-start pt-4">
                        <div>
                          <p className="font-semibold">{item.month}</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {item.activities.map((activity, i) => (
                              <li key={i}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeTimeline(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" disabled={createPlan.isPending || updatePlan.isPending}>
                {selectedPlan ? "Atualizar" : "Salvar"} Planejamento
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este planejamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
