import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { BriefingFormData } from "@/lib/validations/briefing";

export const useCreateBriefing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BriefingFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: briefing, error } = await supabase
        .from("client_briefings")
        .insert({
          user_id: user.id,
          client_id: data.client_id,
          company_name: data.company_name,
          business_segment: data.business_segment,
          business_description: data.business_description,
          target_audience: data.target_audience,
          main_competitors: data.main_competitors,
          main_objective: data.main_objective,
          secondary_objectives: data.secondary_objectives,
          current_channels: data.current_channels,
          monthly_budget: data.monthly_budget,
          website_url: data.website_url,
          social_media_links: data.social_media_links as any,
          products_services: data.products_services,
          unique_selling_points: data.unique_selling_points,
          pain_points: data.pain_points,
          success_metrics: data.success_metrics,
          additional_notes: data.additional_notes,
          status: data.status,
        })
        .select()
        .single();

      if (error) throw error;
      return briefing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
      toast({
        title: "Briefing criado!",
        description: "O briefing foi salvo com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar briefing",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
