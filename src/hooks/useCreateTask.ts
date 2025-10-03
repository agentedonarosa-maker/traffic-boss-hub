import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateTaskData {
  title: string;
  description?: string;
  client_id?: string;
  campaign_id?: string;
  due_date?: string;
  priority?: string;
  status?: string;
}

export const useCreateTask = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: newTask, error } = await supabase
        .from("tasks")
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Tarefa criada",
        description: "A tarefa foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
