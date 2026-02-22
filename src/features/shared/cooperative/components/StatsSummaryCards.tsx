import { useTranslation } from 'react-i18next';
import { Building2, Users, Sprout, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCooperativeStats } from '../hooks/useCooperativeData';

interface StatsSummaryCardsProps {
  country: string;
  onCardClick?: (tab: string) => void;
}

export function StatsSummaryCards({ country, onCardClick }: StatsSummaryCardsProps) {
  const { t } = useTranslation('common');
  const { data: stats, isLoading } = useCooperativeStats(country);

  const cards = [
    ...(country === 'laos' ? [{
      label: t('total_cooperatives'),
      value: stats?.cooperatives ?? 0,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      tab: 'cooperatives',
    }] : []),
    {
      label: t('total_farmers'),
      value: stats?.farmers ?? 0,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      tab: 'farmers',
    },
    {
      label: t('total_farms'),
      value: stats?.farms ?? 0,
      icon: Sprout,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      tab: 'farms',
    },
    {
      label: t('total_area'),
      value: `${stats?.totalArea ?? 0} ha`,
      icon: MapPin,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      tab: 'farms',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: country === 'laos' ? 4 : 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 ${country === 'laos' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 mb-6`}>
      {cards.map((card) => {
        const Icon = card.icon;
        const clickable = !!onCardClick;
        return (
          <Card
            key={card.label}
            className={clickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group' : ''}
            onClick={clickable ? () => onCardClick(card.tab) : undefined}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${card.bg} ${clickable ? 'group-hover:scale-110 transition-transform' : ''}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
