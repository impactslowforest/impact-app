import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Baby, Users, Heart, ClipboardList, UtensilsCrossed } from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';
import ChartCard from '@/components/shared/ChartCard';
import { ROUTES } from '@/config/routes';
import pb from '@/config/pocketbase';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export default function DaycareKpiDashboard() {
  const { t } = useTranslation('nav');
  const navigate = useNavigate();

  const { data: kidsCount = 0 } = useQuery({
    queryKey: ['kpi-dc-kids'],
    queryFn: async () => {
      const r = await pb.collection('dc_kids').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: familyCount = 0 } = useQuery({
    queryKey: ['kpi-dc-families'],
    queryFn: async () => {
      const r = await pb.collection('dc_families').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: attendanceCount = 0 } = useQuery({
    queryKey: ['kpi-dc-attendance'],
    queryFn: async () => {
      const r = await pb.collection('dc_attendance').getList(1, 1);
      return r.totalItems;
    },
  });

  const { data: healthChecks = [] } = useQuery({
    queryKey: ['kpi-dc-health'],
    queryFn: async () => {
      const r = await pb.collection('dc_health_checks').getFullList({
        fields: 'waz_assessment,haz_assessment,whz_assessment,baz_assessment',
        sort: '-measure_date',
      });
      return r;
    },
  });

  const { data: studyCount = 0 } = useQuery({
    queryKey: ['kpi-dc-studies'],
    queryFn: async () => {
      const r = await pb.collection('dc_kid_studies').getList(1, 1);
      return r.totalItems;
    },
  });

  // Build health assessment distribution chart
  const assessmentCounts: Record<string, number> = {};
  for (const hc of healthChecks) {
    const a = hc.waz_assessment || 'Unknown';
    assessmentCounts[a] = (assessmentCounts[a] || 0) + 1;
  }
  const healthPieData = Object.entries(assessmentCounts).map(([name, value]) => ({ name, value }));

  // Build HAZ distribution
  const hazCounts: Record<string, number> = {};
  for (const hc of healthChecks) {
    const a = hc.haz_assessment || 'Unknown';
    hazCounts[a] = (hazCounts[a] || 0) + 1;
  }
  const hazBarData = Object.entries(hazCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{t('daycare_kpi', 'Daycare Center KPI Dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <button className="text-left" onClick={() => navigate(ROUTES.LA_DC_KIDS)}>
          <KpiCard title={t('total_kids', 'Total Kids')} value={kidsCount} icon={Baby} color="text-pink-600" />
        </button>
        <button className="text-left" onClick={() => navigate(ROUTES.LA_DC_FAMILIES)}>
          <KpiCard title={t('families', 'Families')} value={familyCount} icon={Users} color="text-blue-600" />
        </button>
        <button className="text-left" onClick={() => navigate(ROUTES.LA_DC_ATTENDANCE)}>
          <KpiCard title={t('attendance_records', 'Attendance Records')} value={attendanceCount.toLocaleString()} icon={ClipboardList} color="text-green-600" />
        </button>
        <button className="text-left" onClick={() => navigate(ROUTES.LA_DC_HEALTH)}>
          <KpiCard title={t('health_checks', 'Health Checks')} value={healthChecks.length} icon={Heart} color="text-red-600" />
        </button>
        <button className="text-left" onClick={() => navigate(ROUTES.LA_DC_STUDIES)}>
          <KpiCard title={t('study_records', 'Study Records')} value={studyCount.toLocaleString()} icon={UtensilsCrossed} color="text-purple-600" />
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={t('waz_distribution', 'Weight-for-Age Assessment')}
          data={healthPieData}
          dataKey="value"
          colors={COLORS}
          height={300}
          defaultType="pie"
          noDataText={t('no_data', 'No data available')}
        />
        <ChartCard
          title={t('haz_distribution', 'Height-for-Age Distribution')}
          data={hazBarData}
          dataKey="count"
          barFill="#3b82f6"
          colors={COLORS}
          height={300}
          defaultType="bar"
          noDataText={t('no_data', 'No data available')}
        />
      </div>
    </div>
  );
}
