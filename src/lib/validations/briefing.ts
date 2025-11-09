import { z } from "zod";

export const briefingSchema = z.object({
  client_id: z.string().uuid("Cliente inválido"),
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  business_segment: z.string().min(1, "Segmento é obrigatório"),
  business_description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  target_audience: z.string().min(10, "Descrição do público é obrigatória"),
  main_competitors: z.string().optional(),
  main_objective: z.string().min(1, "Objetivo principal é obrigatório"),
  secondary_objectives: z.array(z.string()).default([]),
  current_channels: z.array(z.string()).default([]),
  monthly_budget: z.number().min(0, "Orçamento não pode ser negativo").optional(),
  website_url: z.string().url("URL inválida").optional().or(z.literal("")),
  social_media_links: z.record(z.string()).default({}),
  products_services: z.string().min(1, "Produtos/serviços são obrigatórios"),
  unique_selling_points: z.string().optional(),
  pain_points: z.string().optional(),
  success_metrics: z.string().min(1, "Métricas de sucesso são obrigatórias"),
  additional_notes: z.string().optional(),
  status: z.enum(["draft", "complete", "in_review"]).default("draft"),
});

export type BriefingFormData = z.infer<typeof briefingSchema>;
