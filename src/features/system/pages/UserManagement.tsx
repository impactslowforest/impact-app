import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle, XCircle, Clock, Ban, Search,
  UserCog, Shield, MoreHorizontal, Plus, Pencil, Trash2, Key, Lock,
} from 'lucide-react';
import { PermissionTree } from '@/components/shared/PermissionTree';
import { toast } from 'sonner';
import pb from '@/config/pocketbase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User, Role } from '@/types';
import { DEPARTMENTS, POSITIONS } from '@/config/constants';
import { useAuth } from '@/contexts/AuthContext';

// display_name is stored as JSON string in PocketBase
const getRoleName = (role: any, lang: string): string => {
  try {
    const dn = typeof role.display_name === 'string'
      ? JSON.parse(role.display_name)
      : role.display_name;
    return dn?.[lang] || dn?.en || role.name || '';
  } catch {
    return role.name || '';
  }
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Pending' },
  active: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Active' },
  suspended: { icon: Ban, color: 'bg-red-100 text-red-700', label: 'Suspended' },
  rejected: { icon: XCircle, color: 'bg-gray-100 text-gray-700', label: 'Rejected' },
};

const EMPTY_FORM: UserFormData = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  country: 'global',
  department: '',
  designation: '',
  role: '',
  permissions: [],
  sendNotification: false,
};

interface UserFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  country: string;
  department: string;
  designation: string;
  role: string;
  permissions: string[];
  sendNotification: boolean;
}

