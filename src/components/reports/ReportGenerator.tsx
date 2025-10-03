import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Download } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, subWeeks } from 'date-fns';

interface ReportGeneratorProps {
  onGenerate: (params: ReportParams) => void;
  loading?: boolean;
}

export interface ReportParams {
  clientId: string;
  startDate: string;
  endDate: string;
  reportType: 'monthly' | 'weekly' | 'custom';
}

export default function ReportGenerator({ onGenerate, loading }: ReportGeneratorProps) {
  const { data: clients = [] } = useClients();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleReportTypeChange = (type: 'monthly' | 'weekly' | 'custom') => {
    setReportType(type);
    
    const today = new Date();
    let start: Date;
    let end: Date;

    if (type === 'monthly') {
      start = startOfMonth(subMonths(today, 1));
      end = endOfMonth(subMonths(today, 1));
    } else if (type === 'weekly') {
      start = startOfWeek(subWeeks(today, 1));
      end = endOfWeek(subWeeks(today, 1));
    } else {
      start = subMonths(today, 1);
      end = today;
    }

    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
  };

  const handleGenerate = () => {
    if (!selectedClient || !startDate || !endDate) return;

    onGenerate({
      clientId: selectedClient,
      startDate,
      endDate,
      reportType,
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gerar Relatório</CardTitle>
            <CardDescription>Selecione o cliente e o período para gerar o relatório</CardDescription>
          </div>
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger id="client">
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} {client.company && `- ${client.company}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reportType">Tipo de Relatório</Label>
          <Select value={reportType} onValueChange={handleReportTypeChange}>
            <SelectTrigger id="reportType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="custom">Período Customizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Início</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data Fim</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={!selectedClient || !startDate || !endDate || loading}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </Button>
      </CardContent>
    </Card>
  );
}
