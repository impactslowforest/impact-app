import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Users, Sprout, Factory } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsSummaryCards } from '../components/StatsSummaryCards';
import { CooperativeTab } from '../components/CooperativeTab';
import { FarmerTab } from '../components/FarmerTab';
import { FarmTab } from '../components/FarmTab';
import { ProcessingTab } from '../components/ProcessingTab';

interface CooperativeManagementProps {
  country?: string;
}

type TabKey = 'cooperatives' | 'farmers' | 'farms' | 'processing';

export function CooperativeManagement({ country = 'laos' }: CooperativeManagementProps) {
  const { t } = useTranslation('common');
  const showCoopTab = country === 'laos';

  const [activeTab, setActiveTab] = useState<TabKey>(showCoopTab ? 'cooperatives' : 'farmers');

  // Drill-down state: Cooperative → Farmer → Farm
  const [selectedCoopId, setSelectedCoopId] = useState<string | null>(null);
  const [selectedCoopName, setSelectedCoopName] = useState<string | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [selectedFarmerName, setSelectedFarmerName] = useState<string | null>(null);

  // Drill-down handlers
  const handleSelectCooperative = (coopId: string, coopName: string) => {
    setSelectedCoopId(coopId);
    setSelectedCoopName(coopName);
    setSelectedFarmerId(null);
    setSelectedFarmerName(null);
    setActiveTab('farmers');
  };

  const handleSelectFarmer = (farmerId: string, farmerName: string) => {
    setSelectedFarmerId(farmerId);
    setSelectedFarmerName(farmerName);
    setActiveTab('farms');
  };

  const handleViewProcessing = (farmerId: string, farmerName: string) => {
    setSelectedFarmerId(farmerId);
    setSelectedFarmerName(farmerName);
    setActiveTab('processing');
  };

  const handleClearCoopFilter = () => {
    setSelectedCoopId(null);
    setSelectedCoopName(null);
  };

  const handleClearFarmerFilter = () => {
    setSelectedFarmerId(null);
    setSelectedFarmerName(null);
  };

  const tabCount = showCoopTab ? 4 : 3;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('cooperative_management_title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {country === 'laos' ? 'Laos' : country === 'vietnam' ? 'Vietnam' : 'Indonesia'}
        </p>
      </div>

      {/* Stats Cards */}
      <StatsSummaryCards country={country} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabCount}, 1fr)` }}>
          {showCoopTab && (
            <TabsTrigger value="cooperatives" className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('cooperatives_tab')}</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="farmers" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('farmers_tab')}</span>
          </TabsTrigger>
          <TabsTrigger value="farms" className="flex items-center gap-1.5">
            <Sprout className="h-4 w-4" />
            <span className="hidden sm:inline">{t('farms_tab')}</span>
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex items-center gap-1.5">
            <Factory className="h-4 w-4" />
            <span className="hidden sm:inline">{t('processing_tab', 'Processing')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Cooperative Tab (Laos only) */}
        {showCoopTab && (
          <TabsContent value="cooperatives">
            <CooperativeTab
              country={country}
              onSelectCooperative={handleSelectCooperative}
            />
          </TabsContent>
        )}

        {/* Farmers Tab */}
        <TabsContent value="farmers">
          <FarmerTab
            country={country}
            cooperativeFilter={selectedCoopId}
            cooperativeName={selectedCoopName}
            onSelectFarmer={handleSelectFarmer}
            onViewProcessing={handleViewProcessing}
            onClearCooperativeFilter={handleClearCoopFilter}
          />
        </TabsContent>

        {/* Farms Tab */}
        <TabsContent value="farms">
          <FarmTab
            country={country}
            farmerFilter={selectedFarmerId}
            farmerName={selectedFarmerName}
            onViewProcessing={handleViewProcessing}
            onClearFarmerFilter={handleClearFarmerFilter}
          />
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing">
          <ProcessingTab
            country={country}
            farmerId={selectedFarmerId}
            farmerName={selectedFarmerName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CooperativeManagement;
