import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportData {
  client: {
    name: string;
    company: string | null;
  };
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalInvestment: number;
    totalRevenue: number;
    totalImpressions: number;
    totalClicks: number;
    totalLeads: number;
    totalSales: number;
    avgRoas: number;
    avgCtr: number;
    avgCpl: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    platform: string;
    investment: number;
    revenue: number;
    leads: number;
    sales: number;
    roas: number;
    ctr: number;
    cpl: number;
  }>;
}

export const generateReportPDF = (data: ReportData) => {
  const doc = new jsPDF();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Header
  doc.setFillColor(16, 185, 129); // Primary color
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Relatório de Campanhas', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  const clientName = data.client.company 
    ? `${data.client.name} (${data.client.company})`
    : data.client.name;
  doc.text(clientName, 105, 25, { align: 'center' });

  // Period
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const periodText = `Período: ${format(new Date(data.period.start), "dd 'de' MMMM", { locale: ptBR })} até ${format(new Date(data.period.end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
  doc.text(periodText, 105, 42, { align: 'center' });

  // Summary Section
  let yPosition = 55;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Resumo do Período', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  const summaryData = [
    ['Investimento Total', formatCurrency(data.summary.totalInvestment)],
    ['Receita Total', formatCurrency(data.summary.totalRevenue)],
    ['ROAS Médio', `${data.summary.avgRoas.toFixed(2)}x`],
    ['Total de Leads', formatNumber(data.summary.totalLeads)],
    ['Total de Vendas', formatNumber(data.summary.totalSales)],
    ['Total de Impressões', formatNumber(data.summary.totalImpressions)],
    ['Total de Cliques', formatNumber(data.summary.totalClicks)],
    ['CTR Médio', formatPercentage(data.summary.avgCtr)],
    ['CPL Médio', formatCurrency(data.summary.avgCpl)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Métrica', 'Valor']],
    body: summaryData,
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
    margin: { left: 14, right: 14 },
  });

  // Campaigns Section
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Performance por Campanha', 14, yPosition);
  yPosition += 7;

  const campaignData = data.campaigns.map(campaign => [
    campaign.name,
    campaign.platform,
    formatCurrency(campaign.investment),
    formatCurrency(campaign.revenue),
    `${campaign.roas.toFixed(2)}x`,
    formatNumber(campaign.leads),
    formatNumber(campaign.sales),
    formatPercentage(campaign.ctr),
    formatCurrency(campaign.cpl),
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Campanha', 'Plataforma', 'Invest.', 'Receita', 'ROAS', 'Leads', 'Vendas', 'CTR', 'CPL']],
    body: campaignData.length > 0 ? campaignData : [['Nenhuma campanha encontrada no período', '', '', '', '', '', '', '', '']],
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 18 },
      2: { cellWidth: 18 },
      3: { cellWidth: 18 },
      4: { cellWidth: 14 },
      5: { cellWidth: 14 },
      6: { cellWidth: 14 },
      7: { cellWidth: 14 },
      8: { cellWidth: 18 },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount} - Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      105,
      287,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `relatorio-${data.client.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
