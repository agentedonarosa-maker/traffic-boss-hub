import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateMeetingData {
  title: string;
  description?: string;
  client_id: string;
  meeting_date: string;
  feedback?: string;
}

export const useCreateMeeting = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMeetingData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: newMeeting, error } = await supabase
        .from("meetings")
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return newMeeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Reunião agendada",
        description: "A reunião foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao agendar reunião",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
