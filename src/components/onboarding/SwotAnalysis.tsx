import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface SwotAnalysisProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  onChange: (field: "strengths" | "weaknesses" | "opportunities" | "threats", value: string[]) => void;
}

export const SwotAnalysis = ({ strengths, weaknesses, opportunities, threats, onChange }: SwotAnalysisProps) => {
  const [newItem, setNewItem] = useState({ strengths: "", weaknesses: "", opportunities: "", threats: "" });

  const addItem = (field: keyof typeof newItem) => {
    if (!newItem[field].trim()) return;
    const current = field === "strengths" ? strengths : field === "weaknesses" ? weaknesses : field === "opportunities" ? opportunities : threats;
    onChange(field, [...current, newItem[field]]);
    setNewItem({ ...newItem, [field]: "" });
  };

  const removeItem = (field: "strengths" | "weaknesses" | "opportunities" | "threats", index: number) => {
    const current = field === "strengths" ? strengths : field === "weaknesses" ? weaknesses : field === "opportunities" ? opportunities : threats;
    onChange(field, current.filter((_, i) => i !== index));
  };

  const renderQuadrant = (title: string, items: string[], field: "strengths" | "weaknesses" | "opportunities" | "threats", color: string) => (
    <Card className={color}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-2 p-2 bg-background rounded">
            <span className="text-sm flex-1">{item}</span>
            <Button size="sm" variant="ghost" onClick={() => removeItem(field, index)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar item..."
            value={newItem[field]}
            onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addItem(field)}
          />
          <Button size="sm" onClick={() => addItem(field)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {renderQuadrant("Forças (Strengths)", strengths, "strengths", "border-green-200 dark:border-green-800")}
      {renderQuadrant("Fraquezas (Weaknesses)", weaknesses, "weaknesses", "border-red-200 dark:border-red-800")}
      {renderQuadrant("Oportunidades (Opportunities)", opportunities, "opportunities", "border-blue-200 dark:border-blue-800")}
      {renderQuadrant("Ameaças (Threats)", threats, "threats", "border-yellow-200 dark:border-yellow-800")}
    </div>
  );
};
