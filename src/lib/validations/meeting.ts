import { z } from "zod";

export const meetingSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  description: z.string().optional().nullable(),
  client_id: z.string().uuid("Cliente é obrigatório"),
  meeting_date: z.string().min(1, "Data é obrigatória"),
  feedback: z.string().optional().nullable(),
});

export type MeetingFormData = z.infer<typeof meetingSchema>;
