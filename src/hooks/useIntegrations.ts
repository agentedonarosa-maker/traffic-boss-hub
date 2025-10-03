import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Integration {
  id: string;
  user_id: string;
  platform: 'meta' | 'google' | 'tiktok';
  credentials: {
    access_token?: string;
    refresh_token?: string;
    account_id?: string;
    client_id?: string;
    client_secret?: string;
    [key: string]: any;
  };
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useIntegrations = (clientId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["integrations", clientId],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      let query = supabase
        .from("integrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientId) {
        query = query.eq("client_id", clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Integration[];
    },
    enabled: !!user,
  });
};
