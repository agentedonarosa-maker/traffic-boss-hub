import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImportMetaInsights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("import-meta-insights", {
        body: {},
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ad_insights"] });
      
      toast.success("Insights importados com sucesso!", {
        description: `${data.imported} registros de insights foram importados do Meta Ads.`,
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao importar insights:", error);
      toast.error("Erro ao importar insights", {
        description: error.message || "Ocorreu um erro ao importar os dados do Meta Ads.",
      });
    },
  });
};
