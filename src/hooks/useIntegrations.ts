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

export const useIntegrations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["integrations", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Integration[];
    },
    enabled: !!user,
  });
};
