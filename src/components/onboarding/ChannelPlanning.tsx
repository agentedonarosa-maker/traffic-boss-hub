import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ChannelStrategyData } from "@/lib/validations/strategy";

interface ChannelPlanningProps {
  channels: Record<string, ChannelStrategyData>;
  onChange: (channel: string, data: ChannelStrategyData) => void;
}

const CHANNELS = [
  { key: "meta", name: "Meta Ads", icon: "📱" },
  { key: "google", name: "Google Ads", icon: "🔍" },
  { key: "tiktok", name: "TikTok Ads", icon: "🎵" },
];

export const ChannelPlanning = ({ channels, onChange }: ChannelPlanningProps) => {
  const updateChannel = (channel: string, field: keyof ChannelStrategyData, value: any) => {
    const currentChannel = channels[channel] || { objective: "", budget: 0, campaign_types: [], kpis: [], notes: "" };
    onChange(channel, { ...currentChannel, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Estratégia por Canal</h3>
      <div className="grid gap-4">
        {CHANNELS.map(({ key, name, icon }) => {
          const channelData = channels[key] || { objective: "", budget: 0, campaign_types: [], kpis: [], notes: "" };

          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{icon}</span>
                  {name}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Objetivo do Canal</Label>
                  <Textarea
                    value={channelData.objective}
                    onChange={(e) => updateChannel(key, "objective", e.target.value)}
                    placeholder="Qual o objetivo neste canal?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Budget Estimado (R$)</Label>
                  <Input
                    type="number"
                    value={channelData.budget || ""}
                    onChange={(e) => updateChannel(key, "budget", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>KPIs Principais</Label>
                  <Input
                    value={channelData.kpis?.join(", ")}
                    onChange={(e) => updateChannel(key, "kpis", e.target.value.split(",").map((s) => s.trim()))}
                    placeholder="Ex: ROAS, CPL, CPA"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Tipos de Campanha</Label>
                  <Textarea
                    value={channelData.campaign_types?.join(", ")}
                    onChange={(e) => updateChannel(key, "campaign_types", e.target.value.split(",").map((s) => s.trim()))}
                    placeholder="Ex: Conversão, Tráfego, Reconhecimento"
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={channelData.notes}
                    onChange={(e) => updateChannel(key, "notes", e.target.value)}
                    placeholder="Notas adicionais sobre a estratégia neste canal"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
