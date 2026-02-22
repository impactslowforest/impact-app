import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, FlaskConical, BarChart3, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FarmInputTab } from '../components/FarmInputTab';
import { EnvironmentTab } from '../components/EnvironmentTab';
import { ProductionTab } from '../components/ProductionTab';
import { FarmOpsStatsCards } from '../components/FarmOpsStatsCards';

interface FarmOperationsPageProps {
    country?: string;
}

type TabKey = 'inputs' | 'environment' | 'production';

export function FarmOperationsPage({ country = 'laos' }: FarmOperationsPageProps) {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState<TabKey>('inputs');

    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {t('farm_operations_title', 'Farm Operations')}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {country === 'laos' ? 'Laos' : country === 'vietnam' ? 'Vietnam' : 'Indonesia'}
                </p>
            </div>

            {/* Stats Cards */}
            <FarmOpsStatsCards country={country} />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="inputs" className="flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('farm_inputs_tab', 'Farm Inputs')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="environment" className="flex items-center gap-1.5">
                        <Leaf className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('environment_tab', 'Environment')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="production" className="flex items-center gap-1.5">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('production_tab', 'Production')}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inputs">
                    <FarmInputTab country={country} />
                </TabsContent>

                <TabsContent value="environment">
                    <EnvironmentTab country={country} />
                </TabsContent>

                <TabsContent value="production">
                    <ProductionTab country={country} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default FarmOperationsPage;
