import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  company: z
    .string()
    .trim()
    .max(100, "Nome da empresa deve ter no máximo 100 caracteres")
    .optional(),
  contact: z
    .string()
    .trim()
    .max(255, "Contato deve ter no máximo 255 caracteres")
    .optional(),
  niche: z
    .string()
    .trim()
    .max(100, "Nicho deve ter no máximo 100 caracteres")
    .optional(),
  monthly_budget: z
    .number()
    .positive("Orçamento deve ser um valor positivo")
    .optional()
    .or(z.literal(0)),
  strategic_notes: z
    .string()
    .trim()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
