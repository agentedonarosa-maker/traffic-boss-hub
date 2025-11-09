import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { FunnelStageData } from "@/lib/validations/strategy";

interface FunnelStrategyProps {
  funnel: {
    awareness?: FunnelStageData;
    consideration?: FunnelStageData;
    decision?: FunnelStageData;
  };
  onChange: (stage: "awareness" | "consideration" | "decision", data: FunnelStageData) => void;
}

export const FunnelStrategy = ({ funnel, onChange }: FunnelStrategyProps) => {
  const updateStage = (stage: "awareness" | "consideration" | "decision", field: keyof FunnelStageData, value: any) => {
    const currentStage = funnel[stage] || { objective: "", content_types: [], channels: [], metrics: [] };
    onChange(stage, { ...currentStage, [field]: value });
  };

  const renderStage = (
    stage: "awareness" | "consideration" | "decision",
    title: string,
    description: string,
    color: string
  ) => {
    const stageData = funnel[stage] || { objective: "", content_types: [], channels: [], metrics: [] };

    return (
      <Card className={color}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Objetivo</Label>
            <Textarea
              value={stageData.objective}
              onChange={(e) => updateStage(stage, "objective", e.target.value)}
              placeholder="Qual o objetivo desta etapa?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipos de Conteúdo</Label>
            <Textarea
              value={stageData.content_types?.join(", ")}
              onChange={(e) => updateStage(stage, "content_types", e.target.value.split(",").map((s) => s.trim()))}
              placeholder="Ex: Vídeos, Blog posts, Infográficos"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Canais</Label>
            <Textarea
              value={stageData.channels?.join(", ")}
              onChange={(e) => updateStage(stage, "channels", e.target.value.split(",").map((s) => s.trim()))}
              placeholder="Ex: Instagram, Facebook, Google"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Métricas</Label>
            <Textarea
              value={stageData.metrics?.join(", ")}
              onChange={(e) => updateStage(stage, "metrics", e.target.value.split(",").map((s) => s.trim()))}
              placeholder="Ex: Impressões, Alcance, CTR"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Funil de Marketing</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {renderStage(
          "awareness",
          "Topo de Funil",
          "Consciência - Atrair atenção",
          "border-blue-200 dark:border-blue-800"
        )}
        {renderStage(
          "consideration",
          "Meio de Funil",
          "Consideração - Educar e nutrir",
          "border-purple-200 dark:border-purple-800"
        )}
        {renderStage(
          "decision",
          "Fundo de Funil",
          "Decisão - Converter em cliente",
          "border-green-200 dark:border-green-800"
        )}
      </div>
    </div>
  );
};
