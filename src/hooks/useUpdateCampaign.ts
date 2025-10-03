import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UpdateCampaignData {
  id: string;
  name?: string;
  client_id?: string;
  platform?: string;
  objective?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCampaignData) => {
      const { data: updatedCampaign, error } = await supabase
        .from("campaigns")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Campanha atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar campanha",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
