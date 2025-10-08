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
    <Card className="border-border/50 shadow-card">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg md:text-xl">Gerar Relatório</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Selecione o cliente e o período para gerar o relatório</CardDescription>
          </div>
          <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
        <div className="space-y-2">
          <Label htmlFor="client" className="text-xs sm:text-sm">Cliente</Label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger id="client" className="h-9 text-sm">
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
          <Label htmlFor="reportType" className="text-xs sm:text-sm">Tipo de Relatório</Label>
          <Select value={reportType} onValueChange={handleReportTypeChange}>
            <SelectTrigger id="reportType" className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="custom">Período Customizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-xs sm:text-sm">Data Início</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-xs sm:text-sm">Data Fim</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={!selectedClient || !startDate || !endDate || loading}
          className="w-full h-10 text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </Button>
      </CardContent>
    </Card>
  );
}
