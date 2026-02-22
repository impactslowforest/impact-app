import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Loader2, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import pb from '@/config/pocketbase';
import { toast } from 'sonner';

interface ProfileFormData {
  name: string;
  phone: string;
  department: string;
  designation: string;
  language_pref: string;
}

export default function ProfilePage() {
  const { t } = useTranslation(['auth', 'common']);
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const form = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      department: user?.department || '',
      designation: user?.designation || '',
      language_pref: user?.language_pref || 'en',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setSaving(true);
    try {
      await pb.collection('users').update(user.id, data);
      await refreshUser();
      toast.success(t('common:saved'));
    } catch {
      toast.error(t('common:error'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('auth:passwords_mismatch'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('auth:password_too_short'));
      return;
    }
    if (!user) return;
    setChangingPassword(true);
    try {
      await pb.collection('users').update(user.id, {
        oldPassword,
        password: newPassword,
        passwordConfirm: confirmPassword,
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('auth:password_changed'));
    } catch {
      toast.error(t('auth:password_change_failed'));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await pb.collection('users').update(user.id, formData);
      await refreshUser();
      toast.success(t('common:saved'));
    } catch {
      toast.error(t('common:error'));
    }
  };

  if (!user) return null;

  const avatarUrl = user.avatar
    ? pb.files.getURL(user, user.avatar, { thumb: '200x200' })
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('nav:my_profile', { ns: 'nav' })}</h1>
        <p className="text-sm text-muted-foreground">{t('auth:profile_subtitle')}</p>
      </div>

      {/* Avatar & Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <User className="h-10 w-10" />
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600">
                <Camera className="h-3.5 w-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex gap-2">
                <Badge variant="outline" className="capitalize">{user.country}</Badge>
                <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('auth:personal_info')}</CardTitle>
          <CardDescription>{t('auth:personal_info_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t('auth:full_name')}</Label>
                <Input id="name" {...form.register('name')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">{t('auth:phone')}</Label>
                <Input id="phone" {...form.register('phone')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="department">{t('auth:department')}</Label>
                <Input id="department" {...form.register('department')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="designation">{t('auth:designation')}</Label>
                <Input id="designation" {...form.register('designation')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t('auth:language_preference')}</Label>
              <Select
                defaultValue={user.language_pref || 'en'}
                onValueChange={(val) => form.setValue('language_pref', val)}
              >
                <SelectTrigger className="w-[200px]">
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

            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common:save')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('auth:change_password')}</CardTitle>
          <CardDescription>{t('auth:change_password_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('auth:current_password')}</Label>
            <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('auth:new_password')}</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('auth:confirm_new_password')}</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <Button onClick={handlePasswordChange} disabled={changingPassword || !oldPassword || !newPassword}>
            {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth:update_password')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
