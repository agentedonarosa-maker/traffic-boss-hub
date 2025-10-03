import { z } from "zod";

export const campaignSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  client_id: z.string().uuid("Cliente inválido"),
  platform: z.string().min(1, "Plataforma é obrigatória"),
  objective: z.string().min(1, "Objetivo é obrigatório"),
  budget: z.number().positive("Orçamento deve ser positivo").optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.enum(["active", "paused", "completed"]).default("active"),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;
