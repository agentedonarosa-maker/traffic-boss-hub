import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dates: Date[], notes: string) => void;
  isLoading?: boolean;
}

export function SuggestMeetingDialog({ open, onOpenChange, onSubmit, isLoading }: SuggestMeetingDialogProps) {
  const [suggestedDates, setSuggestedDates] = useState<Date[]>([]);
  const [notes, setNotes] = useState("");
  const [currentDate, setCurrentDate] = useState<Date>();

  const handleAddDate = () => {
    if (currentDate && suggestedDates.length < 3) {
      setSuggestedDates([...suggestedDates, currentDate]);
      setCurrentDate(undefined);
    }
  };

  const handleRemoveDate = (index: number) => {
    setSuggestedDates(suggestedDates.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (suggestedDates.length > 0) {
      onSubmit(suggestedDates, notes);
      setSuggestedDates([]);
      setNotes("");
      setCurrentDate(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sugerir novos horários</DialogTitle>
          <DialogDescription>
            Escolha até 3 datas alternativas que funcionem melhor para você
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Datas sugeridas ({suggestedDates.length}/3)</Label>
            
            {suggestedDates.length < 3 && (
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !currentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentDate ? format(currentDate, "PPP 'às' HH:mm", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={setCurrentDate}
                      disabled={(date) => date < new Date()}
                      locale={ptBR}
                    />
                    {currentDate && (
                      <div className="p-3 border-t">
                        <Label className="text-sm">Horário</Label>
                        <input
                          type="time"
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          onChange={(e) => {
                            if (currentDate && e.target.value) {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(currentDate);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              setCurrentDate(newDate);
                            }
                          }}
                        />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                <Button onClick={handleAddDate} disabled={!currentDate}>
                  Adicionar
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {suggestedDates.map((date, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
                >
                  <span className="text-sm">
                    {format(date, "PPP 'às' HH:mm", { locale: ptBR })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDate(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Prefiro pela manhã, tenho mais disponibilidade..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={suggestedDates.length === 0 || isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar sugestões"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
