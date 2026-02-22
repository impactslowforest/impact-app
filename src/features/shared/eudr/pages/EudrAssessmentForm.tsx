import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck, CheckCircle2, XCircle, Loader2, Minus,
  ChevronDown, FileText, MapPin, TreePine, Truck,
  Users, Leaf, ClipboardCheck, Save, ArrowLeft,
  User, Sprout, Phone, Home, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ROUTES } from '@/config/routes';

type CheckValue = 'compliant' | 'non_compliant' | 'na' | 'unset';

interface CheckItem {
  name: string;
  labelKey: string;
  section: string;
}

// ─── Comprehensive EUDR Checklist ───
// Based on: Check list_Dec24.xlsx template, EU Regulation 2023/1115

const ASSESSMENT_CHECKS: CheckItem[] = [
  // Section 1: Ownership & Legal Documentation
  { name: 'ownership_documented', labelKey: 'chk_ownership_documented', section: 'ownership' },
  { name: 'ownership_no_disputes', labelKey: 'chk_ownership_no_disputes', section: 'ownership' },
  { name: 'management_clearly_defined', labelKey: 'chk_management_defined', section: 'ownership' },
  { name: 'management_legal_compliance', labelKey: 'chk_management_legal', section: 'ownership' },
  { name: 'certification_participation', labelKey: 'chk_certification', section: 'ownership' },
  { name: 'environmental_commitments', labelKey: 'chk_env_commitments', section: 'ownership' },
  { name: 'buffer_zone_maintained', labelKey: 'chk_buffer_zone', section: 'ownership' },

  // Section 2: Geolocation & Plot Mapping
  { name: 'gps_coordinates_available', labelKey: 'chk_gps_available', section: 'geolocation' },
  { name: 'gps_regularly_updated', labelKey: 'chk_gps_updated', section: 'geolocation' },
  { name: 'polygon_mapping_done', labelKey: 'chk_polygon_done', section: 'geolocation' },
  { name: 'plot_boundary_clear', labelKey: 'chk_boundary_clear', section: 'geolocation' },
  { name: 'area_changes_documented', labelKey: 'chk_area_changes', section: 'geolocation' },
  { name: 'no_expansion_post2020', labelKey: 'chk_no_expansion', section: 'geolocation' },

  // Section 3: Deforestation & Land Use
  { name: 'no_deforestation_after_dec2020', labelKey: 'chk_no_deforestation', section: 'deforestation' },
  { name: 'no_forest_degradation', labelKey: 'chk_no_degradation', section: 'deforestation' },
  { name: 'no_burning_activities', labelKey: 'chk_no_burning', section: 'deforestation' },
  { name: 'no_illegal_logging', labelKey: 'chk_no_illegal_logging', section: 'deforestation' },
  { name: 'no_land_use_conversion', labelKey: 'chk_no_conversion', section: 'deforestation' },
  { name: 'legal_land_use', labelKey: 'chk_legal_land_use', section: 'deforestation' },
  { name: 'silvicultural_documented', labelKey: 'chk_silvicultural', section: 'deforestation' },

  // Section 4: Traceability & Supply Chain
  { name: 'supply_chain_documented', labelKey: 'chk_supply_chain', section: 'traceability' },
  { name: 'product_segregation', labelKey: 'chk_segregation', section: 'traceability' },
  { name: 'due_diligence_completed', labelKey: 'chk_due_diligence', section: 'traceability' },
  { name: 'traceability_to_plot', labelKey: 'chk_traceability_plot', section: 'traceability' },

  // Section 5: Human Rights & Labor
  { name: 'no_forced_labor', labelKey: 'chk_no_forced_labor', section: 'human_rights' },
  { name: 'no_child_labor', labelKey: 'chk_no_child_labor', section: 'human_rights' },
  { name: 'fair_compensation', labelKey: 'chk_fair_compensation', section: 'human_rights' },
  { name: 'indigenous_rights_respected', labelKey: 'chk_indigenous_rights', section: 'human_rights' },
  { name: 'land_tenure_documented', labelKey: 'chk_land_tenure', section: 'human_rights' },
  { name: 'fpic_obtained', labelKey: 'chk_fpic', section: 'human_rights' },

  // Section 6: Environmental Protection
  { name: 'biodiversity_assessed', labelKey: 'chk_biodiversity', section: 'environmental' },
  { name: 'water_sources_protected', labelKey: 'chk_water_protected', section: 'environmental' },
  { name: 'soil_conservation', labelKey: 'chk_soil_conservation', section: 'environmental' },
  { name: 'erosion_control', labelKey: 'chk_erosion_control', section: 'environmental' },
  { name: 'pesticide_management', labelKey: 'chk_pesticide', section: 'environmental' },
  { name: 'waste_management', labelKey: 'chk_waste', section: 'environmental' },
];

