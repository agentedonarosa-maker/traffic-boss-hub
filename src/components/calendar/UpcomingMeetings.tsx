import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, MessageSquare, Users, Trash2 } from 'lucide-react';
import { format, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Meeting } from '@/hooks/useMeetings';
import { Client } from '@/hooks/useClients';

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  clients: Client[];
  onEdit: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
}

export default function UpcomingMeetings({ meetings, clients, onEdit, onDelete }: UpcomingMeetingsProps) {
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente';
  };

  const sortedMeetings = [...meetings].sort((a, b) => 
    new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime()
  );

  const upcomingMeetings = sortedMeetings.filter(m => isFuture(new Date(m.meeting_date)));
  const pastMeetings = sortedMeetings.filter(m => isPast(new Date(m.meeting_date))).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Próximas Reuniões */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximas Reuniões
          </CardTitle>
          <CardDescription>
            {upcomingMeetings.length} reunião(ões) agendada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma reunião agendada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{meeting.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {getClientName(meeting.client_id)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(meeting.meeting_date), "dd 'de' MMMM", { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(meeting.meeting_date), 'HH:mm')}
                        </div>
                      </div>

                      {meeting.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {meeting.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(meeting)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(meeting)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reuniões Anteriores */}
      {pastMeetings.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Reuniões Anteriores
            </CardTitle>
            <CardDescription>Últimas 5 reuniões realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{meeting.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {getClientName(meeting.client_id)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(meeting.meeting_date), "dd/MM/yyyy 'às' HH:mm")}
                      </div>

                      {meeting.feedback && (
                        <div className="mt-2 p-3 bg-background rounded border border-border">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Feedback:</p>
                          <p className="text-sm">{meeting.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(meeting)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(meeting)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
