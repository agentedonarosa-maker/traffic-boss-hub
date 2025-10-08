import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useCreateMeeting } from '@/hooks/useCreateMeeting';
import { useDeleteMeeting } from '@/hooks/useDeleteMeeting';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { useSyncGoogleCalendar } from '@/hooks/useSyncGoogleCalendar';
import { toast } from '@/hooks/use-toast';
import CalendarView from '@/components/calendar/CalendarView';
import UpcomingMeetings from '@/components/calendar/UpcomingMeetings';
import OptimizationTasks from '@/components/calendar/OptimizationTasks';
import MeetingForm from '@/components/calendar/MeetingForm';
import { Meeting } from '@/hooks/useMeetings';
import { MeetingFormData } from '@/lib/validations/meeting';
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
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  const { data: meetings = [], isLoading: meetingsLoading } = useMeetings();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  
  const createMeeting = useCreateMeeting();
  const deleteMeeting = useDeleteMeeting();
  const syncGoogleCalendar = useSyncGoogleCalendar();
  const updateTask = useUpdateTask();

  const handleCreateMeeting = () => {
    setSelectedMeeting(null);
    setSelectedDate(null);
    setShowMeetingForm(true);
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

  const handleMeetingSubmit = async (data: MeetingFormData & { syncWithGoogle?: boolean }) => {
    try {
      const meetingData = {
        title: data.title,
        client_id: data.client_id,
        meeting_date: data.meeting_date,
        description: data.description || null,
        feedback: data.feedback || null,
      };
      
      const meeting = await createMeeting.mutateAsync(meetingData);
      
      // Sincronizar com Google Calendar se solicitado
      if (data.syncWithGoogle && meeting?.id) {
        await syncGoogleCalendar.mutateAsync({
          meetingId: meeting.id,
          action: 'create',
        });
      }
      
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
      // Se estiver sincronizado com Google, deletar do Google Calendar também
      if (meetingToDelete.google_event_id) {
        await syncGoogleCalendar.mutateAsync({
          meetingId: meetingToDelete.id,
          action: 'delete',
        });
      }

      await deleteMeeting.mutateAsync(meetingToDelete.id);
      setMeetingToDelete(null);
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
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

  const isLoading = meetingsLoading || clientsLoading || tasksLoading;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie reuniões com clientes e tarefas de otimização
          </p>
        </div>
        <Button onClick={handleCreateMeeting}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Reunião
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Carregando agenda...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CalendarView
              meetings={meetings}
              clients={clients}
              onMeetingClick={handleEditMeeting}
              onDateClick={handleDateClick}
            />
          </div>

          <div className="space-y-6">
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

      <AlertDialog open={!!meetingToDelete} onOpenChange={() => setMeetingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reunião</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a reunião "{meetingToDelete?.title}"? 
              {meetingToDelete?.google_event_id && " Esta ação também removerá o evento do Google Calendar."}
              {" Esta ação não pode ser desfeita."}
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
