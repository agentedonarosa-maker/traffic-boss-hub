import { z } from "zod";

export const paymentSchema = z.object({
  client_id: z.string().uuid("Cliente inválido"),
  contract_value: z.number().positive("Valor deve ser positivo"),
  payment_frequency: z.enum(["monthly", "quarterly", "annual", "one_time"], {
    errorMap: () => ({ message: "Frequência inválida" }),
  }),
  payment_method: z.enum(["pix", "boleto", "credit_card", "transfer"], {
    errorMap: () => ({ message: "Método de pagamento inválido" }),
  }),
  payment_status: z.enum(["pending", "paid", "overdue", "cancelled"]).default("pending"),
  due_date: z.string().min(1, "Data de vencimento é obrigatória"),
  paid_date: z.string().optional(),
  payment_code: z.string().optional(),
  notes: z.string().max(500, "Observações devem ter no máximo 500 caracteres").optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
