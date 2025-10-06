import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Plug, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useCreateIntegration } from "@/hooks/useCreateIntegration";
import { useDeleteIntegration } from "@/hooks/useDeleteIntegration";
import { useClients } from "@/hooks/useClients";

export default function Settings() {
  const { data: clients = [] } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { data: integrations = [], isLoading } = useIntegrations(selectedClientId);
  const createIntegration = useCreateIntegration();
  const deleteIntegration = useDeleteIntegration();

  const [integrationToDelete, setIntegrationToDelete] = useState<string | null>(null);

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
      platform: 'meta_ads',
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
      platform: 'google_ads',
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
      platform: 'tiktok_ads',
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

      {selectedClientId && (
        <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="meta" className="gap-1 md:gap-2 flex-col md:flex-row py-2 md:py-1.5 text-xs md:text-sm">
            <Plug className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Meta Ads</span>
            <span className="sm:hidden">Meta</span>
            {getIntegration('meta_ads') && <CheckCircle2 className="w-3 h-3 text-success" />}
          </TabsTrigger>
          <TabsTrigger value="google" className="gap-1 md:gap-2 flex-col md:flex-row py-2 md:py-1.5 text-xs md:text-sm">
            <Plug className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Google Ads</span>
            <span className="sm:hidden">Google</span>
            {getIntegration('google_ads') && <CheckCircle2 className="w-3 h-3 text-success" />}
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="gap-1 md:gap-2 flex-col md:flex-row py-2 md:py-1.5 text-xs md:text-sm">
            <Plug className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">TikTok Ads</span>
            <span className="sm:hidden">TikTok</span>
            {getIntegration('tiktok_ads') && <CheckCircle2 className="w-3 h-3 text-success" />}
          </TabsTrigger>
        </TabsList>

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
                {getIntegration('meta_ads') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getIntegration('meta_ads') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sua conta está conectada e sincronizando dados automaticamente.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIntegrationToDelete(getIntegration('meta_ads')!.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
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
                {getIntegration('google_ads') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getIntegration('google_ads') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sua conta está conectada e sincronizando dados automaticamente.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIntegrationToDelete(getIntegration('google_ads')!.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleGoogleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {getIntegration('tiktok_ads') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getIntegration('tiktok_ads') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sua conta está conectada e sincronizando dados automaticamente.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIntegrationToDelete(getIntegration('tiktok_ads')!.id)}
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
        </Tabs>
      )}

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
    </div>
  );
}