const SECTIONS = [
  { key: 'ownership', labelKey: 'sec_ownership', icon: FileText, color: 'text-amber-700', borderColor: 'border-l-amber-500', bg: 'bg-amber-50', headerBg: 'bg-amber-100/60' },
  { key: 'geolocation', labelKey: 'sec_geolocation', icon: MapPin, color: 'text-blue-700', borderColor: 'border-l-blue-500', bg: 'bg-blue-50', headerBg: 'bg-blue-100/60' },
  { key: 'deforestation', labelKey: 'sec_deforestation', icon: TreePine, color: 'text-red-700', borderColor: 'border-l-red-500', bg: 'bg-red-50', headerBg: 'bg-red-100/60' },
  { key: 'traceability', labelKey: 'sec_traceability', icon: Truck, color: 'text-indigo-700', borderColor: 'border-l-indigo-500', bg: 'bg-indigo-50', headerBg: 'bg-indigo-100/60' },
  { key: 'human_rights', labelKey: 'sec_human_rights', icon: Users, color: 'text-purple-700', borderColor: 'border-l-purple-500', bg: 'bg-purple-50', headerBg: 'bg-purple-100/60' },
  { key: 'environmental', labelKey: 'sec_environmental', icon: Leaf, color: 'text-green-700', borderColor: 'border-l-green-500', bg: 'bg-green-50', headerBg: 'bg-green-100/60' },
];

function TriStateButton({
  value,
  onChange,
  t,
}: {
  value: CheckValue;
  onChange: (v: CheckValue) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onChange(value === 'compliant' ? 'unset' : 'compliant')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
          value === 'compliant'
            ? 'bg-green-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'
        }`}
      >
        {t('comply')}
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'non_compliant' ? 'unset' : 'non_compliant')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
          value === 'non_compliant'
            ? 'bg-red-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-700'
        }`}
      >
        {t('non_comply')}
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'na' ? 'unset' : 'na')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
          value === 'na'
            ? 'bg-gray-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        N/A
      </button>
    </div>
  );
}

