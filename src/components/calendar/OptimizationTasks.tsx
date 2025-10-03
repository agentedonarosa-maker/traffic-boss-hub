import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  client_id: string | null;
  campaign_id: string | null;
}

interface Client {
  id: string;
  name: string;
  company: string | null;
}

interface OptimizationTasksProps {
  tasks: Task[];
  clients: Client[];
  onToggleTask: (taskId: string, newStatus: string) => void;
}

export default function OptimizationTasks({ tasks, clients, onToggleTask }: OptimizationTasksProps) {
  const getClientName = (clientId: string | null) => {
    if (!clientId) return null;
    const client = clients.find(c => c.id === clientId);
    return client?.name;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Tarefas Pendentes */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Tarefas de Otimização Pendentes
          </CardTitle>
          <CardDescription>
            {pendingTasks.length} tarefa(s) aguardando execução
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma tarefa pendente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => onToggleTask(task.id, 'completed')}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {getClientName(task.client_id) && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Cliente:</span>
                            <span>{getClientName(task.client_id)}</span>
                          </div>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Prazo: {format(new Date(task.due_date), 'dd/MM/yyyy')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tarefas Concluídas Recentes */}
      {completedTasks.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Tarefas Concluídas Recentemente
            </CardTitle>
            <CardDescription>
              {completedTasks.length} tarefa(s) concluída(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => onToggleTask(task.id, 'pending')}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2 opacity-75">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold line-through">{task.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          Concluída
                        </Badge>
                      </div>

                      {getClientName(task.client_id) && (
                        <div className="text-xs text-muted-foreground">
                          Cliente: {getClientName(task.client_id)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
