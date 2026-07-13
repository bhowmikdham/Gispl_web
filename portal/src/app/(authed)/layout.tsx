import { AuthGuard } from "@/components/auth/AuthGuard";
import { PortalShell } from "@/components/shell/PortalShell";

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PortalShell>{children}</PortalShell>
    </AuthGuard>
  );
}
