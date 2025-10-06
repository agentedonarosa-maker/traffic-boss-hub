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

// Função para gerar token único no lado do cliente
const generateToken = () => {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const useGenerateClientAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      // Gerar token único
      const token = generateToken();

      // Criar ou atualizar acesso do cliente
      const { data, error } = await supabase
        .from("client_access")
        .upsert({
          client_id: clientId,
          access_token: token,
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
      // Usar edge function segura para validar token (não expõe tokens via RLS)
      const { data, error } = await supabase.functions.invoke("validate-client-token", {
        body: { token },
      });

      if (error) throw error;
      if (!data) throw new Error("Dados não encontrados");

      return data;
    },
    enabled: !!token,
  });
};
