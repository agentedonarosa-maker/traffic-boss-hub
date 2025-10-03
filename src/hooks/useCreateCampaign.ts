import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateCampaignData {
  name: string;
  client_id: string;
  platform: string;
  objective: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export const useCreateCampaign = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCampaignData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: newCampaign, error } = await supabase
        .from("campaigns")
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return newCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Campanha criada",
        description: "A campanha foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar campanha",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
