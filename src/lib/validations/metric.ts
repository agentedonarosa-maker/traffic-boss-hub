import { z } from "zod";

export const metricSchema = z.object({
  campaign_id: z.string().uuid("Campanha inválida"),
  date: z.string().min(1, "Data é obrigatória"),
  impressions: z.number().int().min(0).default(0),
  clicks: z.number().int().min(0).default(0),
  investment: z.number().min(0).default(0),
  leads: z.number().int().min(0).default(0),
  sales: z.number().int().min(0).default(0),
  revenue: z.number().min(0).default(0),
});

export type MetricFormData = z.infer<typeof metricSchema>;
