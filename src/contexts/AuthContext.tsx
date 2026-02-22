import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import pb from '@/config/pocketbase';
import type { User, LoginCredentials, RegisterData } from '@/types';
import { switchUserSettings, clearUserSettings } from '@/stores/ui-store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
    clearUserSettings();
  }, []);

  const refreshUser = useCallback(async () => {
    if (pb.authStore.isValid && pb.authStore.record) {
      try {
        const freshUser = await pb.collection('users').getOne(pb.authStore.record.id, {
          expand: 'role.permissions',
        });
        setUser(freshUser as unknown as User);
      } catch {
        logout();
      }
    }
  }, [logout]);

  const loadUser = useCallback(async () => {
    if (pb.authStore.isValid && pb.authStore.record) {
      // Fetch user with role expand directly — do NOT set basic user first
      // to avoid race condition where hasRole() returns false between renders
      try {
        const fullUser = await pb.collection('users').getOne(pb.authStore.record.id, {
          expand: 'role.permissions',
        });
        setUser(fullUser as unknown as User);
        switchUserSettings(fullUser.id);
      } catch {
        // Fallback to basic record if expand fetch fails (e.g. network error)
        setUser(pb.authStore.record as unknown as User);
        switchUserSettings(pb.authStore.record.id);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();

    const unsubscribe = pb.authStore.onChange(() => {
      loadUser();
    });

    return () => { unsubscribe(); };
  }, [loadUser]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    const authData = await pb.collection('users').authWithPassword(
      credentials.email,
      credentials.password,
      { expand: 'role.permissions' }
    );
    const userData = authData.record as unknown as User;
    if (userData.status !== 'active') {
      pb.authStore.clear();
      throw new Error(userData.status === 'pending' ? 'PENDING_APPROVAL' : 'ACCOUNT_INACTIVE');
    }
    setUser(userData);
    switchUserSettings(userData.id);
    return userData;
  };

  const register = async (data: RegisterData) => {
    await pb.collection('users').create({
      ...data,
      status: 'pending',
      emailVisibility: true,
    });
  };

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    const role = user.expand?.role as any;
    if (!role) return false;

    // Superadmin has all permissions
    if (role.name === 'superadmin') return true;

    // Role permissions from expanded relation records
    const rolePerms = (role.expand?.permissions || []) as Array<{ name: string }>;
    const rolePermNames = rolePerms.map((p) => p.name);

    // Individual user permissions (JSON array of permission name strings)
    const individualPermissions: string[] = user.permissions || [];

    return rolePermNames.includes(permission) || individualPermissions.includes(permission);
  }, [user]);

  const hasRole = useCallback((roleName: string) => {
    if (!user) return false;
    const role = user.expand?.role as any;
    return role?.name === roleName;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user && user.status === 'active',
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      hasPermission,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
