import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, TreePine } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ComplianceTab } from '../components/ComplianceTab';
import { EcosystemTab } from '../components/EcosystemTab';
import { useDoNoHarmStats } from '../../farm-operations/hooks/useFarmOpsData';

interface DoNoHarmPageProps {
    country?: string;
}

export function DoNoHarmPage({ country = 'laos' }: DoNoHarmPageProps) {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState<'compliance' | 'ecosystem'>('compliance');
    const { data: stats, isLoading } = useDoNoHarmStats(country);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('do_no_harm_title', 'Do No Harm')}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {country === 'laos' ? 'Laos' : country === 'vietnam' ? 'Vietnam' : 'Indonesia'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Card className="rounded-xl">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50"><ShieldCheck className="h-5 w-5 text-indigo-600" /></div>
                        <div>
                            {isLoading ? <Skeleton className="h-6 w-12" /> : <p className="text-xl font-bold">{stats?.complianceRecords ?? 0}</p>}
                            <p className="text-xs text-muted-foreground">{t('compliance_records_stat', 'Compliance Records')}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-50"><TreePine className="h-5 w-5 text-emerald-600" /></div>
                        <div>
                            {isLoading ? <Skeleton className="h-6 w-12" /> : <p className="text-xl font-bold">{stats?.ecosystemAssessments ?? 0}</p>}
                            <p className="text-xs text-muted-foreground">{t('ecosystem_stat', 'Ecosystem Assessments')}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'compliance' | 'ecosystem')}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compliance" className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('compliance_tab', 'Compliance')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="ecosystem" className="flex items-center gap-1.5">
                        <TreePine className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('ecosystem_tab', 'Ecosystem')}</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="compliance"><ComplianceTab country={country} /></TabsContent>
                <TabsContent value="ecosystem"><EcosystemTab country={country} /></TabsContent>
            </Tabs>
        </div>
    );
}

export default DoNoHarmPage;
