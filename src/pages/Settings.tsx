import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Plug, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useCreateIntegration } from "@/hooks/useCreateIntegration";
import { useDeleteIntegration } from "@/hooks/useDeleteIntegration";

export default function Settings() {
  const { data: integrations = [], isLoading } = useIntegrations();
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

  // TikTok Ads Form
  const [tiktokAccessToken, setTiktokAccessToken] = useState("");
  const [tiktokAdvertiserId, setTiktokAdvertiserId] = useState("");

  const getIntegration = (platform: string) => {
    return integrations.find(i => i.platform === platform);
  };

  const handleMetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIntegration.mutate({
      platform: 'meta',
      credentials: {
        access_token: metaAccessToken,
        account_id: metaAccountId,
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
    createIntegration.mutate({
      platform: 'google',
      credentials: {
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: googleRefreshToken,
      },
    }, {
      onSuccess: () => {
        setGoogleClientId("");
        setGoogleClientSecret("");
        setGoogleRefreshToken("");
      }
    });
  };

  const handleTikTokSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIntegration.mutate({
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas integrações com plataformas de anúncios</p>
        </div>
      </div>

      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meta" className="gap-2">
            <Plug className="w-4 h-4" />
            Meta Ads
            {getIntegration('meta') && <CheckCircle2 className="w-3 h-3 text-success" />}
          </TabsTrigger>
          <TabsTrigger value="google" className="gap-2">
            <Plug className="w-4 h-4" />
            Google Ads
            {getIntegration('google') && <CheckCircle2 className="w-3 h-3 text-success" />}
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="gap-2">
            <Plug className="w-4 h-4" />
            TikTok Ads
            {getIntegration('tiktok') && <CheckCircle2 className="w-3 h-3 text-success" />}
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
                {getIntegration('meta') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getIntegration('meta') ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sua conta está conectada e sincronizando dados automaticamente.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIntegrationToDelete(getIntegration('meta')!.id)}
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
                {getIntegration('google') && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getIntegration('google') ? (
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
                    <p className="text-xs text-muted-foreground">
                      Configure OAuth 2.0 no Google Cloud Console
                    </p>
                  </div>
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
              {getIntegration('tiktok') ? (
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
    </div>
  );
}
