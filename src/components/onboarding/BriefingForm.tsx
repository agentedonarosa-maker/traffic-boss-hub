import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { briefingSchema, type BriefingFormData } from "@/lib/validations/briefing";
import { useClients } from "@/hooks/useClients";
import { useBriefings } from "@/hooks/useBriefings";
import { useCreateBriefing } from "@/hooks/useCreateBriefing";
import { useUpdateBriefing } from "@/hooks/useUpdateBriefing";
import { useDeleteBriefing } from "@/hooks/useDeleteBriefing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { FileDown, Trash2, Plus, Edit } from "lucide-react";

const BUSINESS_SEGMENTS = [
  "E-commerce",
  "Serviços",
  "SaaS",
  "Educação",
  "Saúde",
  "Outros",
];

const OBJECTIVES = [
  "Gerar Vendas",
  "Captar Leads",
  "Aumentar Awareness",
  "Engajamento",
  "Tráfego",
];

const CHANNELS = [
  "Meta Ads",
  "Google Ads",
  "TikTok Ads",
  "LinkedIn Ads",
  "Email Marketing",
  "SEO",
  "Outros",
];

export const BriefingForm = () => {
  const { data: clients } = useClients();
  const { data: briefings } = useBriefings();
  const createBriefing = useCreateBriefing();
  const updateBriefing = useUpdateBriefing();
  const deleteBriefing = useDeleteBriefing();

  const [selectedBriefing, setSelectedBriefing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<BriefingFormData>({
    resolver: zodResolver(briefingSchema),
    defaultValues: {
      client_id: "",
      company_name: "",
      business_segment: "",
      business_description: "",
      target_audience: "",
      main_competitors: "",
      main_objective: "",
      secondary_objectives: [],
      current_channels: [],
      monthly_budget: 0,
      website_url: "",
      social_media_links: {},
      products_services: "",
      unique_selling_points: "",
      pain_points: "",
      success_metrics: "",
      additional_notes: "",
      status: "draft",
    },
  });

  const onSubmit = async (data: BriefingFormData) => {
    if (selectedBriefing) {
      await updateBriefing.mutateAsync({ id: selectedBriefing.id, data });
    } else {
      await createBriefing.mutateAsync(data);
    }
    handleReset();
  };

  const handleEdit = (briefing: any) => {
    setSelectedBriefing(briefing);
    form.reset({
      ...briefing,
      monthly_budget: briefing.monthly_budget || 0,
    });
    setShowForm(true);
  };

  const handleReset = () => {
    setSelectedBriefing(null);
    form.reset();
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBriefing.mutateAsync(deleteId);
      setDeleteId(null);
    }
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
          <h2 className="text-2xl font-bold">Briefings de Clientes</h2>
          <p className="text-muted-foreground">Gerencie os briefings dos seus clientes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Ver Lista" : "Novo Briefing"}
        </Button>
      </div>

      {!showForm ? (
        <div className="grid gap-4 md:grid-cols-2">
          {briefings?.map((briefing) => (
            <Card key={briefing.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{briefing.company_name}</CardTitle>
                    <CardDescription>{briefing.business_segment}</CardDescription>
                  </div>
                  {getStatusBadge(briefing.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Objetivo:</strong> {briefing.main_objective}</p>
                  <p><strong>Canais:</strong> {briefing.current_channels.join(", ")}</p>
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(briefing)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileDown className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(briefing.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
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
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_segment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segmento de Negócio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o segmento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_SEGMENTS.map((segment) => (
                            <SelectItem key={segment} value={segment}>
                              {segment}
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
                  name="business_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Negócio</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://exemplo.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="products_services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produtos/Serviços</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Público-Alvo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Público</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objetivos e Competição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="main_objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo Principal</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o objetivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OBJECTIVES.map((obj) => (
                            <SelectItem key={obj} value={obj}>
                              {obj}
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
                  name="main_competitors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principais Concorrentes</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unique_selling_points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diferenciais Competitivos</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pain_points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontos de Dor Atuais</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Canais e Orçamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="current_channels"
                  render={() => (
                    <FormItem>
                      <FormLabel>Canais Atuais</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {CHANNELS.map((channel) => (
                          <FormField
                            key={channel}
                            control={form.control}
                            name="current_channels"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(channel)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, channel]);
                                      } else {
                                        field.onChange(current.filter((c) => c !== channel));
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">{channel}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthly_budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento Mensal (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Sucesso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="success_metrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Como você mede sucesso?</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additional_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Adicionais</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" disabled={createBriefing.isPending || updateBriefing.isPending}>
                {selectedBriefing ? "Atualizar" : "Salvar"} Briefing
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
              Tem certeza que deseja excluir este briefing? Esta ação não pode ser desfeita.
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
