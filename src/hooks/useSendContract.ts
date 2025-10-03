import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SendContractData {
  clientName: string;
  clientEmail: string;
  contractContent: string;
  managerName: string;
}

export const useSendContract = () => {
  return useMutation({
    mutationFn: async (data: SendContractData) => {
      const { data: result, error } = await supabase.functions.invoke(
        "send-contract",
        {
          body: data,
        }
      );

      if (error) throw error;
      return result;
    },
  });
};
