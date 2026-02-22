import { useTranslation } from 'react-i18next';
import { Package, Leaf, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFarmOpsStats } from '../hooks/useFarmOpsData';

interface FarmOpsStatsCardsProps {
    country: string;
}

export function FarmOpsStatsCards({ country }: FarmOpsStatsCardsProps) {
    const { t } = useTranslation('common');
    const { data, isLoading } = useFarmOpsStats(country);

    const stats = [
        { key: 'farmInputs', label: t('farm_inputs_stat', 'Farm Inputs'), icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
        { key: 'envAssessments', label: t('env_assessments_stat', 'Env. Assessments'), icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
        { key: 'productionRecords', label: t('production_records_stat', 'Production Records'), icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {stats.map(({ key, label, icon: Icon, color, bg }) => (
                <Card key={key} className="rounded-xl">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${bg}`}>
                            <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-12" />
                            ) : (
                                <p className="text-xl font-bold text-gray-900">
                                    {(data as Record<string, number>)?.[key] ?? 0}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
