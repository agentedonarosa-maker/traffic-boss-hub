import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateMetricData {
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  investment: number;
  leads: number;
  sales: number;
  revenue: number;
}

export const useCreateMetric = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMetricData) => {
      if (!user) throw new Error("Usuário não autenticado");

      // Calculate CTR, CPL, ROAS
      const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
      const cpl = data.leads > 0 ? data.investment / data.leads : 0;
      const roas = data.investment > 0 ? data.revenue / data.investment : 0;

      const { data: newMetric, error } = await supabase
        .from("campaign_metrics")
        .insert({
          ...data,
          ctr,
          cpl,
          roas,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return newMetric;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign_metrics"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_metrics"] });
      toast({
        title: "Métrica adicionada",
        description: "Os dados foram salvos com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar métrica",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
