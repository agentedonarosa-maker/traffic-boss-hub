import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, MousePointerClick, Target, DollarSign, Users, AlertCircle, Heart, Clock, BarChart } from "lucide-react";

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  inputs: { label: string; placeholder: string; id: string }[];
  calculate: (values: Record<string, number>) => string;
  resultLabel: string;
}

const CalculatorCard = ({ title, description, icon, inputs, calculate, resultLabel }: CalculatorCardProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");

  const handleChange = (id: string, value: string) => {
    const newValues = { ...values, [id]: value };
    setValues(newValues);

    const numericValues: Record<string, number> = {};
    let allFilled = true;

    for (const input of inputs) {
      const val = parseFloat(newValues[input.id] || "0");
      if (!newValues[input.id] || isNaN(val)) {
        allFilled = false;
        break;
      }
      numericValues[input.id] = val;
    }

    if (allFilled) {
      setResult(calculate(numericValues));
    } else {
      setResult("");
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {inputs.map((input) => (
          <div key={input.id} className="space-y-2">
            <Label htmlFor={input.id} className="text-xs sm:text-sm">{input.label}</Label>
            <Input
              id={input.id}
              type="number"
              placeholder={input.placeholder}
              value={values[input.id] || ""}
              onChange={(e) => handleChange(input.id, e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>
        ))}
        {result && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">{resultLabel}</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const MetricsCalculators = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-2 sm:mb-4">
          <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Calculadoras de Métricas
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Otimize suas campanhas de marketing digital com nossas calculadoras.
          Descubra insights valiosos sobre ROI, CAC, LTV e muito mais.
        </p>
      </div>

      <div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6">
          Métricas Principais
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <CalculatorCard
            title="Taxa de Cliques (CTR)"
            description="Mede a proporção de pessoas que clicaram no seu anúncio em relação ao total de impressões."
            icon={<MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Cliques", placeholder: "Ex: 150", id: "clicks" },
              { label: "Impressões", placeholder: "Ex: 10000", id: "impressions" },
            ]}
            calculate={(v) => `${((v.clicks / v.impressions) * 100).toFixed(2)}%`}
            resultLabel="Taxa de Cliques (CTR)"
          />

          <CalculatorCard
            title="Custo por Clique (CPC)"
            description="Calcula quanto você está pagando, em média, por cada clique em seus anúncios."
            icon={<DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Investimento Total", placeholder: "Ex: 1000", id: "investment" },
              { label: "Total de Cliques", placeholder: "Ex: 200", id: "clicks" },
            ]}
            calculate={(v) => `R$ ${(v.investment / v.clicks).toFixed(2)}`}
            resultLabel="Custo por Clique (CPC)"
          />

          <CalculatorCard
            title="Taxa de Conversão"
            description="Calcula a porcentagem de visitantes que realizaram uma ação desejada."
            icon={<Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Conversões", placeholder: "Ex: 50", id: "conversions" },
              { label: "Visitantes", placeholder: "Ex: 1000", id: "visitors" },
            ]}
            calculate={(v) => `${((v.conversions / v.visitors) * 100).toFixed(2)}%`}
            resultLabel="Taxa de Conversão"
          />

          <CalculatorCard
            title="Retorno sobre Investimento (ROI)"
            description="Calcula o retorno financeiro obtido em relação ao investimento realizado."
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Receita Gerada", placeholder: "Ex: 5000", id: "revenue" },
              { label: "Investimento", placeholder: "Ex: 1000", id: "investment" },
            ]}
            calculate={(v) => `${(((v.revenue - v.investment) / v.investment) * 100).toFixed(2)}%`}
            resultLabel="ROI"
          />

          <CalculatorCard
            title="Custo por Aquisição (CPA)"
            description="Mostra quanto você gasta, em média, para adquirir um novo cliente."
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Investimento Total", placeholder: "Ex: 2000", id: "investment" },
              { label: "Clientes Adquiridos", placeholder: "Ex: 40", id: "customers" },
            ]}
            calculate={(v) => `R$ ${(v.investment / v.customers).toFixed(2)}`}
            resultLabel="CPA"
          />

          <CalculatorCard
            title="Custo por Lead (CPL)"
            description="Indica quanto você gasta, em média, para gerar um novo lead."
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Investimento Total", placeholder: "Ex: 1500", id: "investment" },
              { label: "Leads Gerados", placeholder: "Ex: 100", id: "leads" },
            ]}
            calculate={(v) => `R$ ${(v.investment / v.leads).toFixed(2)}`}
            resultLabel="CPL"
          />

          <CalculatorCard
            title="Taxa de Rejeição"
            description="Mede a porcentagem de visitantes que saem do site após visualizar apenas uma página."
            icon={<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Visitas de Uma Página", placeholder: "Ex: 300", id: "bounces" },
              { label: "Total de Visitas", placeholder: "Ex: 1000", id: "visits" },
            ]}
            calculate={(v) => `${((v.bounces / v.visits) * 100).toFixed(2)}%`}
            resultLabel="Taxa de Rejeição"
          />

          <CalculatorCard
            title="Valor do Cliente (LTV)"
            description="Calcula o valor médio que um cliente gera durante todo seu relacionamento com a empresa."
            icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Ticket Médio", placeholder: "Ex: 100", id: "ticket" },
              { label: "Compras por Ano", placeholder: "Ex: 12", id: "purchases" },
              { label: "Anos de Relacionamento", placeholder: "Ex: 3", id: "years" },
            ]}
            calculate={(v) => `R$ ${(v.ticket * v.purchases * v.years).toFixed(2)}`}
            resultLabel="LTV"
          />

          <CalculatorCard
            title="Taxa de Engajamento"
            description="Mede o nível de interação dos usuários com seu conteúdo."
            icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Interações (likes, comentários, compartilhamentos)", placeholder: "Ex: 500", id: "interactions" },
              { label: "Alcance Total", placeholder: "Ex: 10000", id: "reach" },
            ]}
            calculate={(v) => `${((v.interactions / v.reach) * 100).toFixed(2)}%`}
            resultLabel="Taxa de Engajamento"
          />

          <CalculatorCard
            title="Tempo Médio na Página"
            description="Calcula o tempo médio que os visitantes permanecem em uma página."
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            inputs={[
              { label: "Tempo Total (minutos)", placeholder: "Ex: 500", id: "totalTime" },
              { label: "Total de Visitantes", placeholder: "Ex: 100", id: "visitors" },
            ]}
            calculate={(v) => `${(v.totalTime / v.visitors).toFixed(2)} min`}
            resultLabel="Tempo Médio"
          />
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 sm:p-6 border border-primary/20">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
              💡 Dica Profissional
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Use essas calculadoras para monitorar suas campanhas e apresentar relatórios profissionais aos seus clientes.
              Combine múltiplas métricas para obter insights mais profundos sobre a performance das campanhas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
