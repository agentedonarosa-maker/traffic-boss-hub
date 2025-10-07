import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ImportResult {
  imported: number;
  skipped: number;
  total: number;
  errors?: Array<{ campaign: string; error: string }>;
}

export const useImportMetaCampaigns = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      const { data, error } = await supabase.functions.invoke(
        "import-meta-campaigns",
        {
          body: { client_id: clientId },
        }
      );

      if (error) throw error;
      return data as ImportResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      
      if (data.imported > 0) {
        toast({
          title: "Campanhas importadas",
          description: `${data.imported} campanha(s) do Meta Ads foram importadas com sucesso${
            data.skipped > 0 ? ` (${data.skipped} já existiam)` : ""
          }`,
        });
      } else {
        toast({
          title: "Nenhuma campanha nova",
          description: data.skipped > 0 
            ? `Todas as ${data.skipped} campanhas já existem no sistema`
            : "Nenhuma campanha ativa encontrada no Meta Ads",
          variant: "default",
        });
      }

      if (data.errors && data.errors.length > 0) {
        console.error("Erros na importação:", data.errors);
        toast({
          title: "Alguns erros ocorreram",
          description: `${data.errors.length} campanha(s) não puderam ser importadas`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("Erro ao importar campanhas:", error);
      toast({
        title: "Erro ao importar campanhas",
        description: error.message || "Ocorreu um erro ao importar as campanhas do Meta Ads",
        variant: "destructive",
      });
    },
  });
};
