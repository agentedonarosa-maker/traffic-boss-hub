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

export const exportBriefingToPDF = (briefing: any, clientName: string) => {
  const doc = new jsPDF();
  
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Briefing do Cliente', 105, 20, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Cliente: ${clientName}`, 14, 45);
  doc.text(`Empresa: ${briefing.company_name}`, 14, 55);
  
  autoTable(doc, {
    startY: 65,
    head: [['Campo', 'Informação']],
    body: [
      ['Segmento', briefing.business_segment],
      ['Objetivo Principal', briefing.main_objective],
      ['Orçamento Mensal', `R$ ${briefing.monthly_budget || 0}`],
      ['Canais', briefing.current_channels.join(', ')],
    ],
    theme: 'striped',
  });
  
  doc.save(`briefing-${clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportContractToPDF = (
  contractContent: string,
  clientName: string,
  managerName: string
) => {
  const doc = new jsPDF();
  
  const primaryColor: [number, number, number] = [16, 185, 129];
  const headerTextColor: [number, number, number] = [255, 255, 255];
  const darkText: [number, number, number] = [0, 0, 0];
  const grayText: [number, number, number] = [128, 128, 128];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(...headerTextColor);
  doc.setFontSize(18);
  doc.text('Contrato de Prestação de Serviços', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Cliente: ${clientName}`, 105, 25, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Gestor: ${managerName}`, 105, 32, { align: 'center' });

  // Contract content
  doc.setTextColor(...darkText);
  doc.setFontSize(10);
  
  const lines = doc.splitTextToSize(contractContent, 180);
  let yPosition = 50;
  const lineHeight = 5;
  const pageHeight = 280;

  lines.forEach((line: string) => {
    if (yPosition + lineHeight > pageHeight) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 14, yPosition);
    yPosition += lineHeight;
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text(
      `Página ${i} de ${pageCount} - Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      105,
      287,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `contrato-${clientName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};

export const exportStrategicPlanToPDF = (plan: any, clientName: string) => {
  const doc = new jsPDF();
  
  const primaryColor: [number, number, number] = [16, 185, 129];
  const headerTextColor: [number, number, number] = [255, 255, 255];
  const darkText: [number, number, number] = [0, 0, 0];
  const grayText: [number, number, number] = [128, 128, 128];

  const addSectionTitle = (title: string, yPos: number): number => {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...darkText);
    doc.text(title, 14, yPos);
    return yPos + 8;
  };

  const checkPageBreak = (yPos: number, requiredSpace: number = 40): number => {
    if (yPos + requiredSpace > 270) {
      doc.addPage();
      return 20;
    }
    return yPos;
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      draft: 'Rascunho',
      complete: 'Completo',
      review: 'Em Revisão',
    };
    return statusMap[status] || status || 'Rascunho';
  };

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(...headerTextColor);
  doc.setFontSize(22);
  doc.text('Planejamento Estratégico', 105, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(clientName, 105, 28, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Status: ${getStatusLabel(plan.status)}`, 105, 36, { align: 'center' });

  let yPosition = 55;

  // 1. SWOT Analysis
  yPosition = addSectionTitle('1. Análise SWOT', yPosition);

  const swotData = [
    ['Forças', (plan.strengths || []).join('\n• ') ? '• ' + (plan.strengths || []).join('\n• ') : 'Não definido'],
    ['Fraquezas', (plan.weaknesses || []).join('\n• ') ? '• ' + (plan.weaknesses || []).join('\n• ') : 'Não definido'],
    ['Oportunidades', (plan.opportunities || []).join('\n• ') ? '• ' + (plan.opportunities || []).join('\n• ') : 'Não definido'],
    ['Ameaças', (plan.threats || []).join('\n• ') ? '• ' + (plan.threats || []).join('\n• ') : 'Não definido'],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Categoria', 'Itens']],
    body: swotData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: headerTextColor, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 35, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 2. Personas
  const personas = plan.personas || [];
  if (personas.length > 0) {
    yPosition = checkPageBreak(yPosition, 60);
    yPosition = addSectionTitle('2. Personas', yPosition);

    personas.forEach((persona: any, index: number) => {
      yPosition = checkPageBreak(yPosition, 50);
      
      const personaData = [
        ['Nome', persona.name || 'Não definido'],
        ['Idade', persona.age || 'Não definido'],
        ['Ocupação', persona.occupation || 'Não definido'],
        ['Objetivos', persona.goals || 'Não definido'],
        ['Desafios', persona.challenges || 'Não definido'],
        ['Comportamento', persona.behavior || 'Não definido'],
        ['Canais Preferidos', persona.channels || 'Não definido'],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [[`Persona ${index + 1}`, 'Detalhes']],
        body: personaData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: headerTextColor, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: { 0: { cellWidth: 35, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
        margin: { left: 14, right: 14 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // 3. Funnel Strategy
  const funnel = plan.funnel_stages || {};
  if (funnel.awareness || funnel.consideration || funnel.decision) {
    yPosition = checkPageBreak(yPosition, 60);
    yPosition = addSectionTitle('3. Estratégia de Funil', yPosition);

    const funnelData = [
      [
        'Objetivo',
        funnel.awareness?.objective || '-',
        funnel.consideration?.objective || '-',
        funnel.decision?.objective || '-',
      ],
      [
        'Conteúdo',
        funnel.awareness?.content_types || '-',
        funnel.consideration?.content_types || '-',
        funnel.decision?.content_types || '-',
      ],
      [
        'Canais',
        funnel.awareness?.channels || '-',
        funnel.consideration?.channels || '-',
        funnel.decision?.channels || '-',
      ],
      [
        'Métricas',
        funnel.awareness?.metrics || '-',
        funnel.consideration?.metrics || '-',
        funnel.decision?.metrics || '-',
      ],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['', 'Awareness', 'Consideration', 'Decision']],
      body: funnelData,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: headerTextColor, fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 25, fontStyle: 'bold' } },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // 4. Channel Strategy
  const channels = plan.channel_strategy || [];
  if (channels.length > 0) {
    yPosition = checkPageBreak(yPosition, 50);
    yPosition = addSectionTitle('4. Estratégia por Canal', yPosition);

    const channelData = channels.map((channel: any) => [
      channel.channel || '-',
      channel.objective || '-',
      channel.budget ? `R$ ${channel.budget}` : '-',
      channel.campaign_types || '-',
      channel.kpis || '-',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Canal', 'Objetivo', 'Orçamento', 'Campanhas', 'KPIs']],
      body: channelData.length > 0 ? channelData : [['Nenhum canal definido', '', '', '', '']],
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: headerTextColor, fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // 5. KPIs
  const kpis = plan.kpis || [];
  if (kpis.length > 0) {
    yPosition = checkPageBreak(yPosition, 50);
    yPosition = addSectionTitle('5. KPIs e Metas', yPosition);

    const priorityLabels: Record<string, string> = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
    };

    const kpiData = kpis.map((kpi: any) => [
      kpi.name || '-',
      kpi.target || '-',
      kpi.current || '-',
      priorityLabels[kpi.priority] || kpi.priority || '-',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['KPI', 'Meta', 'Atual', 'Prioridade']],
      body: kpiData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: headerTextColor, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // 6. Timeline
  const timeline = plan.timeline || [];
  if (timeline.length > 0) {
    yPosition = checkPageBreak(yPosition, 50);
    yPosition = addSectionTitle('6. Cronograma de Implementação', yPosition);

    const timelineData = timeline.map((item: any) => [
      item.month || '-',
      item.activities || '-',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Mês', 'Atividades']],
      body: timelineData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: headerTextColor, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 'auto' } },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text(
      `Página ${i} de ${pageCount} - Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      105,
      287,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `planejamento-${clientName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
