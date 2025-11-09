import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { BriefingFormData } from "@/lib/validations/briefing";

export const useUpdateBriefing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BriefingFormData> }) => {
      const { data: briefing, error } = await supabase
        .from("client_briefings")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return briefing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
      toast({
        title: "Briefing atualizado!",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar briefing",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
