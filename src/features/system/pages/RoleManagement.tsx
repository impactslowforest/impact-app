import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ShieldCheck, UserCog, Plus, Save, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/config/pocketbase';
import { PermissionTree } from '@/components/shared/PermissionTree';

interface Role {
    id: string;
    name: string;
    permissions: string[];
}


export default function RoleManagement() {
    const { t } = useTranslation(['common', 'system', 'nav']);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tempPermissions, setTempPermissions] = useState<string[]>([]);
    useEffect(() => {
        fetchRoles();
    }, []);

    async function fetchRoles() {
        setLoading(true);
        try {
            const records = await pb.collection('roles').getFullList<Role>();
            setRoles(records);
            if (records.length > 0 && !selectedRole) {
                handleSelectRole(records[0]);
            }
        } catch (err) {
            console.error('Failed to fetch roles:', err);
            toast.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    }

    const handleSelectRole = (role: Role) => {
        setSelectedRole(role);
        setTempPermissions(role.permissions || []);
    };

    const togglePermission = (keys: string[]) => {
        setTempPermissions(prev => {
            const next = new Set(prev);
            keys.forEach(key => {
                if (next.has(key)) next.delete(key);
                else next.add(key);
            });
            return Array.from(next);
        });
    };

    const handleSave = async () => {
        if (!selectedRole) return;
        setSaving(true);
        try {
            await pb.collection('roles').update(selectedRole.id, {
                permissions: tempPermissions
            });
            toast.success('Permissions updated successfully');
            // Update local state
            setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, permissions: tempPermissions } : r));
        } catch (err) {
            console.error('Save failed:', err);
            toast.error('Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20 page-enter">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-indigo-600" />
                        {t('common:role_management', 'Role & Permission Management')}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Define access levels and assign granular permissions for each role.
                    </p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('system:create_new_role', 'Create New Role')}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Roles List */}
                <Card className="lg:col-span-1 border-gray-100 shadow-sm self-start">
                    <CardHeader className="py-4 border-b bg-gray-50/50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-gray-500" />
                            {t('common:roles', 'Roles')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => handleSelectRole(role)}
                                        className={`w-full text-left p-4 transition-all text-sm font-medium flex items-center justify-between group ${selectedRole?.id === role.id
                                            ? 'bg-indigo-50/80 text-indigo-700 border-l-4 border-indigo-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{role.name}</span>
                                        <Badge variant="outline" className={`text-[9px] ${selectedRole?.id === role.id ? 'bg-white border-indigo-200' : 'opacity-50'
                                            }`}>
                                            {role.permissions?.length || 0} perms
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Permission Tree */}
                <Card className="lg:col-span-2 border-gray-100 shadow-sm flex flex-col min-h-[600px]">
                    <CardHeader className="py-4 border-b flex flex-row items-center justify-between bg-white sticky top-0 z-10">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-indigo-600" />
                            {selectedRole ? `Permissions for ${selectedRole.name}` : 'Permission Tree'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 flex-1">
                        {!selectedRole ? (
                            <div className="p-20 flex flex-col items-center justify-center text-gray-400 italic text-sm text-center">
                                <ShieldCheck className="h-16 w-16 opacity-5 mb-4" />
                                <p className="max-w-xs">{t('system:select_role_to_edit', 'Select a role from the left to edit its granular permissions.')}</p>
                            </div>
                        ) : (
                            <PermissionTree
                                selectedPermissions={tempPermissions}
                                onPermissionToggle={togglePermission}
                            />
                        )}
                    </CardContent>

                    <div className="p-4 border-t bg-gray-50/50 flex justify-between items-center">
                        <span className="text-xs text-gray-500 italic">
                            Careful: Changes affect all users with this role immediately.
                        </span>
                        <Button
                            disabled={!selectedRole || saving}
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 px-8 shadow-md transition-all active:scale-95"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
