import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  client_id: string;
  meeting_date: string;
  feedback: string | null;
  created_at: string;
}

export const useMeetings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["meetings", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", user.id)
        .order("meeting_date", { ascending: false });

      if (error) throw error;
      return data as Meeting[];
    },
    enabled: !!user,
  });
};
