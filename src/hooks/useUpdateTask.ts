import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  client_id?: string;
  campaign_id?: string;
  due_date?: string;
  priority?: string;
  status?: string;
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateTaskData) => {
      const updateData: any = { ...data };
      
      // If status is being changed to completed, set completed_at
      if (data.status === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      const { data: updatedTask, error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Tarefa atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
