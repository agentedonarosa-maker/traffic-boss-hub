import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { StrategicPlanFormData } from "@/lib/validations/strategy";

export const useUpdateStrategicPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StrategicPlanFormData> }) => {
      const { data: plan, error } = await supabase
        .from("strategic_plans")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategic-plans"] });
      toast({
        title: "Planejamento atualizado!",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar planejamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
