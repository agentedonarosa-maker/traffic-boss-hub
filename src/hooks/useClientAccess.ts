import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ClientAccess {
  id: string;
  client_id: string;
  access_token: string;
  is_active: boolean;
  created_at: string;
  last_accessed_at: string | null;
}

export const useClientAccess = (clientId?: string) => {
  return useQuery({
    queryKey: ["client_access", clientId],
    queryFn: async () => {
      if (!clientId) return null;

      const { data, error } = await supabase
        .from("client_access")
        .select("*")
        .eq("client_id", clientId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as ClientAccess | null;
    },
    enabled: !!clientId,
  });
};

export const useGenerateClientAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      // Gerar token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc("generate_client_token");

      if (tokenError) throw tokenError;

      // Criar ou atualizar acesso do cliente
      const { data, error } = await supabase
        .from("client_access")
        .upsert({
          client_id: clientId,
          access_token: tokenData,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ClientAccess;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["client_access"] });
      toast({
        title: "Link de acesso gerado",
        description: "O link foi copiado para a área de transferência",
      });
      
      // Copiar link para clipboard
      const portalUrl = `${window.location.origin}/client-portal/${data.access_token}`;
      navigator.clipboard.writeText(portalUrl);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useClientPortalData = (token: string) => {
  return useQuery({
    queryKey: ["client_portal", token],
    queryFn: async () => {
      // Buscar acesso do cliente pelo token
      const { data: access, error: accessError } = await supabase
        .from("client_access")
        .select(`
          *,
          client:clients(*)
        `)
        .eq("access_token", token)
        .eq("is_active", true)
        .single();

      if (accessError) throw accessError;

      const clientId = access.client_id;

      // Buscar reuniões do cliente
      const { data: meetings, error: meetingsError } = await supabase
        .from("meetings")
        .select("*")
        .eq("client_id", clientId)
        .order("meeting_date", { ascending: true });

      if (meetingsError) throw meetingsError;

      // Buscar campanhas do cliente
      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("client_id", clientId);

      if (campaignsError) throw campaignsError;

      const campaignIds = campaigns?.map(c => c.id) || [];

      // Buscar métricas das campanhas
      const { data: metrics, error: metricsError } = await supabase
        .from("campaign_metrics")
        .select("*")
        .in("campaign_id", campaignIds)
        .order("date", { ascending: false })
        .limit(30);

      if (metricsError) throw metricsError;

      // Buscar tarefas do cliente
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("client_id", clientId)
        .order("due_date", { ascending: true });

      if (tasksError) throw tasksError;

      // Atualizar last_accessed_at
      await supabase
        .from("client_access")
        .update({ last_accessed_at: new Date().toISOString() })
        .eq("access_token", token);

      return {
        client: access.client,
        meetings,
        campaigns,
        metrics,
        tasks,
      };
    },
    enabled: !!token,
  });
};
