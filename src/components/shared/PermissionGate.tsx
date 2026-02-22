import type { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGateProps {
  /** Single permission to check */
  requires?: string;
  /** Multiple permissions - user needs ANY of them */
  requiresAny?: string[];
  /** Multiple permissions - user needs ALL of them */
  requiresAll?: string[];
  /** Module key to check access */
  module?: string;
  /** Country to check access */
  country?: string;
  /** Content to show if permission denied */
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  requires,
  requiresAny,
  requiresAll,
  module,
  country,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccessModule, canAccessCountry, isLoading } = usePermissions();

  if (isLoading) return null;

  let allowed = true;

  if (requires) {
    allowed = allowed && hasPermission(requires);
  }
  if (requiresAny) {
    allowed = allowed && hasAnyPermission(requiresAny);
  }
  if (requiresAll) {
    allowed = allowed && hasAllPermissions(requiresAll);
  }
  if (module) {
    allowed = allowed && canAccessModule(module);
  }
  if (country) {
    allowed = allowed && canAccessCountry(country);
  }

  return allowed ? <>{children}</> : <>{fallback}</>;
}
