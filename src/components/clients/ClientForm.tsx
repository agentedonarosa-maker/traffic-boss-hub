import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientSchema, type ClientFormData } from "@/lib/validations/client";
import { Loader2 } from "lucide-react";

interface ClientFormProps {
  defaultValues?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClientForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nome completo"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            placeholder="Nome da empresa"
            {...register("company")}
            className={errors.company ? "border-destructive" : ""}
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contato</Label>
          <Input
            id="contact"
            placeholder="E-mail ou telefone"
            {...register("contact")}
            className={errors.contact ? "border-destructive" : ""}
          />
          {errors.contact && (
            <p className="text-sm text-destructive">{errors.contact.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="niche">Nicho</Label>
          <Input
            id="niche"
            placeholder="Ex: E-commerce, Serviços"
            {...register("niche")}
            className={errors.niche ? "border-destructive" : ""}
          />
          {errors.niche && (
            <p className="text-sm text-destructive">{errors.niche.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthly_budget">Orçamento Mensal (R$)</Label>
        <Input
          id="monthly_budget"
          type="number"
          step="0.01"
          placeholder="5000.00"
          {...register("monthly_budget", { valueAsNumber: true })}
          className={errors.monthly_budget ? "border-destructive" : ""}
        />
        {errors.monthly_budget && (
          <p className="text-sm text-destructive">
            {errors.monthly_budget.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="strategic_notes">Observações Estratégicas</Label>
        <Textarea
          id="strategic_notes"
          placeholder="Objetivos, diferenciais do negócio, persona..."
          rows={3}
          {...register("strategic_notes")}
          className={errors.strategic_notes ? "border-destructive" : ""}
        />
        {errors.strategic_notes && (
          <p className="text-sm text-destructive">
            {errors.strategic_notes.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-primary" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Cliente
        </Button>
      </div>
    </form>
  );
}
