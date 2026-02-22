import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Users, TreePine, FileCheck, ClipboardCheck } from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';
import ChartCard from '@/components/shared/ChartCard';
import { ROUTES } from '@/config/routes';
import pb from '@/config/pocketbase';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function RaAuditKpiDashboard() {
  const { t } = useTranslation('nav');
  const navigate = useNavigate();

  const { data: farmerCount = 0 } = useQuery({
    queryKey: ['kpi-ra-farmers'],
    queryFn: async () => {
      const r = await pb.collection('ra_farmer_inspections').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: farmCount = 0 } = useQuery({
    queryKey: ['kpi-ra-farms'],
    queryFn: async () => {
      const r = await pb.collection('ra_farm_inspections').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: speciesCount = 0 } = useQuery({
    queryKey: ['kpi-ra-species'],
    queryFn: async () => {
      const r = await pb.collection('ra_species_index').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: certCount = 0 } = useQuery({
    queryKey: ['kpi-ra-certs'],
    queryFn: async () => {
      const r = await pb.collection('ra_certificates').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: treeData = [] } = useQuery({
    queryKey: ['kpi-ra-tree-ratings'],
    queryFn: async () => {
      return await pb.collection('ra_tree_index').getFullList({
        fields: 'ao4_health_rating,ao5_disease_rating,ao6_pruning_rating',
      });
    },
  });

  const { data: farmInspections = [] } = useQuery({
    queryKey: ['kpi-ra-farm-area'],
    queryFn: async () => {
      return await pb.collection('ra_farm_inspections').getFullList({
        fields: 'farm_area_ha,land_certificate',
      });
    },
  });

  // Tree health rating distribution
  const healthRatings: Record<string, number> = {};
  for (const td of treeData) {
    const rating = td.ao4_health_rating || 0;
    const key = rating >= 4 ? 'Good (4-5)' : rating >= 2 ? 'Fair (2-3)' : 'Poor (0-1)';
    healthRatings[key] = (healthRatings[key] || 0) + 1;
  }
  const healthPieData = Object.entries(healthRatings).map(([name, value]) => ({ name, value }));

  // Land certificate distribution
  const certTypes: Record<string, number> = {};
  for (const fi of farmInspections) {
    const c = fi.land_certificate || 'Unknown';
    certTypes[c] = (certTypes[c] || 0) + 1;
  }
  const certBarData = Object.entries(certTypes).map(([name, count]) => ({ name, count }));

  const totalArea = farmInspections.reduce((s, f) => s + (f.farm_area_ha || 0), 0);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{t('ra_audit_kpi', 'RA Internal Audit KPI Dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard title={t('farmers_inspected', 'Farmers Inspected')} value={farmerCount} icon={Users} color="text-green-600" onClick={() => navigate(ROUTES.ID_RA_FARMERS)} />
        <KpiCard title={t('farms_inspected', 'Farms Inspected')} value={farmCount} icon={TreePine} color="text-emerald-600" onClick={() => navigate(ROUTES.ID_RA_FARMS)} />
        <KpiCard title={t('species_recorded', 'Species Recorded')} value={speciesCount} icon={TreePine} color="text-teal-600" onClick={() => navigate(ROUTES.ID_RA_SPECIES)} />
        <KpiCard title={t('certificates', 'Certificates')} value={certCount} icon={FileCheck} color="text-blue-600" onClick={() => navigate(ROUTES.ID_RA_CERTIFICATES)} />
        <KpiCard title={t('total_area_ha', 'Total Area (ha)')} value={totalArea.toFixed(1)} icon={ClipboardCheck} color="text-purple-600" onClick={() => navigate(ROUTES.ID_RA_FARMS)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={t('tree_health', 'Tree Health Rating Distribution')}
          data={healthPieData}
          dataKey="value"
          colors={COLORS}
          height={360}
          defaultType="pie"
          noDataText={t('no_data', 'No data available')}
        />
        <ChartCard
          title={t('land_certificates', 'Land Certificate Types')}
          data={certBarData}
          dataKey="count"
          barFill="#22c55e"
          colors={COLORS}
          height={360}
          defaultType="bar"
          noDataText={t('no_data', 'No data available')}
        />
      </div>
    </div>
  );
}
