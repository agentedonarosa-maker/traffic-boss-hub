import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useGoogleCalendarAuth = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ['google-calendar-status', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_google_tokens')
        .select('calendar_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const startAuth = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-calendar-auth/start');
      
      if (error) throw error;
      
      const result = await data;
      if (result.authUrl) {
        window.location.href = result.authUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao iniciar autenticação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const disconnect = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('user_google_tokens')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-calendar-status'] });
      toast({
        title: "Desconectado",
        description: "Google Calendar foi desconectado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao desconectar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    startAuth: startAuth.mutate,
    disconnect: disconnect.mutate,
    isConnected: !!connectionStatus,
    calendarEmail: connectionStatus?.calendar_id,
    isLoading,
  };
};
