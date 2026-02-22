import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

export default function PendingApprovalPage() {
  const { t } = useTranslation('auth');

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <CardContent className="pt-6 text-center">
        <Clock className="mx-auto mb-4 h-16 w-16 text-amber-500" />
        <h2 className="text-2xl font-bold">{t('pending_title')}</h2>
        <p className="mt-3 text-muted-foreground">{t('pending_subtitle')}</p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline" className="mt-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('login')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
