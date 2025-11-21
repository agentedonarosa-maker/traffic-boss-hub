import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Mail, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareClientPortalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  portalUrl: string;
  agencyName?: string;
}

export function ShareClientPortalDialog({
  open,
  onOpenChange,
  clientName,
  portalUrl,
  agencyName = "Nossa Agência",
}: ShareClientPortalDialogProps) {
  const [copied, setCopied] = useState(false);

  const message = `Olá ${clientName}! 👋

Aqui está seu portal exclusivo para acompanhar nossas campanhas e gerenciar reuniões:

🔗 ${portalUrl}

Você pode:
✅ Ver suas próximas reuniões
✅ Confirmar ou sugerir novos horários
✅ Acompanhar métricas das campanhas
✅ Ver tarefas de otimização

Atenciosamente,
${agencyName}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Seu Portal de Cliente");
    const body = encodeURIComponent(message);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Compartilhar Portal do Cliente</DialogTitle>
          <DialogDescription>
            Envie o link de acesso para {clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portal-url">Link do Portal</Label>
            <div className="flex gap-2">
              <Input
                id="portal-url"
                value={portalUrl}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Enviar por:</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleEmail}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prévia da mensagem:</Label>
            <div className="p-3 border rounded-md bg-muted/50 text-sm whitespace-pre-wrap">
              {message}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
