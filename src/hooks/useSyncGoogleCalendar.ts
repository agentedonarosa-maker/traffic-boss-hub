import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SyncGoogleCalendarParams {
  meetingId: string;
  action: 'create' | 'update' | 'delete';
}

export const useSyncGoogleCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meetingId, action }: SyncGoogleCalendarParams) => {
      const { data, error } = await supabase.functions.invoke('sync-google-calendar', {
        body: { meetingId, action }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      
      if (variables.action === 'create' && data.meetLink) {
        toast({
          title: "Reunião sincronizada!",
          description: `Google Meet criado com sucesso.`,
        });
      } else if (variables.action === 'update') {
        toast({
          title: "Reunião atualizada",
          description: "Evento no Google Calendar foi atualizado.",
        });
      } else if (variables.action === 'delete') {
        toast({
          title: "Reunião removida",
          description: "Evento removido do Google Calendar.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
