import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Video } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Meeting } from '@/hooks/useMeetings';
import { Client } from '@/hooks/useClients';

interface CalendarViewProps {
  meetings: Meeting[];
  clients: Client[];
  onMeetingClick: (meeting: Meeting) => void;
  onDateClick: (date: Date) => void;
}

export default function CalendarView({ meetings, clients, onMeetingClick, onDateClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const today = () => setCurrentMonth(new Date());

  const getMeetingsForDay = (day: Date) => {
    return meetings.filter(meeting => 
      isSameDay(new Date(meeting.meeting_date), day)
    );
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente';
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={today}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, idx) => {
            const dayMeetings = getMeetingsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                onClick={() => onDateClick(day)}
                className={`
                  min-h-[100px] p-2 border rounded-lg cursor-pointer transition-all
                  ${!isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : 'bg-card hover:bg-accent/50'}
                  ${isToday ? 'border-primary border-2' : 'border-border'}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayMeetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeetingClick(meeting);
                      }}
                      className="text-xs p-1 rounded bg-gradient-primary text-white truncate hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {format(new Date(meeting.meeting_date), 'HH:mm')} - {meeting.title}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayMeetings.length > 2 && (
                    <div className="text-xs text-muted-foreground pl-1">
                      +{dayMeetings.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
