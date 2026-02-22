import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Building2, ClipboardList, DollarSign, Bean, FileCheck } from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';
import ChartCard from '@/components/shared/ChartCard';
import { ROUTES } from '@/config/routes';
import pb from '@/config/pocketbase';

const COLORS = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6'];

export default function CocoaKpiDashboard() {
  const { t } = useTranslation('nav');
  const navigate = useNavigate();

  const { data: groupCount = 0 } = useQuery({
    queryKey: ['kpi-cocoa-groups'],
    queryFn: async () => {
      const r = await pb.collection('id_farmer_groups').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: batchCount = 0 } = useQuery({
    queryKey: ['kpi-cocoa-batches'],
    queryFn: async () => {
      const r = await pb.collection('id_cocoa_batches').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: contractCount = 0 } = useQuery({
    queryKey: ['kpi-cocoa-contracts'],
    queryFn: async () => {
      const r = await pb.collection('id_farmer_contracts').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: recaps = [] } = useQuery({
    queryKey: ['kpi-cocoa-recaps'],
    queryFn: async () => {
      return await pb.collection('id_cocoa_recaps').getFullList({
        fields: 'farm_id_text,sold_to_krakakoa,sold_to_others,quota,remaining',
      });
    },
  });

  const { data: batchDetails = [] } = useQuery({
    queryKey: ['kpi-cocoa-batch-details'],
    queryFn: async () => {
      return await pb.collection('id_cocoa_batch_details').getFullList({
        fields: 'cocoa_clone,wet_beans_kg,total_premium_amount',
      });
    },
  });

  // Aggregate recap data
  const totalSoldKrakakoa = recaps.reduce((s, r) => s + (r.sold_to_krakakoa || 0), 0);
  const totalSoldOthers = recaps.reduce((s, r) => s + (r.sold_to_others || 0), 0);
  const totalQuota = recaps.reduce((s, r) => s + (r.quota || 0), 0);

  const salesPieData = [
    { name: 'Sold to Krakakoa', value: Math.round(totalSoldKrakakoa) },
    { name: 'Sold to Others', value: Math.round(totalSoldOthers) },
    { name: 'Remaining Quota', value: Math.round(totalQuota - totalSoldKrakakoa - totalSoldOthers) },
  ].filter(d => d.value > 0);

  // Clone distribution
  const cloneCounts: Record<string, number> = {};
  for (const bd of batchDetails) {
    const c = bd.cocoa_clone || 'Unknown';
    cloneCounts[c] = (cloneCounts[c] || 0) + (bd.wet_beans_kg || 0);
  }
  const cloneBarData = Object.entries(cloneCounts).map(([name, kg]) => ({ name, kg: Math.round(kg) }));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{t('cocoa_kpi', 'Cocoa Purchase KPI Dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard title={t('farmer_groups', 'Farmer Groups')} value={groupCount} icon={Building2} color="text-green-600" onClick={() => navigate(ROUTES.ID_COCOA_GROUPS)} />
        <KpiCard title={t('batches', 'Batches')} value={batchCount} icon={ClipboardList} color="text-amber-600" onClick={() => navigate(ROUTES.ID_COCOA_BATCHES)} />
        <KpiCard title={t('contracts', 'Contracts')} value={contractCount} icon={FileCheck} color="text-blue-600" onClick={() => navigate(ROUTES.ID_COCOA_CONTRACTS)} />
        <KpiCard title={t('total_sold_kg', 'Total Sold (kg)')} value={Math.round(totalSoldKrakakoa + totalSoldOthers).toLocaleString()} icon={Bean} color="text-orange-600" onClick={() => navigate(ROUTES.ID_COCOA_RECAPS)} />
        <KpiCard title={t('total_quota_kg', 'Total Quota (kg)')} value={Math.round(totalQuota).toLocaleString()} icon={DollarSign} color="text-purple-600" onClick={() => navigate(ROUTES.ID_COCOA_PRICES)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={t('sales_distribution', 'Sales Distribution')}
          data={salesPieData}
          dataKey="value"
          colors={COLORS}
          height={360}
          defaultType="pie"
          noDataText={t('no_data', 'No data available')}
        />
        <ChartCard
          title={t('clone_volume', 'Volume by Clone Type (kg)')}
          data={cloneBarData}
          dataKey="kg"
          barFill="#f59e0b"
          colors={COLORS}
          height={360}
          defaultType="bar"
          noDataText={t('no_data', 'No data available')}
        />
      </div>
    </div>
  );
}
