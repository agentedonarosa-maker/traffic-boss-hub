import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UpdateMeetingData {
  id: string;
  title?: string;
  description?: string;
  client_id?: string;
  meeting_date?: string;
  feedback?: string;
}

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateMeetingData) => {
      const { data: meeting, error } = await supabase
        .from("meetings")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return meeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast({
        title: "Reunião atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar reunião",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
