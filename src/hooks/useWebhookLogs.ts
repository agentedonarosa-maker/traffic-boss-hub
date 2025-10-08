import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useWebhookLogs = (webhookId: string | null) => {
  return useQuery({
    queryKey: ['webhook-logs', webhookId],
    queryFn: async () => {
      if (!webhookId) return [];

      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('webhook_id', webhookId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: !!webhookId,
  });
};
