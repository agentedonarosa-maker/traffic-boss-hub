import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MeetingConfirmationParams {
  token: string;
  meetingId: string;
  action: 'confirm' | 'decline' | 'suggest';
  suggestedDates?: Date[];
  notes?: string;
}

export const useMeetingConfirmation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token, meetingId, action, suggestedDates, notes }: MeetingConfirmationParams) => {
      const { data, error } = await supabase.functions.invoke('manage-meeting-confirmation', {
        body: {
          token,
          meeting_id: meetingId,
          action,
          suggested_dates: suggestedDates?.map(d => d.toISOString()),
          notes,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clientPortalData"] });
      toast({
        title: "Sucesso",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar resposta",
        variant: "destructive",
      });
    },
  });
};
