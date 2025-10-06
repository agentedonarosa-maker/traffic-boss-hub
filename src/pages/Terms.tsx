import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Termos e Políticas</h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              Privacidade
            </TabsTrigger>
            <TabsTrigger value="terms" className="gap-2">
              <FileText className="h-4 w-4" />
              Termos de Serviço
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Política de Privacidade</CardTitle>
                <CardDescription>
                  Como coletamos, usamos e protegemos suas informações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-2xl font-semibold mb-3">1. Informações que Coletamos</h2>
                      <p className="text-muted-foreground mb-2">
                        Coletamos informações que você nos fornece diretamente, incluindo:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Nome, e-mail e informações de contato</li>
                        <li>Informações da empresa e dados de campanhas</li>
                        <li>Dados de integração com plataformas de anúncios</li>
                        <li>Métricas e relatórios de desempenho</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">2. Como Usamos suas Informações</h2>
                      <p className="text-muted-foreground mb-2">
                        Utilizamos as informações coletadas para:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Fornecer e melhorar nossos serviços</li>
                        <li>Processar suas solicitações e transações</li>
                        <li>Enviar atualizações e comunicações importantes</li>
                        <li>Gerar relatórios e análises de desempenho</li>
                        <li>Garantir a segurança e prevenir fraudes</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">3. Compartilhamento de Dados</h2>
                      <p className="text-muted-foreground">
                        Não vendemos suas informações pessoais. Compartilhamos dados apenas quando necessário para:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Integrar com plataformas de anúncios (Meta, Google, TikTok)</li>
                        <li>Cumprir obrigações legais</li>
                        <li>Proteger nossos direitos e segurança</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">4. Segurança dos Dados</h2>
                      <p className="text-muted-foreground">
                        Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações,
                        incluindo criptografia, controles de acesso e monitoramento contínuo. Todos os dados são
                        armazenados em servidores seguros com backup regular.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">5. Seus Direitos</h2>
                      <p className="text-muted-foreground mb-2">
                        De acordo com a LGPD, você tem direito a:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Acessar seus dados pessoais</li>
                        <li>Corrigir dados incompletos ou desatualizados</li>
                        <li>Solicitar a exclusão de seus dados</li>
                        <li>Revogar consentimento a qualquer momento</li>
                        <li>Exportar seus dados em formato estruturado</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">6. Cookies e Tecnologias Similares</h2>
                      <p className="text-muted-foreground">
                        Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso
                        da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies
                        nas configurações do navegador.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">7. Retenção de Dados</h2>
                      <p className="text-muted-foreground">
                        Mantemos suas informações pelo tempo necessário para fornecer os serviços e cumprir
                        obrigações legais. Após esse período, os dados são anonimizados ou excluídos de forma segura.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">8. Contato</h2>
                      <p className="text-muted-foreground">
                        Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato
                        através do e-mail: <span className="font-medium">privacidade@seudominio.com</span>
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle>Termos de Serviço</CardTitle>
                <CardDescription>
                  Condições de uso da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-2xl font-semibold mb-3">1. Aceitação dos Termos</h2>
                      <p className="text-muted-foreground">
                        Ao acessar e usar esta plataforma, você aceita e concorda em cumprir estes Termos de Serviço.
                        Se não concordar com algum termo, não utilize nossos serviços.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">2. Descrição do Serviço</h2>
                      <p className="text-muted-foreground">
                        Nossa plataforma oferece ferramentas de gerenciamento de campanhas publicitárias, incluindo:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Dashboard de métricas e análises</li>
                        <li>Integração com plataformas de anúncios</li>
                        <li>Gestão de clientes e campanhas</li>
                        <li>Geração de relatórios automatizados</li>
                        <li>Portal do cliente personalizado</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">3. Conta de Usuário</h2>
                      <p className="text-muted-foreground mb-2">
                        Para usar nossos serviços, você deve:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Fornecer informações precisas e atualizadas</li>
                        <li>Manter a confidencialidade de sua senha</li>
                        <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                        <li>Ser responsável por todas as atividades em sua conta</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">4. Uso Aceitável</h2>
                      <p className="text-muted-foreground mb-2">
                        Você concorda em NÃO:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Usar o serviço para fins ilegais ou não autorizados</li>
                        <li>Tentar acessar áreas restritas do sistema</li>
                        <li>Interferir no funcionamento da plataforma</li>
                        <li>Copiar, modificar ou distribuir nosso conteúdo sem autorização</li>
                        <li>Usar o serviço para transmitir vírus ou código malicioso</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">5. Propriedade Intelectual</h2>
                      <p className="text-muted-foreground">
                        Todo o conteúdo, recursos e funcionalidades da plataforma são propriedade exclusiva e
                        protegidos por leis de direitos autorais, marcas registradas e outras leis de propriedade
                        intelectual. Você recebe uma licença limitada, não exclusiva e revogável para uso da plataforma.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">6. Pagamentos e Reembolsos</h2>
                      <p className="text-muted-foreground">
                        Os valores dos planos serão cobrados conforme especificado. Reembolsos serão concedidos
                        apenas em casos específicos descritos em nossa política de reembolso. O cancelamento da
                        assinatura pode ser feito a qualquer momento através das configurações da conta.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">7. Limitação de Responsabilidade</h2>
                      <p className="text-muted-foreground">
                        O serviço é fornecido "como está" e "conforme disponível". Não nos responsabilizamos por:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Interrupções ou erros no serviço</li>
                        <li>Perda de dados ou lucros</li>
                        <li>Danos indiretos ou consequenciais</li>
                        <li>Resultados de campanhas publicitárias</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">8. Modificações dos Termos</h2>
                      <p className="text-muted-foreground">
                        Reservamos o direito de modificar estes termos a qualquer momento. Notificaremos sobre
                        alterações significativas através da plataforma ou por e-mail. O uso continuado após as
                        alterações constitui aceitação dos novos termos.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">9. Rescisão</h2>
                      <p className="text-muted-foreground">
                        Podemos suspender ou encerrar sua conta se você violar estes termos. Você pode cancelar
                        sua conta a qualquer momento. Após o encerramento, seus dados serão tratados conforme
                        nossa Política de Privacidade.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">10. Lei Aplicável</h2>
                      <p className="text-muted-foreground">
                        Estes termos são regidos pelas leis brasileiras. Quaisquer disputas serão resolvidas
                        nos tribunais da comarca de [Sua Cidade/Estado].
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-semibold mb-3">11. Contato</h2>
                      <p className="text-muted-foreground">
                        Para questões sobre estes termos, entre em contato através do e-mail:
                        <span className="font-medium"> suporte@seudominio.com</span>
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Terms;
