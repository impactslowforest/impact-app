import { useState, useEffect, useCallback } from 'react';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import type { Role, Permission } from '@/types';

interface UsePermissionsReturn {
  hasPermission: (permissionName: string) => boolean;
  hasAnyPermission: (permissionNames: string[]) => boolean;
  hasAllPermissions: (permissionNames: string[]) => boolean;
  canAccessModule: (moduleKey: string) => boolean;
  canAccessCountry: (country: string) => boolean;
  userRole: Role | null;
  permissions: Permission[];
  isLoading: boolean;
  isSuperAdmin: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPermissions() {
      if (!user?.role) {
        setUserRole(null);
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch role with expanded permissions
        const role = await pb.collection('roles').getOne(user.role, {
          expand: 'permissions',
        });

        if (cancelled) return;

        setUserRole(role as unknown as Role);
        const expandedPerms = (role.expand?.permissions || []) as unknown as Permission[];
        setPermissions(expandedPerms);
      } catch (err) {
        console.error('Failed to load permissions:', err);
        setUserRole(null);
        setPermissions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPermissions();
    return () => { cancelled = true; };
  }, [user?.role]);

  const isSuperAdmin = userRole?.name === 'superadmin';

  const hasPermission = useCallback((permissionName: string): boolean => {
    if (isSuperAdmin) return true;
    return permissions.some(p => p.name === permissionName);
  }, [permissions, isSuperAdmin]);

  const hasAnyPermission = useCallback((permissionNames: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissionNames.some(name => permissions.some(p => p.name === name));
  }, [permissions, isSuperAdmin]);

  const hasAllPermissions = useCallback((permissionNames: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissionNames.every(name => permissions.some(p => p.name === name));
  }, [permissions, isSuperAdmin]);

  const canAccessModule = useCallback((moduleKey: string): boolean => {
    if (isSuperAdmin) return true;
    // Check if user has any permission containing this module key
    return permissions.some(p => p.name.includes(`.${moduleKey}.`) || p.module === moduleKey);
  }, [permissions, isSuperAdmin]);

  const canAccessCountry = useCallback((country: string): boolean => {
    if (isSuperAdmin) return true;
    if (!userRole) return false;
    if (userRole.country === 'all') return true;
    if (userRole.country === country) return true;
    // Also check individual permissions
    return permissions.some(p =>
      p.country_scope === country || p.country_scope === 'all'
    );
  }, [permissions, userRole, isSuperAdmin]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule,
    canAccessCountry,
    userRole,
    permissions,
    isLoading,
    isSuperAdmin,
  };
}
