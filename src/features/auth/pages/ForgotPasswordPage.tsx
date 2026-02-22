import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import pb from '@/config/pocketbase';
import { ROUTES } from '@/config/routes';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<{ email: string }>({ defaultValues: { email: '' } });

  const onSubmit = async (data: { email: string }) => {
    setError('');
    try {
      await pb.collection('users').requestPasswordReset(data.email);
      setSent(true);
    } catch {
      setError('Failed to send reset link. Please check your email.');
    }
  };

  if (sent) {
    return (
      <Card className="border-0 shadow-none lg:border lg:shadow-sm">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary-500" />
          <h2 className="text-xl font-semibold">{t('reset_link_sent')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Check your email inbox and follow the link to reset your password.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('login')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{t('forgot_title')}</CardTitle>
        <CardDescription>{t('forgot_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" placeholder="name@slowforest.com" {...form.register('email', { required: true })} />
          </div>
          <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('send_reset_link')}
          </Button>
          <p className="text-center text-sm">
            <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline">
              <ArrowLeft className="mr-1 inline h-3 w-3" />{t('login')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
