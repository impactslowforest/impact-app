import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';

export default function LoginPage() {
  const { t } = useTranslation('auth');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  // Map user country to their default landing page
  const getCountryHome = (country?: string): string => {
    switch (country) {
      case 'laos': return ROUTES.LA_COOPERATIVE;
      case 'indonesia': return ROUTES.ID_COOPERATIVE;
      case 'vietnam': return ROUTES.VN_COOPERATIVE;
      default: return ROUTES.DASHBOARD;
    }
  };

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const userData = await login(data);
      const redirectTo = from || getCountryHome(userData.country);
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'PENDING_APPROVAL') {
          navigate(ROUTES.PENDING_APPROVAL);
          return;
        }
      }
      setError(t('login_error'));
    }
  };

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{t('login_title')}</CardTitle>
        <CardDescription>{t('login_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@slowforest.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('password')}</Label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-primary-600 hover:underline">
                {t('forgot_password')}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t('login')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('no_account')}{' '}
            <Link to={ROUTES.REGISTER} className="font-medium text-primary-600 hover:underline">
              {t('register')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
