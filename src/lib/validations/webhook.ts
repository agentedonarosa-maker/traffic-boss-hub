import { z } from "zod";

export const webhookEventSchema = z.enum([
  'campaign.created',
  'campaign.updated',
  'campaign.deleted',
  'metric.updated',
  'meeting.created',
  'meeting.updated',
  'meeting.deleted',
  'client.created',
  'client.updated',
  'test.webhook',
]);

export const webhookSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  url: z.string().url("URL inválida"),
  secret: z.string().min(16, "Secret deve ter pelo menos 16 caracteres"),
  events: z.array(webhookEventSchema).min(1, "Selecione pelo menos um evento"),
  retry_count: z.number().int().min(0).max(10).default(3),
  timeout_ms: z.number().int().min(1000).max(30000).default(5000),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;