export default function UserManagement() {
  const { t, i18n } = useTranslation(['common', 'auth', 'nav']);
  const { user: currentUser, hasRole: currentHasRole } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogAction, setDialogAction] = useState<
    'approve' | 'reject' | 'role' | 'permissions' | 'add' | 'edit' | 'delete' | 'reset_password' | null
  >(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [resetPw, setResetPw] = useState('');
  const [resetPwConfirm, setResetPwConfirm] = useState('');
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', search, statusFilter],
    queryFn: async () => {
      const filters: string[] = [];
      if (search) filters.push(`(name ~ "${search}" || email ~ "${search}")`);
      if (statusFilter !== 'all') {
        filters.push(`status = "${statusFilter}"`);
      }
      const filter = filters.join(' && ');

      try {
        const result = await pb.collection('users').getList<User>(1, 500, {
          filter,
          sort: 'name',
          expand: 'role',
        });
        console.log('User list query successful:', result.totalItems, 'users found');
        return result;
      } catch (err) {
        console.error('User list query failed:', err);
        throw err;
      }
    },
  });

  // Fetch roles for assignment
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => pb.collection('roles').getFullList<Role>({ sort: 'name' }),
  });

  // Role assignment restrictions:
  // - Superadmin: sees ALL roles
  // - Country Admin: sees roles for their country + "guest" role only
  // - Others: cannot assign roles
  const isSuperadmin = currentHasRole('superadmin');
  const isCountryAdmin = currentHasRole('country_admin');
  const canManageRoles = isSuperadmin || isCountryAdmin;

  const filteredRoles = roles?.filter((role) => {
    if (isSuperadmin) return true;
    if (isCountryAdmin) {
      // Country admin cannot assign superadmin role
      if (role.name === 'superadmin' || role.name === 'super_admin') return false;
      // Can assign guest, roles matching their country, or global/all roles
      return role.name === 'guest' ||
        role.country === currentUser?.country ||
        role.country === 'all' ||
        role.country === 'global';
    }
    return false;
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      console.log('Updating user:', id, 'with data:', data);
      return pb.collection('users').update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('common:success'));
      closeDialog();
    },
    onError: (error: any) => {
      console.error('Update user failed:', error?.data || error);
      const detail = error?.data?.data;
      let msg = t('common:error');
      if (detail) {
        msg = Object.entries(detail)
          .map(([field, d]: [string, any]) => `${field}: ${d.message}`)
          .join(', ');
      } else if (error?.status === 403) {
        msg = 'Permission denied. You do not have access to update this user.';
      }
      toast.error(msg);
    },
  });

  // Create user mutation
  const createUser = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      console.log('Creating user with data:', data);
      return pb.collection('users').create(data);
    },
    onSuccess: (record) => {
      console.log('User created successfully:', record);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      closeDialog();
    },
    onError: (error: any) => {
      console.error('Failed to create user:', error);
      const pocketbaseError = error?.data?.data;
      let detailedMessage = '';
      if (pocketbaseError) {
        detailedMessage = Object.entries(pocketbaseError)
          .map(([field, detail]: [string, any]) => `${field}: ${detail.message}`)
          .join(', ');
      }
      const finalMessage = detailedMessage ? `Creation failed: ${detailedMessage}` : (error.message || t('common:error'));
      toast.error(finalMessage);
    },
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      return pb.collection('users').delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      closeDialog();
    },
    onError: () => {
      toast.error(t('common:error'));
    },
  });

  const handleApprove = () => {
    if (!selectedUser || !selectedRoleId) return;
    updateUser.mutate({
      id: selectedUser.id,
      data: { status: 'active', role: selectedRoleId },
    });
  };

  const handleReject = () => {
    if (!selectedUser) return;
    updateUser.mutate({
      id: selectedUser.id,
      data: { status: 'rejected' },
    });
  };

  const handleChangeRole = () => {
    if (!selectedUser || !selectedRoleId) return;
    updateUser.mutate({
      id: selectedUser.id,
      data: { role: selectedRoleId },
    });
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;
    updateUser.mutate({
      id: selectedUser.id,
      data: { permissions: tempPermissions },
    });
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      return pb.send('/api/custom/reset-password', {
        method: 'POST',
        body: { userId, password },
      });
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
      closeDialog();
    },
    onError: (error: any) => {
      console.error('Reset password failed:', error);
      const msg = error?.data?.message || error?.message || t('common:error');
      toast.error(msg);
    },
  });

  const handleResetPassword = () => {
    if (!selectedUser || !resetPw || resetPw !== resetPwConfirm) return;
    resetPasswordMutation.mutate({ userId: selectedUser.id, password: resetPw });
  };

  const handleSuspend = (user: User) => {
    updateUser.mutate({
      id: user.id,
      data: { status: user.status === 'suspended' ? 'active' : 'suspended' },
    });
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) return;
    createUser.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      country: formData.country,
      department: formData.department || undefined,
      designation: formData.designation || undefined,
      role: formData.role || undefined,
      permissions: formData.permissions,
      status: 'active',
      emailVisibility: true,
    });
    if (formData.sendNotification) {
      // In a real app, we'd trigger an email here.
      // For now, we'll just show a toast or rely on PB verification if enabled.
      console.log('Notification would be sent to:', formData.email);
    }
  };

  const handleEditUser = () => {
    if (!selectedUser || !formData.name || !formData.email) return;
    const data: Record<string, unknown> = {
      name: formData.name,
      email: formData.email,
      country: formData.country,
      department: formData.department || '',
      designation: formData.designation || '',
      role: formData.role || '',
      permissions: formData.permissions,
    };
    // Only include password if provided
    if (formData.password) {
      data.password = formData.password;
      data.passwordConfirm = formData.passwordConfirm;
    }
    updateUser.mutate({ id: selectedUser.id, data });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUser.mutate(selectedUser.id);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogAction(null);
    setSelectedRoleId('');
    setFormData(EMPTY_FORM);
    setResetPw('');
    setResetPwConfirm('');
  };

  const openAction = (user: User, action: 'approve' | 'reject' | 'role' | 'permissions' | 'edit' | 'delete' | 'reset_password') => {
    setIsDetailOpen(false); // close detail dialog if open
    setSelectedUser(user);
    setDialogAction(action);
    if (action === 'role' || action === 'approve') {
      if (user.role) setSelectedRoleId(user.role);
    }
    if (action === 'permissions') {
      setTempPermissions(user.permissions || []);
    }
    if (action === 'edit') {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirm: '',
        country: user.country || 'global',
        department: user.department || '',
        designation: user.designation || '',
        role: user.role || '',
        permissions: user.permissions || [],
        sendNotification: false,
      });
    }
  };

  const openAddDialog = () => {
    setSelectedUser(null);
    setFormData(EMPTY_FORM);
    setDialogAction('add');
  };

  const updateFormField = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pendingCount = usersData?.items.filter(u => u.status === 'pending').length || 0;

  const isAddFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.passwordConfirm.trim() !== '' &&
    formData.password === formData.passwordConfirm;

  const isEditFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    (!formData.password || formData.password === formData.passwordConfirm);

  // Shared user form for Add/Edit dialogs
  const renderUserForm = (mode: 'add' | 'edit') => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="form-name">{t('auth:full_name')} *</Label>
        <Input
          id="form-name"
          value={formData.name}
          onChange={(e) => updateFormField('name', e.target.value)}
          placeholder="Full name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="form-email">{t('auth:email')} *</Label>
        <Input
          id="form-email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormField('email', e.target.value)}
          placeholder="user@example.com"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="form-password">
            {mode === 'add' ? `${t('auth:password')} *` : t('auth:password')}
          </Label>
          <Input
            id="form-password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormField('password', e.target.value)}
            placeholder={mode === 'edit' ? 'Leave blank to keep' : ''}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-password-confirm">
            {mode === 'add' ? `${t('auth:confirm_password')} *` : t('auth:confirm_password')}
          </Label>
          <Input
            id="form-password-confirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={(e) => updateFormField('passwordConfirm', e.target.value)}
            placeholder={mode === 'edit' ? 'Leave blank to keep' : ''}
          />
        </div>
      </div>
      {formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
        <p className="text-sm text-destructive">Passwords do not match</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="form-country">{t('auth:country')}</Label>
          <Select value={formData.country} onValueChange={(v) => updateFormField('country', v)}>
            <SelectTrigger id="form-country">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="laos">Laos</SelectItem>
              <SelectItem value="indonesia">Indonesia</SelectItem>
              <SelectItem value="vietnam">Vietnam</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-role">Role</Label>
          {canManageRoles ? (
            <Select value={formData.role} onValueChange={(v) => updateFormField('role', v)}>
              <SelectTrigger id="form-role">
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                {filteredRoles?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {getRoleName(role, i18n.language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value="No permission to assign roles" disabled className="text-muted-foreground" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="form-department">{t('auth:department')}</Label>
          <Select value={formData.department} onValueChange={(v) => updateFormField('department', v)}>
            <SelectTrigger id="form-department">
              <SelectValue placeholder="Select dept..." />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map(d => (
                <SelectItem key={d} value={d}>{t(`common:depts.${d}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="form-designation">{t('auth:designation')}</Label>
          <Select value={formData.designation} onValueChange={(v) => updateFormField('designation', v)}>
            <SelectTrigger id="form-designation">
              <SelectValue placeholder="Select position..." />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map(p => (
                <SelectItem key={p} value={p}>{t(`common:jobs.${p}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Label>Individual Permissions</Label>
        <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto bg-gray-50/50">
          <PermissionTree
            selectedPermissions={formData.permissions}
            onPermissionToggle={(keys) => {
              setFormData(prev => {
                const next = new Set(prev.permissions);
                keys.forEach(key => {
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                });
                return { ...prev, permissions: Array.from(next) };
              });
            }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="send-notification"
          checked={formData.sendNotification}
          onChange={(e) => setFormData(prev => ({ ...prev, sendNotification: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <Label htmlFor="send-notification" className="text-sm font-normal cursor-pointer">
          Send activation email notification to user
        </Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('nav:user_management')}</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, approvals, and role assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge variant="destructive" className="gap-1 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {pendingCount} pending approval
            </Badge>
          )}
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters with GlassCard */}
      <GlassCard className="p-4 border-none shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`${t('common:search')}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/50 border-white/20 focus:bg-white transition-all"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-white/50 border-white/40">
              <SelectValue placeholder={t('common:status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common:all')}</SelectItem>
              <SelectItem value="pending">{t('common:pending')}</SelectItem>
              <SelectItem value="active">{t('common:active')}</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="rejected">{t('common:rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Users table with GlassCard container */}
      <GlassCard className="p-0 border-none shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('auth:full_name')}</TableHead>
              <TableHead>{t('auth:email')}</TableHead>
              <TableHead>{t('auth:country')}</TableHead>
              <TableHead>{t('auth:department')}</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>{t('common:status')}</TableHead>
              <TableHead className="text-right">{t('common:actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="h-6 w-6 mx-auto animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                </TableCell>
              </TableRow>
            ) : usersData?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t('common:no_data')}
                </TableCell>
              </TableRow>
            ) : (
              usersData?.items.map((user) => {
                const status = STATUS_CONFIG[user.status] || STATUS_CONFIG.pending;
                const StatusIcon = status.icon;
                const expandedRole = (user.expand as Record<string, unknown>)?.role as Role | undefined;

                return (
                  <TableRow
                    key={user.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${user.status === 'pending' ? 'bg-amber-50/50' : ''}`}
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDetailOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.country}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.department ? t(`common:depts.${user.department}`) : '-'}</span>
                        <span className="text-xs text-muted-foreground">{user.designation ? t(`common:jobs.${user.designation}`) : '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {expandedRole ? (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          {getRoleName(expandedRole, i18n.language)}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No role</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`gap-1 ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === 'pending' && canManageRoles && (
                            <>
                              <DropdownMenuItem onSelect={() => openAction(user as User, 'approve')}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openAction(user as User, 'reject')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onSelect={() => openAction(user as User, 'edit')}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {canManageRoles && (
                            <>
                              <DropdownMenuItem onSelect={() => openAction(user as User, 'role')}>
                                <UserCog className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openAction(user as User, 'permissions')}>
                                <Key className="mr-2 h-4 w-4 text-indigo-600" />
                                Individual Permissions
                              </DropdownMenuItem>
                              {user.id !== currentUser?.id && (
                                <DropdownMenuItem onSelect={() => openAction(user as User, 'reset_password')}>
                                  <Lock className="mr-2 h-4 w-4 text-orange-600" />
                                  Reset Password
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                          {user.status !== 'pending' && (
                            <DropdownMenuItem onSelect={() => handleSuspend(user as User)}>
                              <Ban className="mr-2 h-4 w-4" />
                              {user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => openAction(user as User, 'delete')}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </GlassCard>

      {/* Add User Dialog */}
      <Dialog open={dialogAction === 'add'} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user account. The user will be active immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {renderUserForm('add')}
          </div>
          <DialogFooter className="shrink-0 border-t pt-4">
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              onClick={handleAddUser}
              disabled={!isAddFormValid || createUser.isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              {createUser.isPending ? 'Creating...' : 'Add User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={dialogAction === 'edit'} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Update user details. Leave password fields blank to keep the current password.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {renderUserForm('edit')}
          </div>
          <DialogFooter className="shrink-0 border-t pt-4">
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              onClick={handleEditUser}
              disabled={!isEditFormValid || updateUser.isPending}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={dialogAction === 'delete'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUser.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={dialogAction === 'approve'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve User: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Assign a role to activate this user's account.
            </p>
            <div className="space-y-2">
              <Label>Select Role *</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoles?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex flex-col">
                        <span>{getRoleName(role, i18n.language)}</span>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              onClick={handleApprove}
              disabled={!selectedRoleId || updateUser.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={dialogAction === 'reject'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Are you sure you want to reject this registration? The user will not be able to access the system.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={updateUser.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={dialogAction === 'role'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Role</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoles?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {(role as any).display_name?.[i18n.language] || (role as any).display_name?.en || role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              onClick={handleChangeRole}
              disabled={!selectedRoleId || updateUser.isPending}
            >
              <Shield className="mr-2 h-4 w-4" />
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Individual Permissions Dialog */}
      <Dialog open={dialogAction === 'permissions'} onOpenChange={() => closeDialog()}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-600" />
              Permissions: {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Set granular permissions for this individual user. These will be merged with their role permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 border-y border-gray-100 my-2">
            <PermissionTree
              selectedPermissions={tempPermissions}
              onPermissionToggle={(keys) => {
                setTempPermissions(prev => {
                  const next = new Set(prev);
                  keys.forEach(key => {
                    if (next.has(key)) next.delete(key);
                    else next.add(key);
                  });
                  return Array.from(next);
                });
              }}
            />
          </div>

          <DialogFooter className="sticky bottom-0 bg-white pt-2">
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              onClick={handleSavePermissions}
              disabled={updateUser.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Key className="mr-2 h-4 w-4" />
              {updateUser.isPending ? 'Saving...' : 'Save Permissions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={dialogAction === 'reset_password'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-600" />
              Reset Password: {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Set a new password for this user. They will need to use this new password to log in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-pw">New Password *</Label>
              <Input
                id="reset-pw"
                type="password"
                value={resetPw}
                onChange={(e) => setResetPw(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-pw-confirm">Confirm Password *</Label>
              <Input
                id="reset-pw-confirm"
                type="password"
                value={resetPwConfirm}
                onChange={(e) => setResetPwConfirm(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
            {resetPw && resetPwConfirm && resetPw !== resetPwConfirm && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
            {resetPw && resetPw.length < 8 && (
              <p className="text-sm text-destructive">Password must be at least 8 characters</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>{t('common:cancel')}</Button>
            <Button
              onClick={handleResetPassword}
              disabled={!resetPw || resetPw.length < 8 || resetPw !== resetPwConfirm || resetPasswordMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Lock className="mr-2 h-4 w-4" />
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('auth:user_details') || 'User Details'}</DialogTitle>
            <DialogDescription>{selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">{t('auth:full_name')}</Label>
                <p className="font-medium">{selectedUser?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('auth:email')}</Label>
                <p className="font-medium">{selectedUser?.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('common:status')}</Label>
                <div className="mt-1">
                  <Badge className={selectedUser ? STATUS_CONFIG[selectedUser.status as keyof typeof STATUS_CONFIG]?.color : ''}>
                    {selectedUser?.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">{t('auth:department')}</Label>
                <p className="font-medium">{selectedUser?.department ? t(`common:depts.${selectedUser.department}`) : '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('auth:designation')}</Label>
                <p className="font-medium">{selectedUser?.designation ? t(`common:jobs.${selectedUser.designation}`) : '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('auth:role')}</Label>
                <div className="mt-1">
                  {selectedUser?.expand?.role && (
                    <Badge variant="outline">
                      {getRoleName(selectedUser.expand.role, i18n.language)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>{t('common:close')}</Button>
            <Button onClick={() => {
              if (selectedUser) {
                setIsDetailOpen(false);
                openAction(selectedUser, 'edit');
              }
            }}>{t('common:edit')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
