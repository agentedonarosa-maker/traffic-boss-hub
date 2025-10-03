import React from 'react';
import ReportGenerator from '@/components/reports/ReportGenerator';
import ReportView from '@/components/reports/ReportView';
import { useGenerateReport } from '@/hooks/useGenerateReport';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { generateReportPDF } from '@/lib/pdfExport';

export default function Reports() {
  const { generateReport, reportData, loading, clearReport } = useGenerateReport();

  const handleExport = () => {
    if (!reportData) return;
    
    try {
      generateReportPDF(reportData);
      toast({
        title: "PDF exportado com sucesso",
        description: "O relatório foi baixado no seu dispositivo",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar PDF",
        description: "Ocorreu um erro ao gerar o arquivo PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere relatórios detalhados das suas campanhas por cliente
          </p>
        </div>
        {reportData && (
          <Button onClick={clearReport} variant="outline">
            Nova Consulta
          </Button>
        )}
      </div>

      {!reportData ? (
        <ReportGenerator onGenerate={generateReport} loading={loading} />
      ) : (
        <ReportView data={reportData} onExport={handleExport} />
      )}
    </div>
  );
}