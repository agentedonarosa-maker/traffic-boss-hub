import { useClientAccess } from "@/hooks/useClientAccess";
import { ShareClientPortalDialog } from "./ShareClientPortalDialog";

interface SharePortalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  agencyName?: string;
}

export function SharePortalWrapper({
  open,
  onOpenChange,
  clientId,
  clientName,
  agencyName = "Sua Agência",
}: SharePortalWrapperProps) {
  const { data: access } = useClientAccess(clientId);

  if (!access) return null;

  const portalUrl = `${window.location.origin}/client-portal/${access.access_token}`;

  return (
    <ShareClientPortalDialog
      open={open}
      onOpenChange={onOpenChange}
      clientName={clientName}
      portalUrl={portalUrl}
      agencyName={agencyName}
    />
  );
}
