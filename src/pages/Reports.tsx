import React, { useEffect, useState } from 'react';
import ReportGenerator from '@/components/reports/ReportGenerator';
import ReportView from '@/components/reports/ReportView';
import { useGenerateReport } from '@/hooks/useGenerateReport';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { generateReportPDF } from '@/lib/pdfExport';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Reports() {
  const { generateReport, reportData, loading, clearReport } = useGenerateReport();
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Reports] State changed:', {
      hasReportData: !!reportData,
      loading,
      campaignsCount: reportData?.campaigns?.length || 0,
    });
  }, [reportData, loading]);

  const handleExport = () => {
    if (!reportData) return;
    
    try {
      console.log('[Reports] Exporting PDF...');
      generateReportPDF(reportData);
      toast({
        title: "PDF exportado com sucesso",
        description: "O relatório foi baixado no seu dispositivo",
      });
    } catch (error) {
      console.error('[Reports] PDF export error:', error);
      toast({
        title: "Erro ao exportar PDF",
        description: "Ocorreu um erro ao gerar o arquivo PDF",
        variant: "destructive",
      });
    }
  };

  const handleClearReport = () => {
    console.log('[Reports] Clearing report');
    setRenderError(null);
    clearReport();
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Gere relatórios detalhados das suas campanhas por cliente
          </p>
        </div>
        {reportData && (
          <Button onClick={handleClearReport} variant="outline" className="w-full sm:w-auto text-sm">
            Nova Consulta
          </Button>
        )}
      </div>

      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              Gerando relatório... Isso pode levar alguns segundos.
            </p>
          </CardContent>
        </Card>
      )}

      {renderError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao renderizar relatório: {renderError}
          </AlertDescription>
        </Alert>
      )}

      {!loading && !reportData && !renderError && (
        <ReportGenerator onGenerate={generateReport} loading={loading} />
      )}

      {!loading && reportData && (
        <div>
          <ReportView data={reportData} onExport={handleExport} />
        </div>
      )}
    </div>
  );
}