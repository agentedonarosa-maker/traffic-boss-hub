import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateIntegrationData {
  client_id: string;
  platform: 'meta_ads' | 'google_ads' | 'tiktok_ads';
  credentials: {
    access_token?: string;
    refresh_token?: string;
    ad_account_id?: string;
    account_id?: string;
    client_id?: string;
    client_secret?: string;
    customer_id?: string;
    developer_token?: string;
    advertiser_id?: string;
    [key: string]: any;
  };
}

export const useCreateIntegration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIntegrationData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: integration, error } = await supabase
        .from("integrations")
        .insert({
          client_id: data.client_id,
          platform: data.platform,
          credentials: data.credentials,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return integration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast({
        title: "Integração criada",
        description: "A integração foi conectada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar integração",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
