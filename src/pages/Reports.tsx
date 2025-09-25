import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere relatórios detalhados das suas campanhas e performance
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Relatório Mensal</CardTitle>
                <CardDescription>Performance completa do mês</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Relatório completo com todas as métricas e análises do período
            </p>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Análise ROAS</CardTitle>
                <CardDescription>Retorno sobre investimento</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Análise detalhada do retorno sobre investimento por campanha
            </p>
            <Button variant="outline" className="w-full">
              Ver Análise
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Relatório Semanal</CardTitle>
                <CardDescription>Resumo da semana</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Resumo semanal de performance e principais insights
            </p>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Funcionalidade em Desenvolvimento</CardTitle>
          <CardDescription>
            O sistema de relatórios completo estará disponível em breve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Relatórios Avançados</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Em breve você poderá gerar relatórios personalizados, 
              comparar períodos e exportar dados em diversos formatos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}