import { Outlet } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

interface PermissionGuardProps {
  requires?: string;
  requiresAny?: string[];
  module?: string;
  country?: string;
}

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <ShieldX className="mb-4 h-16 w-16 text-red-400" />
      <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        You do not have permission to access this module.
      </p>
      <Button variant="outline" className="mt-6" onClick={() => navigate(ROUTES.DASHBOARD)}>
        Go to Dashboard
      </Button>
    </div>
  );
}

export function PermissionGuard({ requires, requiresAny, module, country }: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, canAccessModule, canAccessCountry, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  let allowed = true;

  if (requires) allowed = allowed && hasPermission(requires);
  if (requiresAny) allowed = allowed && hasAnyPermission(requiresAny);
  if (module) allowed = allowed && canAccessModule(module);
  if (country) allowed = allowed && canAccessCountry(country);

  if (!allowed) return <AccessDenied />;

  return <Outlet />;
}
