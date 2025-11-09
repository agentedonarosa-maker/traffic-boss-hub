import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { StrategicPlanFormData } from "@/lib/validations/strategy";

export const useCreateStrategicPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StrategicPlanFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: plan, error } = await supabase
        .from("strategic_plans")
        .insert({
          user_id: user.id,
          client_id: data.client_id,
          briefing_id: data.briefing_id,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          opportunities: data.opportunities,
          threats: data.threats,
          personas: data.personas as any,
          funnel_stages: data.funnel_stages as any,
          channel_strategy: data.channel_strategy as any,
          kpis: data.kpis as any,
          timeline: data.timeline as any,
          status: data.status,
        })
        .select()
        .single();

      if (error) throw error;
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategic-plans"] });
      toast({
        title: "Planejamento criado!",
        description: "O planejamento estratégico foi salvo com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar planejamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