export default function EudrAssessmentPage() {
  const { plotId } = useParams<{ plotId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [checks, setChecks] = useState<Record<string, CheckValue>>(() => {
    const initial: Record<string, CheckValue> = {};
    ASSESSMENT_CHECKS.forEach(c => { initial[c.name] = 'unset'; });
    return initial;
  });
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [sectionNotes, setSectionNotes] = useState<Record<string, string>>({});
  const [risk, setRisk] = useState<string>('none');
  const [compliance, setCompliance] = useState<string>('pending');
  const [notes, setNotes] = useState('');
  const [correctiveActions, setCorrectiveActions] = useState('');
  const [nextReview, setNextReview] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(SECTIONS.map(s => s.key))
  );
  const [declarantName, setDeclarantName] = useState('');
  const [declarantId, setDeclarantId] = useState('');

  const { data: plot } = useQuery({
    queryKey: ['eudr-plot', plotId],
    queryFn: () => pb.collection('eudr_plots').getOne(plotId!, { expand: 'farmer' }),
    enabled: !!plotId,
  });

  // Linked farmer profile from the relation (or fallback lookup by farmer_id code)
  const { data: linkedFarmer } = useQuery({
    queryKey: ['eudr-linked-farmer', plot?.farmer, plot?.farmer_id],
    queryFn: async () => {
      if (!plot) return null;
      // Use the farmer relation if available
      if ((plot.expand as any)?.farmer) return (plot.expand as any).farmer;
      // Fallback: lookup by farmer_id code
      if (plot.farmer_id) {
        try {
          const r = await pb.collection('farmers').getList(1, 1, {
            filter: `farmer_code = "${plot.farmer_id}" || id_card_number = "${plot.farmer_id}"`,
          });
          if (r.items.length > 0) return r.items[0];
        } catch { /* ignore */ }
      }
      return null;
    },
    enabled: !!plot,
  });

  // Linked farms for that farmer
  const { data: linkedFarms = [] } = useQuery({
    queryKey: ['eudr-linked-farms', linkedFarmer?.id],
    queryFn: async () => {
      if (!linkedFarmer) return [];
      const r = await pb.collection('farms').getList(1, 10, {
        filter: `farmer = "${linkedFarmer.id}"`,
      });
      return r.items;
    },
    enabled: !!linkedFarmer,
  });

  const goBack = () => navigate(-1);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const boolChecks: Record<string, boolean> = {};
      for (const [key, val] of Object.entries(checks)) {
        boolChecks[key] = val === 'compliant';
      }

      const assessment = await pb.collection('eudr_assessments').create({
        plot: plotId,
        assessment_date: new Date().toISOString(),
        assessor: user?.id,
        deforestation_risk: risk,
        overall_compliance: compliance,
        notes,
        corrective_actions: correctiveActions,
        next_review_date: nextReview || undefined,
        section_notes: JSON.stringify(sectionNotes),
        item_notes: JSON.stringify(itemNotes),
        check_values: JSON.stringify(checks),
        declarant_name: declarantName,
        declarant_id: declarantId,
        ...boolChecks,
      });

      const statusMap: Record<string, string> = {
        compliant: 'compliant',
        non_compliant: 'non_compliant',
        needs_improvement: 'assessed',
        pending: 'pending_review',
      };
      await pb.collection('eudr_plots').update(plotId!, {
        status: statusMap[compliance] || 'assessed',
      });

      return assessment;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['eudr-plots'] });
      await queryClient.invalidateQueries({ queryKey: ['eudr-stats'] });
      toast.success(t('assessment_saved'));
      goBack();
    },
    onError: () => toast.error(t('error')),
  });

  const setCheck = (name: string, value: CheckValue) => {
    setChecks(prev => ({ ...prev, [name]: value }));
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Count compliant items
  const compliantCount = Object.values(checks).filter(v => v === 'compliant').length;
  const nonCompliantCount = Object.values(checks).filter(v => v === 'non_compliant').length;
  const naCount = Object.values(checks).filter(v => v === 'na').length;
  const answeredCount = compliantCount + nonCompliantCount + naCount;
  const totalChecks = ASSESSMENT_CHECKS.length;
  const complianceRate = (answeredCount - naCount) > 0
    ? Math.round((compliantCount / (answeredCount - naCount)) * 100)
    : 0;

  const getSectionProgress = (sectionKey: string) => {
    const sectionChecks = ASSESSMENT_CHECKS.filter(c => c.section === sectionKey);
    const sCompliant = sectionChecks.filter(c => checks[c.name] === 'compliant').length;
    const sNonCompliant = sectionChecks.filter(c => checks[c.name] === 'non_compliant').length;
    const sNa = sectionChecks.filter(c => checks[c.name] === 'na').length;
    const sAnswered = sCompliant + sNonCompliant + sNa;
    return {
      compliant: sCompliant,
      nonCompliant: sNonCompliant,
      na: sNa,
      answered: sAnswered,
      total: sectionChecks.length,
    };
  };

  const autoCompliance = () => {
    if (nonCompliantCount === 0 && compliantCount > 0) return 'compliant';
    if (complianceRate >= 80) return 'needs_improvement';
    if (complianceRate >= 50) return 'needs_improvement';
    return 'non_compliant';
  };

  const autoRisk = () => {
    const deforestChecks = ASSESSMENT_CHECKS.filter(c => c.section === 'deforestation');
    const deforestCompliant = deforestChecks.filter(c => checks[c.name] === 'compliant').length;
    const deforestPct = deforestChecks.length > 0 ? (deforestCompliant / deforestChecks.length) * 100 : 0;
    if (deforestPct === 100) return 'none';
    if (deforestPct >= 80) return 'low';
    if (deforestPct >= 50) return 'medium';
    return 'high';
  };

  const getItemNumber = (check: CheckItem) => {
    const sectionIdx = SECTIONS.findIndex(s => s.key === check.section);
    const sectionChecks = ASSESSMENT_CHECKS.filter(c => c.section === check.section);
    const itemIdx = sectionChecks.indexOf(check);
    return `${sectionIdx + 1}.${itemIdx + 1}`;
  };

  if (!plotId) {
    navigate(ROUTES.IMPACT_EUDR, { replace: true });
    return null;
  }

  return (
    <div className="page-enter">
      {/* ─── Sticky Top Header ─── */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm -mx-6 -mt-6 px-6 py-4 mb-6">
        <div className="flex items-center gap-4 mb-3">
          <Button variant="ghost" size="sm" onClick={goBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('back')}
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary-600" />
            <h1 className="text-lg font-bold text-primary-800">{t('eudr_assessment')}</h1>
          </div>
        </div>

        {plot && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
            <Badge variant="outline" className="font-mono font-bold">{plot.plot_code}</Badge>
            <span className="font-medium">{plot.plot_name}</span>
            <Badge variant="outline" className="capitalize">{plot.country}</Badge>
            {(plot.expand as any)?.farmer?.full_name && <span>— {(plot.expand as any).farmer.full_name}</span>}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-2.5 text-center">
            <div className="text-lg font-bold text-blue-700">{answeredCount}/{totalChecks}</div>
            <div className="text-[10px] text-blue-600 font-medium uppercase tracking-wide">{t('assessed')}</div>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-2.5 text-center">
            <div className="text-lg font-bold text-green-700">{compliantCount}</div>
            <div className="text-[10px] text-green-600 font-medium uppercase tracking-wide">{t('comply')}</div>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-center">
            <div className="text-lg font-bold text-red-700">{nonCompliantCount}</div>
            <div className="text-[10px] text-red-600 font-medium uppercase tracking-wide">{t('non_comply')}</div>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-2.5 text-center">
            <div className="text-lg font-bold text-gray-600">{naCount}</div>
            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">N/A</div>
          </div>
        </div>

        {/* Compliance Rate Bar */}
        {answeredCount > naCount && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{t('compliance_rate')}</span>
              <span className={`font-bold ${complianceRate >= 80 ? 'text-green-600' : complianceRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {complianceRate}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  complianceRate >= 80 ? 'bg-green-500' : complianceRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${complianceRate}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Linked Farmer & Farm Profile ─── */}
      {plot && (
        <div className="rounded-xl border-l-4 border-l-teal-500 border border-gray-200 overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-4 py-3 bg-teal-100/60">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-teal-50 text-teal-700">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-teal-700">{t('linked_farmer_profile', 'Farmer & Farm Profile')}</span>
              {linkedFarmer ? (
                <Badge className="ml-2 bg-green-100 text-green-700 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
                </Badge>
              ) : (
                <Badge className="ml-2 bg-gray-100 text-gray-500 text-[10px]">Unlinked</Badge>
              )}
            </div>
          </div>
          <div className="px-4 py-3 space-y-3">
            {linkedFarmer ? (
              <>
                {/* Farmer info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">{t('full_name', 'Full Name')}</span>
                    <div className="font-semibold text-gray-900">{linkedFarmer.full_name || '—'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('farmer_code', 'Farmer Code')}</span>
                    <div className="font-mono font-semibold">{linkedFarmer.farmer_code || '—'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('id_card', 'ID Card')}</span>
                    <div className="font-mono">{linkedFarmer.id_card_number || '—'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {t('phone', 'Phone')}</span>
                    <div>{linkedFarmer.phone_number || '—'}</div>
                  </div>
                </div>
                {/* Address with match indicator */}
                <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                  <Home className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="text-xs flex-1">
                    <div className="font-medium text-gray-700">
                      {[linkedFarmer.village_name, linkedFarmer.district, linkedFarmer.province].filter(Boolean).join(', ') || '—'}
                    </div>
                    {plot.province && linkedFarmer.province && (
                      <div className={`flex items-center gap-1 mt-1 ${
                        linkedFarmer.province?.toLowerCase() === plot.province?.toLowerCase()
                          ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {linkedFarmer.province?.toLowerCase() === plot.province?.toLowerCase() ? (
                          <><CheckCircle2 className="h-3 w-3" /> {t('address_match', 'Address matches plot location')}</>
                        ) : (
                          <><AlertTriangle className="h-3 w-3" /> {t('address_mismatch', 'Address does not match plot location')}</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Linked farms */}
                {linkedFarms.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                      <Sprout className="h-3.5 w-3.5" /> {t('linked_farms', 'Linked Farms')} ({linkedFarms.length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {linkedFarms.map((farm: Record<string, unknown>) => (
                        <div key={String(farm.id)} className="bg-white rounded-lg border border-gray-200 p-2 text-xs">
                          <div className="font-semibold text-gray-800">{String(farm.farm_name || farm.farm_code || '—')}</div>
                          <div className="flex items-center gap-3 mt-1 text-gray-500">
                            <span>{Number(farm.area_ha || 0).toFixed(1)} ha</span>
                            {farm.commodity && <span>{String(farm.commodity)}</span>}
                            {farm.certification_status && (
                              <Badge variant="outline" className="text-[10px] py-0">{String(farm.certification_status)}</Badge>
                            )}
                          </div>
                          {farm.latitude && farm.longitude && (
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              GPS: {Number(farm.latitude).toFixed(4)}, {Number(farm.longitude).toFixed(4)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {t('no_linked_farmer', 'No matching farmer found in the system. The plot farmer data has not been linked to a verified farmer record.')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Two-Column Layout ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Checklist Sections (2/3 width on XL) */}
        <div className="xl:col-span-2 space-y-4">
          {SECTIONS.map((section, sectionIdx) => {
            const prog = getSectionProgress(section.key);
            const isExpanded = expandedSections.has(section.key);
            const Icon = section.icon;
            const sectionChecks = ASSESSMENT_CHECKS.filter(c => c.section === section.key);

            return (
              <div key={section.key} className={`rounded-xl border-l-4 ${section.borderColor} border border-gray-200 overflow-hidden`}>
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left ${section.headerBg} transition-colors`}
                >
                  <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${section.bg} ${section.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">{sectionIdx + 1}</span>
                      <span className={`text-sm font-semibold ${section.color}`}>{t(section.labelKey)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="text-green-600">{prog.compliant} {t('comply')}</span>
                      {prog.nonCompliant > 0 && <span className="text-red-600">{prog.nonCompliant} {t('non_comply')}</span>}
                      {prog.na > 0 && <span className="text-gray-500">{prog.na} N/A</span>}
                      <span className="text-muted-foreground">{prog.answered}/{prog.total}</span>
                    </div>
                  </div>
                  {prog.answered === prog.total && prog.total > 0 && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  )}
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Section Items */}
                {isExpanded && (
                  <div className="p-3 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                      {sectionChecks.map((check) => {
                        const itemNum = getItemNumber(check);
                        const value = checks[check.name];
                        const hasNote = !!itemNotes[check.name];

                        return (
                          <div
                            key={check.name}
                            className={`rounded-lg border p-3 transition-all ${
                              value === 'compliant'
                                ? 'border-green-200 bg-green-50/50'
                                : value === 'non_compliant'
                                ? 'border-red-200 bg-red-50/50'
                                : value === 'na'
                                ? 'border-gray-200 bg-gray-50/50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <span className={`text-xs font-bold mt-0.5 shrink-0 ${
                                  value === 'compliant' ? 'text-green-600' :
                                  value === 'non_compliant' ? 'text-red-600' :
                                  'text-gray-400'
                                }`}>
                                  {itemNum}
                                </span>
                                <span className={`text-sm leading-snug ${
                                  value === 'compliant' ? 'text-green-800' :
                                  value === 'non_compliant' ? 'text-red-800' :
                                  'text-gray-700'
                                }`}>
                                  {t(check.labelKey)}
                                </span>
                              </div>
                              {value === 'compliant' && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
                              {value === 'non_compliant' && <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                              {value === 'na' && <Minus className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />}
                            </div>

                            <TriStateButton value={value} onChange={(v) => setCheck(check.name, v)} t={t} />

                            {(value === 'non_compliant' || hasNote) && (
                              <textarea
                                value={itemNotes[check.name] || ''}
                                onChange={(e) => setItemNotes(prev => ({ ...prev, [check.name]: e.target.value }))}
                                className="w-full mt-2 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs min-h-[36px] placeholder:text-muted-foreground/50 focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
                                placeholder={t('item_note_placeholder')}
                              />
                            )}

                            {value !== 'non_compliant' && !hasNote && value !== 'unset' && (
                              <button
                                type="button"
                                onClick={() => setItemNotes(prev => ({ ...prev, [check.name]: '' }))}
                                className="text-[10px] text-primary-600 hover:underline mt-1"
                              >
                                + {t('add_note')}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <textarea
                        value={sectionNotes[section.key] || ''}
                        onChange={(e) => setSectionNotes(prev => ({ ...prev, [section.key]: e.target.value }))}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-[44px] placeholder:text-muted-foreground/50 focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
                        placeholder={`${t('section_notes_placeholder')} - ${t(section.labelKey)}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Risk Assessment + Declaration (1/3 width on XL) */}
        <div className="space-y-4">
          {/* Risk & Compliance Assessment */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-primary-800">
                <ShieldCheck className="h-4 w-4" />
                {t('risk_assessment')}
              </h3>
            </div>
            <div className="p-4 space-y-4 bg-white">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('deforestation_risk')}</Label>
                  <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
                  >
                    <option value="none">{t('risk_none')}</option>
                    <option value="low">{t('risk_low')}</option>
                    <option value="medium">{t('risk_medium')}</option>
                    <option value="high">{t('risk_high')}</option>
                  </select>
                  <button
                    type="button"
                    className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                    onClick={() => setRisk(autoRisk())}
                  >
                    <ClipboardCheck className="h-3 w-3" />
                    {t('auto_suggest')}: {t(`risk_${autoRisk()}`)}
                  </button>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('overall_compliance')}</Label>
                  <select
                    value={compliance}
                    onChange={(e) => setCompliance(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="compliant">{t('compliant')}</option>
                    <option value="needs_improvement">{t('needs_improvement')}</option>
                    <option value="non_compliant">{t('non_compliant')}</option>
                  </select>
                  <button
                    type="button"
                    className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                    onClick={() => setCompliance(autoCompliance())}
                  >
                    <ClipboardCheck className="h-3 w-3" />
                    {t('auto_suggest')}: {t(autoCompliance())}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('notes')}</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm min-h-[70px] focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
                  placeholder={t('assessment_notes_placeholder')}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('corrective_actions')}</Label>
                <textarea
                  value={correctiveActions}
                  onChange={(e) => setCorrectiveActions(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm min-h-[50px] focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
                  placeholder={t('corrective_actions_placeholder')}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('next_review_date')}</Label>
                <Input
                  type="date"
                  value={nextReview}
                  onChange={(e) => setNextReview(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Declaration */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 overflow-hidden">
            <div className="bg-amber-100/60 px-4 py-3 border-b border-amber-200">
              <h3 className="font-semibold text-sm text-amber-800 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('declaration')}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-amber-700 leading-relaxed">
                {t('declaration_text')}
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-amber-800">{t('declarant_name')}</Label>
                  <Input
                    value={declarantName}
                    onChange={(e) => setDeclarantName(e.target.value)}
                    placeholder={t('full_name')}
                    className="rounded-lg border-amber-200 focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-amber-800">{t('declarant_id')}</Label>
                  <Input
                    value={declarantId}
                    onChange={(e) => setDeclarantId(e.target.value)}
                    placeholder={t('id_number')}
                    className="rounded-lg border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Centered Action Buttons */}
      <div className="flex justify-center gap-4 pt-6 mt-4 border-t">
        <Button variant="outline" className="rounded-lg px-8" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>
        <Button
          className="rounded-lg btn-3d-primary text-white px-8"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {t('save_assessment')}
        </Button>
      </div>
    </div>
  );
}
