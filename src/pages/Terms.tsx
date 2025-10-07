import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
                <CardTitle>Política de Privacidade - LGPD</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6 text-sm">
                    <section>
                      <h3 className="font-semibold text-base mb-2">1. Informações Gerais</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Esta Política de Privacidade descreve como o TrafficPro ("nós", "nosso" ou "plataforma") coleta, usa, armazena e protege os dados pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">2. Responsável pelo Tratamento de Dados</h3>
                      <p className="text-muted-foreground leading-relaxed mb-2">
                        <strong>Controlador:</strong> TrafficPro
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        <strong>Encarregado de Dados (DPO):</strong> Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, entre em contato através do email indicado na seção de contato.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">3. Dados Coletados</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Coletamos os seguintes tipos de dados pessoais:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Dados de Cadastro:</strong> Nome, e-mail, telefone, senha criptografada</li>
                        <li><strong>Dados de Uso:</strong> Informações sobre campanhas, métricas de tráfego, histórico de atividades na plataforma</li>
                        <li><strong>Dados de Integração:</strong> Credenciais de acesso a plataformas de anúncios (Google Ads, Meta Ads, TikTok Ads) armazenadas de forma segura</li>
                        <li><strong>Dados de Clientes:</strong> Informações de clientes gerenciados pelos usuários (nome, e-mail, empresa)</li>
                        <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional, cookies</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">4. Finalidade do Tratamento</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Os dados pessoais são tratados para as seguintes finalidades:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Permitir o acesso e uso da plataforma</li>
                        <li>Gerenciar campanhas de tráfego pago e integrar com plataformas de anúncios</li>
                        <li>Gerar relatórios e análises de desempenho</li>
                        <li>Enviar notificações importantes sobre o serviço</li>
                        <li>Melhorar a experiência do usuário e desenvolver novos recursos</li>
                        <li>Cumprir obrigações legais e regulatórias</li>
                        <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">5. Base Legal</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        O tratamento dos dados pessoais está fundamentado nas seguintes bases legais:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Consentimento:</strong> Para coleta e uso de dados fornecidos voluntariamente</li>
                        <li><strong>Execução de Contrato:</strong> Para prestação dos serviços contratados</li>
                        <li><strong>Legítimo Interesse:</strong> Para melhorias da plataforma e segurança</li>
                        <li><strong>Obrigação Legal:</strong> Para cumprimento de obrigações legais e regulatórias</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">6. Compartilhamento de Dados</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Podemos compartilhar dados pessoais nas seguintes situações:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Plataformas de Anúncios:</strong> Google Ads, Meta Ads, TikTok Ads (para sincronização de campanhas)</li>
                        <li><strong>Provedores de Serviços:</strong> Hospedagem (Supabase), processamento de dados</li>
                        <li><strong>Autoridades Legais:</strong> Quando exigido por lei ou ordem judicial</li>
                      </ul>
                      <p className="text-muted-foreground leading-relaxed mt-3">
                        Não vendemos, alugamos ou comercializamos dados pessoais de terceiros.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">7. Segurança dos Dados</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Implementamos medidas técnicas e organizacionais para proteger os dados pessoais:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Criptografia de senhas e dados sensíveis</li>
                        <li>Armazenamento seguro de credenciais (Supabase Vault)</li>
                        <li>Controle de acesso baseado em funções (RLS - Row Level Security)</li>
                        <li>Monitoramento de atividades suspeitas</li>
                        <li>Backups regulares e recuperação de desastres</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">8. Retenção de Dados</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Os dados pessoais serão mantidos pelo período necessário para cumprir as finalidades descritas nesta política, ou conforme exigido por lei. Após o término do relacionamento, os dados podem ser mantidos por período adicional para cumprimento de obrigações legais ou exercício de direitos.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">9. Direitos do Titular</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        De acordo com a LGPD, você possui os seguintes direitos:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Confirmação da existência de tratamento</li>
                        <li>Acesso aos dados</li>
                        <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                        <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                        <li>Portabilidade dos dados a outro fornecedor</li>
                        <li>Eliminação dos dados tratados com consentimento</li>
                        <li>Informação sobre compartilhamento de dados</li>
                        <li>Revogação do consentimento</li>
                      </ul>
                      <p className="text-muted-foreground leading-relaxed mt-3">
                        Para exercer seus direitos, entre em contato através dos canais indicados na seção de contato.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">10. Cookies e Tecnologias Similares</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Utilizamos cookies e tecnologias similares para melhorar a experiência do usuário, analisar o uso da plataforma e manter a sessão ativa. Você pode gerenciar suas preferências de cookies através das configurações do navegador.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">11. Transferência Internacional de Dados</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Os dados podem ser armazenados em servidores localizados fora do Brasil. Nestes casos, garantimos que as transferências sejam realizadas em conformidade com a LGPD e que medidas adequadas de proteção sejam implementadas.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">12. Alterações nesta Política</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos os usuários sobre alterações significativas através da plataforma ou por e-mail. A data da última atualização está indicada no início deste documento.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">13. Contato</h3>
                      <p className="text-muted-foreground leading-relaxed mb-2">
                        Para dúvidas, solicitações ou exercício de direitos relacionados aos seus dados pessoais:
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        <strong>E-mail:</strong> Entre em contato através do suporte da plataforma<br />
                        <strong>Tempo de resposta:</strong> Até 15 dias úteis
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">14. Autoridade Nacional</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Em caso de dúvidas não respondidas ou violações aos seus direitos, você pode contatar a Autoridade Nacional de Proteção de Dados (ANPD) através do site: <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.gov.br/anpd</a>
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
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6 text-sm">
                    <section>
                      <h3 className="font-semibold text-base mb-2">1. Aceitação dos Termos</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Ao acessar e usar o TrafficPro, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deverá usar nossa plataforma.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">2. Descrição do Serviço</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        O TrafficPro é uma plataforma de gestão de tráfego pago que oferece:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Gerenciamento de campanhas publicitárias</li>
                        <li>Integração com Google Ads, Meta Ads e TikTok Ads</li>
                        <li>Monitoramento de métricas e geração de relatórios</li>
                        <li>Gestão de clientes e contratos</li>
                        <li>Calendário de reuniões e tarefas</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">3. Cadastro e Conta de Usuário</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Para usar a plataforma, você deve:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Fornecer informações verdadeiras, precisas e completas</li>
                        <li>Manter suas credenciais de acesso em sigilo</li>
                        <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
                        <li>Ser responsável por todas as atividades realizadas em sua conta</li>
                        <li>Ter pelo menos 18 anos de idade</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">4. Uso Aceitável</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Você concorda em NÃO:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Usar a plataforma para fins ilegais ou não autorizados</li>
                        <li>Tentar obter acesso não autorizado a sistemas ou dados</li>
                        <li>Interferir ou interromper o funcionamento da plataforma</li>
                        <li>Copiar, modificar ou distribuir conteúdo da plataforma sem autorização</li>
                        <li>Fazer engenharia reversa ou tentar extrair código-fonte</li>
                        <li>Utilizar a plataforma para enviar spam ou conteúdo malicioso</li>
                        <li>Violar direitos de propriedade intelectual</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">5. Propriedade Intelectual</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Todo o conteúdo, funcionalidades e elementos da plataforma (código, design, logos, textos) são de propriedade exclusiva do TrafficPro e protegidos por leis de direitos autorais e propriedade intelectual.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Os dados e informações inseridos pelos usuários permanecem de propriedade dos respectivos usuários.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">6. Integrações com Plataformas de Terceiros</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Ao conectar contas de plataformas de anúncios (Google, Meta, TikTok):
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Você é responsável por manter as credenciais válidas</li>
                        <li>As credenciais são armazenadas de forma segura e criptografada</li>
                        <li>Você autoriza o TrafficPro a acessar e gerenciar suas campanhas</li>
                        <li>Você deve cumprir os termos de serviço de cada plataforma</li>
                        <li>O TrafficPro não se responsabiliza por mudanças nas APIs de terceiros</li>
                      </ul>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">7. Disponibilidade e Suporte</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Nos esforçamos para manter a plataforma disponível 24/7, mas não garantimos disponibilidade ininterrupta. Podemos realizar manutenções programadas mediante aviso prévio. O suporte é fornecido através dos canais indicados na plataforma.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">8. Limitação de Responsabilidade</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        O TrafficPro não se responsabiliza por:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Perdas financeiras decorrentes de campanhas publicitárias</li>
                        <li>Resultados específicos de performance de anúncios</li>
                        <li>Interrupções causadas por terceiros (provedores, plataformas de anúncios)</li>
                        <li>Uso indevido da plataforma por parte dos usuários</li>
                        <li>Decisões empresariais tomadas com base em dados da plataforma</li>
                      </ul>
                      <p className="text-muted-foreground leading-relaxed mt-3">
                        A plataforma é fornecida "como está" sem garantias de qualquer tipo.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">9. Pagamentos e Reembolsos</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Os termos de pagamento, planos e política de reembolso serão definidos conforme o modelo de negócio escolhido. Valores pagos a plataformas de anúncios são de responsabilidade exclusiva do usuário.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">10. Encerramento de Conta</h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Reservamo-nos o direito de suspender ou encerrar contas que:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Violem estes Termos de Serviço</li>
                        <li>Realizem atividades fraudulentas ou ilegais</li>
                        <li>Permaneçam inativas por período prolongado</li>
                      </ul>
                      <p className="text-muted-foreground leading-relaxed mt-3">
                        Você pode solicitar o encerramento de sua conta a qualquer momento através do suporte.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">11. Modificações dos Termos</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Podemos modificar estes termos a qualquer momento. Alterações significativas serão comunicadas através da plataforma ou por e-mail. O uso continuado após as alterações constitui aceitação dos novos termos.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">12. Lei Aplicável e Jurisdição</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Estes termos são regidos pelas leis brasileiras. Quaisquer disputas serão resolvidas preferencialmente de forma amigável ou, se necessário, nos tribunais competentes do Brasil.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <h3 className="font-semibold text-base mb-2">13. Contato</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Para dúvidas sobre estes Termos de Serviço, entre em contato através do suporte da plataforma ou pelos canais indicados na Política de Privacidade.
                      </p>
                    </section>

                    <Separator />

                    <section>
                      <p className="text-muted-foreground leading-relaxed text-center pt-4">
                        <strong>Ao usar o TrafficPro, você declara ter lido, compreendido e concordado com estes Termos de Serviço e com nossa Política de Privacidade.</strong>
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
