import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { COUNTRIES, SUPPORTED_LANGUAGES, DEPARTMENTS, POSITIONS } from '@/config/constants';
import { registerSchema, type RegisterFormData } from '../schemas/login.schema';

export default function RegisterPage() {
  const { t } = useTranslation('auth');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '', email: '', password: '', passwordConfirm: '',
      phone: '', country: '', department: '', designation: '', language_pref: 'en',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    try {
      await registerUser(data);
      navigate(ROUTES.PENDING_APPROVAL);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{t('register_title')}</CardTitle>
        <CardDescription>{t('register_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">{t('full_name')} *</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">{t('email')} *</Label>
            <Input id="email" type="email" {...form.register('email')} />
            {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">{t('password')} *</Label>
              <Input id="password" type="password" {...form.register('password')} />
              {form.formState.errors.password && <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="passwordConfirm">{t('confirm_password')} *</Label>
              <Input id="passwordConfirm" type="password" {...form.register('passwordConfirm')} />
              {form.formState.errors.passwordConfirm && <p className="text-xs text-red-500">{form.formState.errors.passwordConfirm.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('country')} *</Label>
              <Select onValueChange={(val) => form.setValue('country', val)}>
                <SelectTrigger><SelectValue placeholder={t('select_country')} /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.filter(c => c.code !== 'global').map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.country && <p className="text-xs text-red-500">{form.formState.errors.country.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input id="phone" {...form.register('phone')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('department')}</Label>
              <Select onValueChange={(val) => form.setValue('department', val)}>
                <SelectTrigger><SelectValue placeholder={t('select_department') || 'Select Department'} /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => (
                    <SelectItem key={d} value={d}>{t(`common:depts.${d}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('designation')}</Label>
              <Select onValueChange={(val) => form.setValue('designation', val)}>
                <SelectTrigger><SelectValue placeholder={t('select_designation') || 'Select Position'} /></SelectTrigger>
                <SelectContent>
                  {POSITIONS.map(p => (
                    <SelectItem key={p} value={p}>{t(`common:jobs.${p}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('language_preference')}</Label>
            <Select defaultValue="en" onValueChange={(val) => form.setValue('language_pref', val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(l => (
                  <SelectItem key={l.code} value={l.code}>{l.flag} {l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('register')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('have_account')}{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:underline">{t('login')}</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
