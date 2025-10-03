import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { campaignSchema, type CampaignFormData } from "@/lib/validations/campaign";
import { Loader2 } from "lucide-react";
import { useClients } from "@/hooks/useClients";

interface CampaignFormProps {
  defaultValues?: Partial<CampaignFormData>;
  onSubmit: (data: CampaignFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CampaignForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: CampaignFormProps) {
  const { data: clients = [] } = useClients();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  });

  const clientId = watch("client_id");
  const platform = watch("platform");
  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome da Campanha <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Black Friday 2024"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_id">
            Cliente <span className="text-destructive">*</span>
          </Label>
          <Select
            value={clientId}
            onValueChange={(value) => setValue("client_id", value)}
          >
            <SelectTrigger className={errors.client_id ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.client_id && (
            <p className="text-sm text-destructive">{errors.client_id.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">
            Plataforma <span className="text-destructive">*</span>
          </Label>
          <Select
            value={platform}
            onValueChange={(value) => setValue("platform", value)}
          >
            <SelectTrigger className={errors.platform ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecione a plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Meta Ads">Meta Ads</SelectItem>
              <SelectItem value="Google Ads">Google Ads</SelectItem>
              <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
              <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
            </SelectContent>
          </Select>
          {errors.platform && (
            <p className="text-sm text-destructive">{errors.platform.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective">
            Objetivo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="objective"
            placeholder="Ex: Conversões, Tráfego"
            {...register("objective")}
            className={errors.objective ? "border-destructive" : ""}
          />
          {errors.objective && (
            <p className="text-sm text-destructive">{errors.objective.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Orçamento (R$)</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            placeholder="5000"
            {...register("budget", { valueAsNumber: true })}
            className={errors.budget ? "border-destructive" : ""}
          />
          {errors.budget && (
            <p className="text-sm text-destructive">{errors.budget.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_date">Data de Início</Label>
          <Input
            id="start_date"
            type="date"
            {...register("start_date")}
            className={errors.start_date ? "border-destructive" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Data de Término</Label>
          <Input
            id="end_date"
            type="date"
            {...register("end_date")}
            className={errors.end_date ? "border-destructive" : ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value: any) => setValue("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativa</SelectItem>
            <SelectItem value="paused">Pausada</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-primary" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Campanha
        </Button>
      </div>
    </form>
  );
}
