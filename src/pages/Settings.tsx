import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Settings as SettingsIcon, Plug, CheckCircle2, Trash2, Download, Loader2, Calendar, Webhook, Plus, Eye, TestTube, Edit } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useCreateIntegration } from "@/hooks/useCreateIntegration";
import { useDeleteIntegration } from "@/hooks/useDeleteIntegration";
import { useImportMetaCampaigns } from "@/hooks/useImportMetaCampaigns";
import { useClients } from "@/hooks/useClients";
import { useWebhooks } from "@/hooks/useWebhooks";
import { useCreateWebhook } from "@/hooks/useCreateWebhook";
import { useDeleteWebhook } from "@/hooks/useUpdateWebhook";
import { useWebhookLogs } from "@/hooks/useWebhookLogs";
import { useTestWebhook } from "@/hooks/useTestWebhook";
import WebhookForm from "@/components/settings/WebhookForm";
import type { WebhookFormData } from "@/lib/validations/webhook";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { data: clients = [] } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { data: integrations = [], isLoading: integrationsLoading } = useIntegrations(selectedClientId);
  const createIntegration = useCreateIntegration();
  const deleteIntegration = useDeleteIntegration();
  const importMetaCampaigns = useImportMetaCampaigns();

  const [integrationToDelete, setIntegrationToDelete] = useState<string | null>(null);

  // Webhooks
  const { data: webhooks = [] } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const testWebhook = useTestWebhook();
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [selectedWebhookForLogs, setSelectedWebhookForLogs] = useState<string | null>(null);
  const { data: webhookLogs = [] } = useWebhookLogs(selectedWebhookForLogs);

  // Meta Ads Form
  const [metaAccessToken, setMetaAccessToken] = useState("");
  const [metaAccountId, setMetaAccountId] = useState("");

  // Google Ads Form
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");
  const [googleRefreshToken, setGoogleRefreshToken] = useState("");
  const [googleCustomerId, setGoogleCustomerId] = useState("");
  const [googleDeveloperToken, setGoogleDeveloperToken] = useState("");

  // TikTok Ads Form
  const [tiktokAccessToken, setTiktokAccessToken] = useState("");
  const [tiktokAdvertiserId, setTiktokAdvertiserId] = useState("");

  const getIntegration = (platform: string) => {
    return integrations.find(i => i.platform === platform);
  };

  const handleMetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    
    createIntegration.mutate({
      client_id: selectedClientId,
      platform: 'meta',
      credentials: {
        access_token: metaAccessToken,
        ad_account_id: metaAccountId,
      },
    }, {
      onSuccess: () => {
        setMetaAccessToken("");
        setMetaAccountId("");
      }
    });
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    
    createIntegration.mutate({
      client_id: selectedClientId,
      platform: 'google',
      credentials: {
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: googleRefreshToken,
        customer_id: googleCustomerId,
        developer_token: googleDeveloperToken,
      },
    }, {
      onSuccess: () => {
        setGoogleClientId("");
        setGoogleClientSecret("");
        setGoogleRefreshToken("");
        setGoogleCustomerId("");
        setGoogleDeveloperToken("");
      }
    });
  };

  const handleTikTokSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    
    createIntegration.mutate({
      client_id: selectedClientId,
      platform: 'tiktok',
      credentials: {
        access_token: tiktokAccessToken,
        advertiser_id: tiktokAdvertiserId,
      },
    }, {
      onSuccess: () => {
        setTiktokAccessToken("");
        setTiktokAdvertiserId("");
      }
    });
  };

  const handleDelete = () => {
    if (integrationToDelete) {
      deleteIntegration.mutate(integrationToDelete);
      setIntegrationToDelete(null);
    }
  };

  const handleWebhookSubmit = (data: WebhookFormData) => {
    const webhookData = {
      name: data.name,
      url: data.url,
      secret: data.secret,
      events: data.events,
      retry_count: data.retry_count,
      timeout_ms: data.timeout_ms,
    };
    
    createWebhook.mutate(webhookData, {
      onSuccess: () => setShowWebhookForm(false),
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie suas integrações com plataformas de anúncios por cliente</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecione o Cliente</CardTitle>
          <CardDescription>
            Escolha o cliente para gerenciar suas integrações de anúncios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue={selectedClientId ? "meta" : "webhooks"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          {selectedClientId && (
            <>
              <TabsTrigger value="meta" className="gap-1 flex-col sm:flex-row py-2 sm:py-1.5 text-[10px] sm:text-xs md:text-sm">
                <Plug className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Meta Ads</span>
                <span className="sm:hidden text-[9px]">Meta</span>
                {getIntegration('meta') && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success" />}
              </TabsTrigger>
              <TabsTrigger value="google" className="gap-1 flex-col sm:flex-row py-2 sm:py-1.5 text-[10px] sm:text-xs md:text-sm">
                <Plug className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Google Ads</span>
                <span className="sm:hidden text-[9px]">Google</span>
                {getIntegration('google') && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success" />}
              </TabsTrigger>
              <TabsTrigger value="tiktok" className="gap-1 flex-col sm:flex-row py-2 sm:py-1.5 text-[10px] sm:text-xs md:text-sm">
                <Plug className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">TikTok Ads</span>
                <span className="sm:hidden text-[9px]">TikTok</span>
                {getIntegration('tiktok') && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success" />}
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="webhooks" className="gap-1 flex-col sm:flex-row py-2 sm:py-1.5 text-[10px] sm:text-xs md:text-sm">
            <Webhook className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Webhooks</span>
            <span className="sm:hidden text-[9px]">Hooks</span>
            {webhooks.length > 0 && <Badge variant="secondary" className="ml-1 text-[9px] sm:text-xs">{webhooks.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {selectedClientId && (
          <>

        {/* Meta Ads Tab */}
        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meta Ads (Facebook & Instagram)</CardTitle>
                  <CardDescription>
                    Conecte sua conta do Meta Business Manager para sincronizar campanhas
                  </CardDescription>
                </div>
                {getIntegration('meta') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {integrationsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : getIntegration('meta') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sua conta está conectada e sincronizando dados automaticamente.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => importMetaCampaigns.mutate(selectedClientId)}
                      disabled={importMetaCampaigns.isPending}
                      variant="default"
                      className="w-full sm:w-auto text-sm"
                    >
                      {importMetaCampaigns.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">Importando...</span>
                          <span className="sm:hidden">Importando...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Importar Campanhas</span>
                          <span className="sm:hidden">Importar</span>
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      onClick={() => setIntegrationToDelete(getIntegration('meta')!.id)}
                      className="w-full sm:w-auto text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Desconectar
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleMetaSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-token">Access Token</Label>
                    <Input
                      id="meta-token"
                      type="password"
                      placeholder="EAAxxxxxxxx"
                      value={metaAccessToken}
                      onChange={(e) => setMetaAccessToken(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Obtenha seu token em: Meta Business Manager → Configurações → Integrações
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-account">Account ID</Label>
                    <Input
                      id="meta-account"
                      placeholder="act_1234567890"
                      value={metaAccountId}
                      onChange={(e) => setMetaAccountId(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={createIntegration.isPending}>
                    {createIntegration.isPending ? "Conectando..." : "Conectar Meta Ads"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Ads Tab */}
        <TabsContent value="google">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Google Ads</CardTitle>
                  <CardDescription>
                    Conecte sua conta do Google Ads para sincronizar campanhas
                  </CardDescription>
                </div>
                {getIntegration('google') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {integrationsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : getIntegration('google') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sua conta está conectada e sincronizando dados automaticamente.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIntegrationToDelete(getIntegration('google')!.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleGoogleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="google-client-id">Client ID</Label>
                      <Input
                        id="google-client-id"
                        placeholder="xxxxx.apps.googleusercontent.com"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google-client-secret">Client Secret</Label>
                      <Input
                        id="google-client-secret"
                        type="password"
                        placeholder="GOCSPX-xxxxx"
                        value={googleClientSecret}
                        onChange={(e) => setGoogleClientSecret(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="google-refresh-token">Refresh Token</Label>
                    <Input
                      id="google-refresh-token"
                      type="password"
                      placeholder="1//xxxxx"
                      value={googleRefreshToken}
                      onChange={(e) => setGoogleRefreshToken(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="google-customer-id">Customer ID</Label>
                      <Input
                        id="google-customer-id"
                        placeholder="1234567890"
                        value={googleCustomerId}
                        onChange={(e) => setGoogleCustomerId(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Sem hífens (ex: 1234567890)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="google-developer-token">Developer Token</Label>
                      <Input
                        id="google-developer-token"
                        type="password"
                        placeholder="xxxxx"
                        value={googleDeveloperToken}
                        onChange={(e) => setGoogleDeveloperToken(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Configure OAuth 2.0 no Google Cloud Console e obtenha o Developer Token no Google Ads API Center
                  </p>
                  <Button type="submit" disabled={createIntegration.isPending}>
                    {createIntegration.isPending ? "Conectando..." : "Conectar Google Ads"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TikTok Ads Tab */}
        <TabsContent value="tiktok">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>TikTok Ads</CardTitle>
                  <CardDescription>
                    Conecte sua conta do TikTok Ads Manager para sincronizar campanhas
                  </CardDescription>
                </div>
                {getIntegration('tiktok') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {integrationsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : getIntegration('tiktok') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sua conta está conectada e sincronizando dados automaticamente.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIntegrationToDelete(getIntegration('tiktok')!.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleTikTokSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tiktok-token">Access Token</Label>
                    <Input
                      id="tiktok-token"
                      type="password"
                      placeholder="xxxxx"
                      value={tiktokAccessToken}
                      onChange={(e) => setTiktokAccessToken(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Obtenha em: TikTok for Business → Developer Tools
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok-advertiser">Advertiser ID</Label>
                    <Input
                      id="tiktok-advertiser"
                      placeholder="1234567890"
                      value={tiktokAdvertiserId}
                      onChange={(e) => setTiktokAdvertiserId(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={createIntegration.isPending}>
                    {createIntegration.isPending ? "Conectando..." : "Conectar TikTok Ads"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
          </>
        )}

        {/* Webhooks Tab */}
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>
                    Configure webhooks para enviar eventos para N8N, Evolution API ou outras integrações
                  </CardDescription>
                </div>
                <Button onClick={() => setShowWebhookForm(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.length === 0 ? (
                  <div className="text-center py-8">
                    <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum webhook configurado. Crie um para começar.
                    </p>
                  </div>
                ) : (
                  webhooks.map((webhook) => (
                    <div key={webhook.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{webhook.name}</h4>
                          {webhook.is_active ? (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground">
                              Inativo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 break-all">{webhook.url}</p>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map(event => (
                            <Badge key={event} variant="secondary" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setSelectedWebhookForLogs(webhook.id)}
                          title="Ver Logs"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => testWebhook.mutate(webhook.id)}
                          title="Testar Webhook"
                        >
                          <TestTube className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteWebhook.mutate(webhook.id)}
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>

      <AlertDialog open={!!integrationToDelete} onOpenChange={() => setIntegrationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desconectar integração?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao desconectar, os dados não serão mais sincronizados automaticamente.
              Você pode reconectar a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Webhook Form Dialog */}
      <WebhookForm
        open={showWebhookForm}
        onClose={() => setShowWebhookForm(false)}
        onSubmit={handleWebhookSubmit}
      />

      {/* Webhook Logs Dialog */}
      <Dialog open={!!selectedWebhookForLogs} onOpenChange={() => setSelectedWebhookForLogs(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Logs do Webhook</DialogTitle>
            <DialogDescription>
              Histórico de execuções e tentativas do webhook
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {webhookLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum log encontrado
              </p>
            ) : (
              webhookLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={cn(
                    "p-4 border rounded-lg",
                    log.status === 'success' && "border-success bg-success/5",
                    log.status === 'failed' && "border-destructive bg-destructive/5",
                    log.status === 'retrying' && "border-warning bg-warning/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                      <Badge variant="outline">{log.event_type}</Badge>
                      {log.response_code && (
                        <Badge variant="secondary">HTTP {log.response_code}</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Tentativa {log.attempt_number}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                  </p>
                  {log.error_message && (
                    <p className="text-sm text-destructive mt-2 font-mono">
                      {log.error_message}
                    </p>
                  )}
                  {log.response_body && (
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                        Ver resposta
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                        {log.response_body}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
