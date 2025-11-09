import { z } from "zod";

const personaSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  age: z.string().optional(),
  occupation: z.string().optional(),
  goals: z.string().optional(),
  challenges: z.string().optional(),
  behavior: z.string().optional(),
  preferred_channels: z.array(z.string()).default([]),
});

const funnelStageSchema = z.object({
  objective: z.string().optional(),
  content_types: z.array(z.string()).default([]),
  channels: z.array(z.string()).default([]),
  metrics: z.array(z.string()).default([]),
});

const channelStrategySchema = z.object({
  objective: z.string().optional(),
  budget: z.number().optional(),
  campaign_types: z.array(z.string()).default([]),
  kpis: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

const kpiSchema = z.object({
  name: z.string().min(1, "Nome do KPI é obrigatório"),
  target: z.string().optional(),
  current: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
});

const timelineItemSchema = z.object({
  month: z.string().min(1, "Mês é obrigatório"),
  activities: z.array(z.string()).default([]),
});

export const strategicPlanSchema = z.object({
  client_id: z.string().uuid("Cliente inválido"),
  briefing_id: z.string().uuid().optional().nullable(),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  opportunities: z.array(z.string()).default([]),
  threats: z.array(z.string()).default([]),
  personas: z.array(personaSchema).default([]),
  funnel_stages: z.object({
    awareness: funnelStageSchema.optional(),
    consideration: funnelStageSchema.optional(),
    decision: funnelStageSchema.optional(),
  }).default({}),
  channel_strategy: z.record(channelStrategySchema).default({}),
  kpis: z.array(kpiSchema).default([]),
  timeline: z.array(timelineItemSchema).default([]),
  status: z.enum(["draft", "complete", "in_review"]).default("draft"),
});

export type StrategicPlanFormData = z.infer<typeof strategicPlanSchema>;
export type PersonaData = z.infer<typeof personaSchema>;
export type FunnelStageData = z.infer<typeof funnelStageSchema>;
export type ChannelStrategyData = z.infer<typeof channelStrategySchema>;
export type KpiData = z.infer<typeof kpiSchema>;
export type TimelineItemData = z.infer<typeof timelineItemSchema>;
