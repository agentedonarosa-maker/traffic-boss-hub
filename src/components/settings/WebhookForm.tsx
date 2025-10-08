import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { webhookSchema, type WebhookFormData } from "@/lib/validations/webhook";
import type { WebhookEvent } from "@/types/webhook";

const availableEvents: { value: WebhookEvent; label: string }[] = [
  { value: 'campaign.created', label: 'Campanha Criada' },
  { value: 'campaign.updated', label: 'Campanha Atualizada' },
  { value: 'campaign.deleted', label: 'Campanha Deletada' },
  { value: 'metric.updated', label: 'Métrica Atualizada' },
  { value: 'meeting.created', label: 'Reunião Criada' },
  { value: 'meeting.updated', label: 'Reunião Atualizada' },
  { value: 'meeting.deleted', label: 'Reunião Deletada' },
  { value: 'client.created', label: 'Cliente Criado' },
  { value: 'client.updated', label: 'Cliente Atualizado' },
];

interface WebhookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WebhookFormData) => void;
  defaultValues?: Partial<WebhookFormData>;
  isEditing?: boolean;
}

export default function WebhookForm({ open, onClose, onSubmit, defaultValues, isEditing }: WebhookFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      retry_count: 3,
      timeout_ms: 5000,
      events: [],
      ...defaultValues,
    },
  });

  const selectedEvents = watch('events') || [];

  const handleEventToggle = (event: WebhookEvent, checked: boolean) => {
    const current = selectedEvents;
    const updated = checked 
      ? [...current, event] 
      : current.filter(e => e !== event);
    setValue('events', updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Webhook' : 'Novo Webhook'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Webhook N8N - Notificações"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              {...register('url')}
              placeholder="https://seu-n8n.com/webhook/abc123"
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              URL do seu endpoint N8N, Evolution API ou outro serviço
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret">Secret *</Label>
            <Input
              id="secret"
              type="password"
              {...register('secret')}
              placeholder="Mínimo 16 caracteres"
            />
            {errors.secret && (
              <p className="text-sm text-destructive">{errors.secret.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Usado para assinar os webhooks (HMAC SHA256)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Eventos * (selecione pelo menos um)</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableEvents.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={value}
                    checked={selectedEvents.includes(value)}
                    onCheckedChange={(checked) => handleEventToggle(value, checked as boolean)}
                  />
                  <Label htmlFor={value} className="cursor-pointer font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.events && (
              <p className="text-sm text-destructive">{errors.events.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retry_count">Tentativas de Retry</Label>
              <Input
                id="retry_count"
                type="number"
                {...register('retry_count', { valueAsNumber: true })}
                min={0}
                max={10}
              />
              {errors.retry_count && (
                <p className="text-sm text-destructive">{errors.retry_count.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout_ms">Timeout (ms)</Label>
              <Input
                id="timeout_ms"
                type="number"
                {...register('timeout_ms', { valueAsNumber: true })}
                min={1000}
                max={30000}
                step={1000}
              />
              {errors.timeout_ms && (
                <p className="text-sm text-destructive">{errors.timeout_ms.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Criar Webhook'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
