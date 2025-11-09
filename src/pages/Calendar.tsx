import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCreateMeeting } from '@/hooks/useCreateMeeting';
import { useDeleteMeeting } from '@/hooks/useDeleteMeeting';
import { useCreateTask } from '@/hooks/useCreateTask';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { toast } from '@/hooks/use-toast';
import CalendarView from '@/components/calendar/CalendarView';
import UpcomingMeetings from '@/components/calendar/UpcomingMeetings';
import OptimizationTasks from '@/components/calendar/OptimizationTasks';
import MeetingForm from '@/components/calendar/MeetingForm';
import TaskForm from '@/components/calendar/TaskForm';
import { Meeting } from '@/hooks/useMeetings';
import { MeetingFormData } from '@/lib/validations/meeting';
import { TaskFormData } from '@/lib/validations/task';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Calendar() {
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  const { data: meetings = [], isLoading: meetingsLoading } = useMeetings();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns();
  
  const createMeeting = useCreateMeeting();
  const deleteMeeting = useDeleteMeeting();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const handleCreateMeeting = () => {
    setSelectedMeeting(null);
    setSelectedDate(null);
    setShowMeetingForm(true);
  };

  const handleCreateTask = () => {
    setShowTaskForm(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingForm(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedMeeting(null);
    setShowMeetingForm(true);
  };

  const handleMeetingSubmit = async (data: MeetingFormData) => {
    try {
      const meetingData = {
        title: data.title,
        client_id: data.client_id,
        meeting_date: data.meeting_date,
        description: data.description || null,
        feedback: data.feedback || null,
      };
      
      await createMeeting.mutateAsync(meetingData);
      
      setShowMeetingForm(false);
      setSelectedMeeting(null);
      setSelectedDate(null);
    } catch (error: any) {
      console.error('Error saving meeting:', error);
    }
  };

  const handleDeleteMeeting = (meeting: Meeting) => {
    setMeetingToDelete(meeting);
  };

  const confirmDeleteMeeting = async () => {
    if (!meetingToDelete) return;

    try {
      await deleteMeeting.mutateAsync(meetingToDelete.id);
      setMeetingToDelete(null);
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleTaskSubmit = async (data: TaskFormData) => {
    try {
      await createTask.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        client_id: data.client_id || undefined,
        campaign_id: data.campaign_id || undefined,
        due_date: data.due_date || undefined,
        priority: data.priority,
        status: data.status,
      });
      setShowTaskForm(false);
    } catch (error: any) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, newStatus: string) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        status: newStatus,
      });

      toast({
        title: "Tarefa atualizada",
        description: newStatus === 'completed' 
          ? "Tarefa marcada como concluída" 
          : "Tarefa marcada como pendente",
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
    }
  };

  const getDefaultMeetingValues = (): Partial<MeetingFormData> => {
    if (selectedMeeting) {
      return {
        title: selectedMeeting.title,
        client_id: selectedMeeting.client_id,
        meeting_date: selectedMeeting.meeting_date,
        description: selectedMeeting.description || undefined,
        feedback: selectedMeeting.feedback || undefined,
      };
    }
    
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().slice(0, 16);
      return {
        meeting_date: dateStr,
      };
    }

    return {};
  };

  const isLoading = meetingsLoading || clientsLoading || tasksLoading || campaignsLoading;

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Gerencie reuniões com clientes e tarefas de otimização
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleCreateTask} variant="outline" className="w-full sm:w-auto text-sm">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nova Tarefa</span>
            <span className="sm:hidden">Tarefa</span>
          </Button>
          <Button onClick={handleCreateMeeting} className="w-full sm:w-auto text-sm">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nova Reunião</span>
            <span className="sm:hidden">Reunião</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs sm:text-sm text-muted-foreground">
          Carregando agenda...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
            <CalendarView
              meetings={meetings}
              clients={clients}
              onMeetingClick={handleEditMeeting}
              onDateClick={handleDateClick}
            />
          </div>

          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <UpcomingMeetings
              meetings={meetings}
              clients={clients}
              onEdit={handleEditMeeting}
              onDelete={handleDeleteMeeting}
            />

            <OptimizationTasks
              tasks={tasks}
              clients={clients}
              onToggleTask={handleToggleTask}
            />
          </div>
        </div>
      )}

      <MeetingForm
        open={showMeetingForm}
        onClose={() => {
          setShowMeetingForm(false);
          setSelectedMeeting(null);
          setSelectedDate(null);
        }}
        onSubmit={handleMeetingSubmit}
        defaultValues={getDefaultMeetingValues()}
        isEditing={!!selectedMeeting}
      />

      <TaskForm
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleTaskSubmit}
        clients={clients}
        campaigns={campaigns}
      />

      <AlertDialog open={!!meetingToDelete} onOpenChange={() => setMeetingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reunião</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a reunião "{meetingToDelete?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMeeting}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
