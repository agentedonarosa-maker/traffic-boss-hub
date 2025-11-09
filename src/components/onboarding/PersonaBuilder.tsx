import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, User } from "lucide-react";
import type { PersonaData } from "@/lib/validations/strategy";

interface PersonaBuilderProps {
  personas: PersonaData[];
  onChange: (personas: PersonaData[]) => void;
}

export const PersonaBuilder = ({ personas, onChange }: PersonaBuilderProps) => {
  const addPersona = () => {
    onChange([
      ...personas,
      {
        name: "",
        age: "",
        occupation: "",
        goals: "",
        challenges: "",
        behavior: "",
        preferred_channels: [],
      },
    ]);
  };

  const updatePersona = (index: number, field: keyof PersonaData, value: any) => {
    const updated = [...personas];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removePersona = (index: number) => {
    onChange(personas.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold">Personas</h3>
        <Button onClick={addPersona} size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
          <Plus className="h-3 h-3 sm:h-4 sm:w-4 mr-2" />
          <span className="hidden sm:inline">Adicionar Persona</span>
          <span className="sm:hidden">Adicionar</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {personas.map((persona, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <User className="h-3 h-3 sm:h-4 sm:w-4" />
                Persona {index + 1}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removePersona(index)}>
                <Trash2 className="h-3 h-3 sm:h-4 sm:w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={persona.name}
                  onChange={(e) => updatePersona(index, "name", e.target.value)}
                  placeholder="Ex: Maria Empreendedora"
                />
              </div>

              <div className="space-y-2">
                <Label>Idade</Label>
                <Input
                  value={persona.age}
                  onChange={(e) => updatePersona(index, "age", e.target.value)}
                  placeholder="Ex: 25-35 anos"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Ocupação</Label>
                <Input
                  value={persona.occupation}
                  onChange={(e) => updatePersona(index, "occupation", e.target.value)}
                  placeholder="Ex: Gerente de Marketing"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Objetivos</Label>
                <Textarea
                  value={persona.goals}
                  onChange={(e) => updatePersona(index, "goals", e.target.value)}
                  placeholder="Quais são os objetivos desta persona?"
                  rows={2}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Desafios</Label>
                <Textarea
                  value={persona.challenges}
                  onChange={(e) => updatePersona(index, "challenges", e.target.value)}
                  placeholder="Quais desafios ela enfrenta?"
                  rows={2}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Comportamento Online</Label>
                <Textarea
                  value={persona.behavior}
                  onChange={(e) => updatePersona(index, "behavior", e.target.value)}
                  placeholder="Como ela se comporta online?"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {personas.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Nenhuma persona criada ainda</p>
              <Button onClick={addPersona}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Persona
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
