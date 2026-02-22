import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Users, Mail, Phone, MapPin, Building2,
    Search, ShieldCheck, ArrowLeft, User as UserIcon,
    Calendar, Globe, Briefcase, X, Pencil, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import { toast } from 'sonner';
import type { User } from '@/types';

interface StaffManagementProps {
    country: 'laos' | 'indonesia' | 'vietnam';
}

export default function StaffManagement({ country }: StaffManagementProps) {
    const { t, i18n } = useTranslation(['common', 'auth']);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user: currentUser, refreshUser } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState<User | null>(null);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', phone: '', department: '', designation: '', language_pref: '' });

    const { data: staffData, isLoading, refetch } = useQuery({
        queryKey: ['staff', country, search],
        queryFn: async () => {
            let filter = `(country ~ "${country}" || country = "global" || country = null || country = "") && status = "active"`;
            if (search) {
                filter += ` && (name ~ "${search}" || email ~ "${search}")`;
            }
            return pb.collection('users').getList<User>(1, 200, {
                filter,
                sort: 'name',
                expand: 'role',
            });
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (data: typeof editData) => {
            if (!selectedMember) throw new Error('No member selected');
            return pb.collection('users').update(selectedMember.id, data);
        },
        onSuccess: () => {
            toast.success(t('common:saved', 'Saved'));
            setEditing(false);
            queryClient.invalidateQueries({ queryKey: ['staff', country] });
            refreshUser();
        },
        onError: () => {
            toast.error(t('common:error', 'Error saving'));
        },
    });

    const getAvatarUrl = (member: User) =>
        member.avatar ? pb.files.getURL(member, member.avatar, { thumb: '200x200' }) : null;

    const getRoleName = (member: User) =>
        (member.expand?.role as any)?.display_name?.[i18n.language]
        || (member.expand?.role as any)?.name
        || t('common:no_role', 'No Role');

    const isOwnProfile = (member: User) => currentUser?.id === member.id;

    const startEditing = (member: User) => {
        setEditData({
            name: member.name || '',
            phone: member.phone || '',
            department: member.department || '',
            designation: member.designation || '',
            language_pref: member.language_pref || 'en',
        });
        setEditing(true);
    };

    return (
        <div className="space-y-4 page-enter">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Button variant="ghost" size="sm" className="h-8 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            {t('common:back', 'Back')}
                        </Button>
                    </div>
                    <h1 className="text-2xl font-bold text-primary-900">
                        {t(`common:staff_info_${country}`, `${country.charAt(0).toUpperCase() + country.slice(1)} Staff`)}
                    </h1>
                    <p className="text-sm text-gray-500">{staffData?.totalItems || 0} {t('common:records', 'records')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading} className="h-9">
                        <Users className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        {t('common:refresh', 'Refresh')}
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t('common:search_staff', 'Search by name or email...')}
                        className="pl-9 border-gray-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-200 hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('auth:name')}</TableHead>
                                <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('auth:role')}</TableHead>
                                <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('auth:department')}</TableHead>
                                <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('auth:designation')}</TableHead>
                                <TableHead className="font-semibold text-gray-500 text-[12px] uppercase tracking-wider whitespace-nowrap bg-gray-50/50 px-4 py-2.5">{t('auth:contact')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        {t('common:loading', 'Loading...')}
                                    </TableCell>
                                </TableRow>
                            ) : staffData?.items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        {t('common:no_results', 'No staff found.')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                staffData?.items.map((member) => (
                                    <TableRow
                                        key={member.id}
                                        className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                                        onClick={() => { setSelectedMember(member); setEditing(false); }}
                                    >
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                                                    {member.avatar ? (
                                                        <img src={getAvatarUrl(member)!} alt="" className="h-full w-full rounded-full object-cover" />
                                                    ) : (
                                                        member.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-[13px]">
                                                        {member.name}
                                                        {isOwnProfile(member) && (
                                                            <span className="ml-2 text-[10px] text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">{t('common:you', 'You')}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck className="h-3.5 w-3.5 text-primary-600" />
                                                <span className="text-[13px] font-medium">{getRoleName(member)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <span className="text-[13px] text-gray-600">{member.department || '—'}</span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <span className="text-[13px] text-gray-600 italic">{member.designation || '—'}</span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="space-y-0.5">
                                                {member.phone && (
                                                    <div className="text-xs text-gray-600 flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3" /> {member.phone}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                                                    <MapPin className="h-3 w-3" /> {t(`common:${member.country}`, member.country)}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Staff Profile Detail / Edit Dialog */}
            <Dialog open={!!selectedMember} onOpenChange={(open) => { if (!open) { setSelectedMember(null); setEditing(false); } }}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto p-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selectedMember?.name}</DialogTitle>
                        <DialogDescription>{t('common:staff_profile', 'Staff profile')}</DialogDescription>
                    </DialogHeader>

                    {selectedMember && !editing && (() => {
                        const avatar = getAvatarUrl(selectedMember);
                        const role = getRoleName(selectedMember);
                        const isSelf = isOwnProfile(selectedMember);
                        return (
                            <>
                                {/* Profile Header */}
                                <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 px-6 pt-8 pb-6 text-white">
                                    <button
                                        onClick={() => setSelectedMember(null)}
                                        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="flex items-center gap-5">
                                        <div className="h-20 w-20 rounded-full border-4 border-white/30 shadow-lg shrink-0 overflow-hidden bg-white/10 flex items-center justify-center">
                                            {avatar ? (
                                                <img src={avatar} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <UserIcon className="h-10 w-10 text-white/70" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{selectedMember.name}</h2>
                                            <p className="text-primary-100 text-sm">{selectedMember.designation || role}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                                                    {selectedMember.status}
                                                </Badge>
                                                <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 capitalize">
                                                    {selectedMember.country}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className="px-6 py-5 space-y-0 divide-y divide-gray-100">
                                    <div className="flex items-center gap-3 py-3">
                                        <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">{t('auth:email', 'Email')}</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedMember.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3">
                                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">{t('auth:phone', 'Phone')}</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedMember.phone || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3">
                                        <ShieldCheck className="h-4 w-4 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">{t('auth:role', 'Role')}</p>
                                            <p className="text-sm font-medium text-gray-900">{role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3">
                                        <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">{t('auth:department', 'Department')}</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedMember.department || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3">
                                        <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">{t('auth:designation', 'Designation')}</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedMember.designation || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3">
                                        <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">{t('auth:country', 'Country')}</p>
                                            <p className="text-sm font-medium text-gray-900 capitalize">{t(`common:${selectedMember.country}`, selectedMember.country)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-3">
                                        <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">{t('auth:last_login', 'Last login')}</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedMember.last_login
                                                    ? new Date(selectedMember.last_login).toLocaleString(i18n.language)
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Self-edit button */}
                                {isSelf && (
                                    <div className="px-6 pb-5">
                                        <Button
                                            onClick={() => startEditing(selectedMember)}
                                            className="w-full gap-2 bg-primary-700 hover:bg-primary-800 text-white"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            {t('auth:edit_my_profile', 'Edit my profile')}
                                        </Button>
                                    </div>
                                )}
                            </>
                        );
                    })()}

                    {/* Edit Form (own profile only) */}
                    {selectedMember && editing && (
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-4 border-b">
                                <Pencil className="h-5 w-5 text-primary-700" />
                                <h3 className="text-lg font-bold text-primary-900">{t('auth:edit_my_profile', 'Edit my profile')}</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-700">{t('auth:full_name', 'Full Name')}</Label>
                                    <Input
                                        value={editData.name}
                                        onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                                        className="border-gray-200"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-700">{t('auth:phone', 'Phone')}</Label>
                                    <Input
                                        value={editData.phone}
                                        onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))}
                                        className="border-gray-200"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-700">{t('auth:department', 'Department')}</Label>
                                        <Input
                                            value={editData.department}
                                            onChange={e => setEditData(d => ({ ...d, department: e.target.value }))}
                                            className="border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-gray-700">{t('auth:designation', 'Designation')}</Label>
                                        <Input
                                            value={editData.designation}
                                            onChange={e => setEditData(d => ({ ...d, designation: e.target.value }))}
                                            className="border-gray-200"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-700">{t('auth:language_preference', 'Language')}</Label>
                                    <Select value={editData.language_pref} onValueChange={val => setEditData(d => ({ ...d, language_pref: val }))}>
                                        <SelectTrigger className="w-full border-gray-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUPPORTED_LANGUAGES.map(lang => (
                                                <SelectItem key={lang.code} value={lang.code}>
                                                    {lang.flag} {lang.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Read-only info */}
                                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 space-y-1">
                                    <p><strong>{t('auth:email', 'Email')}:</strong> {selectedMember.email}</p>
                                    <p><strong>{t('auth:role', 'Role')}:</strong> {getRoleName(selectedMember)}</p>
                                    <p><strong>{t('auth:country', 'Country')}:</strong> {selectedMember.country}</p>
                                    <p className="text-gray-400 italic">{t('auth:role_managed_by_admin', 'Role & permissions are managed by administrators')}</p>
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setEditing(false)}>
                                    {t('common:cancel', 'Cancel')}
                                </Button>
                                <Button
                                    onClick={() => saveMutation.mutate(editData)}
                                    disabled={saveMutation.isPending}
                                    className="bg-primary-700 hover:bg-primary-800 text-white"
                                >
                                    {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('common:save', 'Save')}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
