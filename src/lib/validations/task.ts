import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  description: z.string().optional().nullable(),
  client_id: z.string().uuid().optional().nullable(),
  campaign_id: z.string().uuid().optional().nullable(),
  due_date: z.string().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
