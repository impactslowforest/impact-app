import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown, ChevronRight, ChevronLeft, Save, Loader2, ClipboardCheck,
  FileText, UserCheck, Sprout, Bug, ShieldAlert, BarChart3,
  Sun, Hand, CheckCircle2, Plus, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import {
  PROCESSING_QUESTIONS,
  PROCESSING_SECTIONS,
} from '../data/eu-organic-questions';
import { HierarchicalSelector } from '@/components/shared/HierarchicalSelector';

// ─── Types ───
type DocStatus = 'RC' | 'NC' | 'NA' | '';
type ComplianceValue = 'COM' | 'NC' | 'NA' | '';
type RiskLevel = 'none' | 'little' | 'moderate' | 'high' | '';
type ReviewResult = 'C1' | 'C2' | 'C3' | 'NC' | 'suspended' | 'pending' | '';

interface FarmInspection {
  farmId: string;
  farmName: string;
  landCertificate: boolean;
  location: string;
  totalAreaHa: string;
  productionSystem: string;
  organicConversionDate: string;
  plantSpecies: string;
  aExpectedKg: string;
  rExpectedKg: string;
  organicAreaHa: string;
  seedSource: string;
  seedQtyKg: string;
  fertilizerSource: string;
  fertQty1: string;
  fertQty2: string;
  fertQty3: string;
  fertQty4: string;
  fertQty5: string;
  growingCondition: string;
  hasDisease: boolean;
  diseaseDescription: string;
  pestMethod: string;
  herbalAgents: string;
  forbiddenChemical: boolean;
  forbiddenChemDesc: string;
  sharedSprayer: boolean;
  sharedSprayerCleaning: string;
  protectiveNorth: string;
  protectiveWest: string;
  protectiveEast: string;
  protectiveSouth: string;
  waterRisk: RiskLevel;
  airRisk: RiskLevel;
  toolsRisk: RiskLevel;
  highRiskDetail: string;
  inconsistencyDesc: string;
  hasImproved: boolean;
  improveSolution: string;
}

interface EuOrganicInspectionFormProps {
  country?: 'laos' | 'indonesia' | 'vietnam';
}

const COUNTRIES = [
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'laos', label: 'Laos' },
  { value: 'indonesia', label: 'Indonesia' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  ClipboardCheck, FileText, Sprout, Bug, ShieldAlert, BarChart3,
  Sun, Hand, ClipboardList: ClipboardCheck, UserCheck,
};

const emptyFarmInspection = (): FarmInspection => ({
  farmId: '',
  farmName: '',
  landCertificate: false,
  location: '',
  totalAreaHa: '',
  productionSystem: 'intercropping',
  organicConversionDate: '',
  plantSpecies: '',
  aExpectedKg: '',
  rExpectedKg: '',
  organicAreaHa: '',
  seedSource: '',
  seedQtyKg: '',
  fertilizerSource: '',
  fertQty1: '',
  fertQty2: '',
  fertQty3: '',
  fertQty4: '',
  fertQty5: '',
  growingCondition: '',
  hasDisease: false,
  diseaseDescription: '',
  pestMethod: 'none',
  herbalAgents: '',
  forbiddenChemical: false,
  forbiddenChemDesc: '',
  sharedSprayer: false,
  sharedSprayerCleaning: '',
  protectiveNorth: '',
  protectiveWest: '',
  protectiveEast: '',
  protectiveSouth: '',
  waterRisk: '',
  airRisk: '',
  toolsRisk: '',
  highRiskDetail: '',
  inconsistencyDesc: '',
  hasImproved: false,
  improveSolution: '',
});

function ComplianceButton({
  value,
  onChange,
}: {
  value: ComplianceValue;
  onChange: (v: ComplianceValue) => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onChange(value === 'COM' ? '' : 'COM')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${value === 'COM'
          ? 'bg-green-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-green-50'
          }`}
      >
        COM
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'NC' ? '' : 'NC')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${value === 'NC'
          ? 'bg-red-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-red-50'
          }`}
      >
        NC
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'NA' ? '' : 'NA')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${value === 'NA'
          ? 'bg-gray-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
      >
        N/A
      </button>
    </div>
  );
}

function DocStatusButton({
  value,
  onChange,
}: {
  value: DocStatus;
  onChange: (v: DocStatus) => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onChange(value === 'RC' ? '' : 'RC')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${value === 'RC'
          ? 'bg-green-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-green-50'
          }`}
      >
        RC
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'NC' ? '' : 'NC')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${value === 'NC'
          ? 'bg-red-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-red-50'
          }`}
      >
        NC
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'NA' ? '' : 'NA')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${value === 'NA'
          ? 'bg-gray-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
      >
        N/A
      </button>
    </div>
  );
}

export default function EuOrganicInspectionForm({ country: initialCountry }: EuOrganicInspectionFormProps) {
  const { t } = useTranslation(['common', 'certification']);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [country, setCountry] = useState<'laos' | 'indonesia' | 'vietnam' | ''>(
    (initialCountry && ['laos', 'indonesia', 'vietnam'].includes(initialCountry)) ? initialCountry : ''
  );
  // General info
  const [farmerId, setFarmerId] = useState('');
  const [farmerRecordId, setFarmerRecordId] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [inspectionDate, setInspectionDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [location, setLocation] = useState('');
  const [informant, setInformant] = useState('member');
  const [informantDetail, setInformantDetail] = useState('');

  // Documents (Section 2)
  const [docs, setDocs] = useState<Record<string, DocStatus>>({
    application_form: '',
    farm_history: '',
    production_plan: '',
    drawing: '',
    production_factors: '',
    previous_report: '',
    other: '',
    organic_standard: '',
  });

  // Production info (Section 3)
  const [productionSame, setProductionSame] = useState(true);
  const [productionChangeReason, setProductionChangeReason] = useState('');
  const [receivesFarmRent, setReceivesFarmRent] = useState(false);
  const [farmRentDetail, setFarmRentDetail] = useState('');

  // Animals (Section 4)
  const [numPoultry, setNumPoultry] = useState('');
  const [numPig, setNumPig] = useState('');
  const [numCow, setNumCow] = useState('');
  const [numBuffalo, setNumBuffalo] = useState('');

  // Farm inspections (multiple farms per farmer)
  const [farms, setFarms] = useState<FarmInspection[]>([emptyFarmInspection()]);
  const [activeFarmIdx, setActiveFarmIdx] = useState(0);

  // Processing Q&A (10-Index) - answers and compliance
  const [qaAnswers, setQaAnswers] = useState<Record<string, string>>({});
  const [qaNotes, setQaNotes] = useState<Record<string, string>>({});
  const [qaCompliance, setQaCompliance] = useState<Record<string, ComplianceValue>>({});
  const [qaExpanded, setQaExpanded] = useState<Set<string>>(
    new Set(PROCESSING_SECTIONS.map(s => s.key))
  );

  // Review
  const [inspectionType, setInspectionType] = useState('annual');
  const [lastYearComments, setLastYearComments] = useState('');
  const [inspectorSummary, setInspectorSummary] = useState('');
  const [reviewMemberName, setReviewMemberName] = useState('');
  const [reviewMemberId, setReviewMemberId] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [reviewResult, setReviewResult] = useState<ReviewResult>('pending');
  const [certifiedConditions, setCertifiedConditions] = useState('');
  const [certifiedAreaCrops, setCertifiedAreaCrops] = useState('');

  const setDoc = (key: string, val: DocStatus) => {
    setDocs(prev => ({ ...prev, [key]: val }));
  };

  const updateFarm = (idx: number, field: keyof FarmInspection, value: unknown) => {
    setFarms(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  };

  const addFarm = () => {
    setFarms(prev => [...prev, emptyFarmInspection()]);
    setActiveFarmIdx(farms.length);
  };

  const removeFarm = (idx: number) => {
    if (farms.length <= 1) return;
    setFarms(prev => prev.filter((_, i) => i !== idx));
    if (activeFarmIdx >= farms.length - 1) setActiveFarmIdx(Math.max(0, farms.length - 2));
  };

  const handleSave = async () => {
    // ── Comprehensive validation ──
    const missing: string[] = [];
    if (!country) missing.push(t('country', 'Country'));
    if (!farmerId.trim()) missing.push(t('farmer_id', 'Farmer ID'));
    if (!farmerName.trim()) missing.push(t('farmer_name', 'Farmer Name'));
    if (!inspectorName.trim()) missing.push(t('inspector_name', 'Inspector Name'));
    if (!inspectionDate) missing.push(t('inspection_date', 'Inspection Date'));

    // Check each farm has at least an ID
    farms.forEach((farm, idx) => {
      if (!farm.farmId.trim()) {
        missing.push(`${t('farm', 'Farm')} ${idx + 1}: ${t('farm_id', 'Farm ID')}`);
      }
    });

    if (missing.length > 0) {
      toast.error(
        <div>
          <p className="font-semibold mb-1">{t('fill_required_fields', 'Please fill in the required fields:')}</p>
          <ul className="list-disc pl-4 text-sm space-y-0.5">
            {missing.map((field, i) => (
              <li key={i}>{field}</li>
            ))}
          </ul>
        </div>,
        { duration: 6000 }
      );
      // Navigate to the tab with the first error
      if (!farmerId.trim() || !farmerName.trim() || !inspectorName.trim() || !inspectionDate) {
        setActiveTab('general');
      } else {
        setActiveTab('farms');
      }
      return;
    }

    // ── Helper: strip empty strings for PB select fields ──
    const cleanSelect = (val: string | undefined): string | undefined => {
      return val && val.trim() !== '' ? val : undefined;
    };

    setIsSaving(true);
    try {
      // 1. Save farmer-level inspection
      const inspectionRecord = await pb.collection('eu_organic_inspections').create({
        inspection_id: `INS-${Date.now()}`,
        country,
        farmer_id: farmerId.trim(),
        farmer: farmerRecordId || undefined,
        inspector: user?.id,
        inspection_date: inspectionDate,
        location: location || undefined,
        informant: cleanSelect(informant),
        informant_detail: informantDetail || undefined,
        doc_application_form: cleanSelect(docs.application_form),
        doc_farm_history: cleanSelect(docs.farm_history),
        doc_production_plan: cleanSelect(docs.production_plan),
        doc_drawing: cleanSelect(docs.drawing),
        doc_production_factors: cleanSelect(docs.production_factors),
        doc_previous_report: cleanSelect(docs.previous_report),
        doc_other: cleanSelect(docs.other),
        doc_organic_standard: cleanSelect(docs.organic_standard),
        production_same_as_annual: productionSame,
        production_change_reason: productionChangeReason || undefined,
        receives_farm_rent: receivesFarmRent,
        farm_rent_detail: farmRentDetail || undefined,
        num_poultry: numPoultry ? parseInt(numPoultry) : undefined,
        num_pig: numPig ? parseInt(numPig) : undefined,
        num_cow: numCow ? parseInt(numCow) : undefined,
        num_buffalo: numBuffalo ? parseInt(numBuffalo) : undefined,
        inspection_type: cleanSelect(inspectionType),
        last_year_comments: lastYearComments || undefined,
        inspector_summary: inspectorSummary || undefined,
        review_member_name: reviewMemberName || undefined,
        review_member_id: reviewMemberId || undefined,
        review_meeting_date: reviewDate || undefined,
        review_result: cleanSelect(reviewResult),
        certified_conditions: certifiedConditions || undefined,
        certified_area_crops: certifiedAreaCrops || undefined,
        status: 'submitted',
      });

      // 2. Save farm-level inspections (one per farm)
      for (let i = 0; i < farms.length; i++) {
        const farm = farms[i];
        await pb.collection('eu_organic_farm_inspections').create({
          inspection_farm_id: `FINSP-${Date.now()}-${i}`,
          inspection: inspectionRecord.id,
          farmer_id: farmerId.trim(),
          farmer: farmerRecordId || undefined,
          farm_id: farm.farmId.trim() || `F${i + 1}`,
          land_certificate: farm.landCertificate,
          inspection_date: inspectionDate,
          inspector: user?.id,
          location: farm.location || undefined,
          total_area_ha: farm.totalAreaHa ? parseFloat(farm.totalAreaHa) : undefined,
          production_system: cleanSelect(farm.productionSystem),
          organic_conversion_date: farm.organicConversionDate || undefined,
          plant_species: farm.plantSpecies || undefined,
          a_expected_produce_kg: farm.aExpectedKg ? parseFloat(farm.aExpectedKg) : undefined,
          r_expected_produce_kg: farm.rExpectedKg ? parseFloat(farm.rExpectedKg) : undefined,
          organic_area_ha: farm.organicAreaHa ? parseFloat(farm.organicAreaHa) : undefined,
          seed_source: farm.seedSource || undefined,
          seed_quantity_kg: farm.seedQtyKg ? parseFloat(farm.seedQtyKg) : undefined,
          fertilizer_source: farm.fertilizerSource || undefined,
          fert_qty_1: farm.fertQty1 ? parseFloat(farm.fertQty1) : undefined,
          fert_qty_2: farm.fertQty2 ? parseFloat(farm.fertQty2) : undefined,
          fert_qty_3: farm.fertQty3 ? parseFloat(farm.fertQty3) : undefined,
          fert_qty_4: farm.fertQty4 ? parseFloat(farm.fertQty4) : undefined,
          fert_qty_5: farm.fertQty5 ? parseFloat(farm.fertQty5) : undefined,
          growing_condition_notes: farm.growingCondition || undefined,
          has_disease: farm.hasDisease,
          disease_description: farm.diseaseDescription || undefined,
          pest_management_method: cleanSelect(farm.pestMethod),
          herbal_agents: farm.herbalAgents || undefined,
          forbidden_chemical_used: farm.forbiddenChemical,
          forbidden_chemical_desc: farm.forbiddenChemDesc || undefined,
          shared_sprayer_used: farm.sharedSprayer,
          shared_sprayer_cleaning: farm.sharedSprayerCleaning || undefined,
          protective_north: farm.protectiveNorth || undefined,
          protective_west: farm.protectiveWest || undefined,
          protective_east: farm.protectiveEast || undefined,
          protective_south: farm.protectiveSouth || undefined,
          water_pollution_risk: cleanSelect(farm.waterRisk),
          air_pollution_risk: cleanSelect(farm.airRisk),
          tools_risk: cleanSelect(farm.toolsRisk),
          high_risk_detail: farm.highRiskDetail || undefined,
          inconsistency_description: farm.inconsistencyDesc || undefined,
          has_been_improved: farm.hasImproved,
          improvement_solution: farm.improveSolution || undefined,
        });
      }

      // 3. Save processing Q&A (10-Index)
      const qaData: Record<string, any> = {
        inspection: inspectionRecord.id,
        compliance_map: qaCompliance,
      };

      for (const q of PROCESSING_QUESTIONS) {
        // Map the answer text
        if (qaAnswers[q.id]) {
          qaData[q.fieldName] = qaAnswers[q.id];
        }
        // Map any compliance notes
        if (qaNotes[q.id]) {
          qaData[`${q.id}_notes`] = qaNotes[q.id];
        }
      }

      await pb.collection('eu_organic_processing_qa').create(qaData);

      toast.success(t('inspection_saved', 'Inspection saved successfully!'));
    } catch (err: unknown) {
      console.error('[EU Organic Save Error]', err);
      // Extract PocketBase validation details
      const pbErr = err as { response?: { data?: Record<string, { message: string }> }; message?: string };
      if (pbErr?.response?.data) {
        const fieldErrors = Object.entries(pbErr.response.data)
          .map(([field, detail]) => `${field}: ${detail.message}`)
          .join('\n');
        toast.error(
          <div>
            <p className="font-semibold mb-1">{t('save_error', 'Error saving data')}</p>
            <pre className="text-xs whitespace-pre-wrap mt-1 max-h-32 overflow-auto">{fieldErrors}</pre>
          </div>,
          { duration: 8000 }
        );
      } else {
        toast.error(pbErr?.message || t('save_error', 'Error saving data'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const farm = farms[activeFarmIdx];

  // Q&A stats
  const qaAnswered = Object.values(qaCompliance).filter(v => v).length;
  const qaTotal = PROCESSING_QUESTIONS.length;
  const qaCompliant = Object.values(qaCompliance).filter(v => v === 'COM').length;
  const qaNonCompliant = Object.values(qaCompliance).filter(v => v === 'NC').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
        <h2 className="text-lg font-bold text-green-800 flex items-center gap-2 mb-1">
          <ClipboardCheck className="h-5 w-5 text-green-600" />
          {t('eu_organic_inspection')}
        </h2>
        <p className="text-xs text-green-600">{t('eu_organic_inspection_desc')}</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="general" className="text-xs py-2 flex flex-col gap-0.5">
            <UserCheck className="h-3.5 w-3.5" />
            <span>{t('euo_tab_general')}</span>
          </TabsTrigger>
          <TabsTrigger value="farms" className="text-xs py-2 flex flex-col gap-0.5">
            <Sprout className="h-3.5 w-3.5" />
            <span>{t('euo_tab_farms')}</span>
          </TabsTrigger>
          <TabsTrigger value="processing" className="text-xs py-2 flex flex-col gap-0.5">
            <Hand className="h-3.5 w-3.5" />
            <span>{t('euo_tab_processing')}</span>
          </TabsTrigger>
          <TabsTrigger value="review" className="text-xs py-2 flex flex-col gap-0.5">
            <FileText className="h-3.5 w-3.5" />
            <span>{t('euo_tab_review')}</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── Tab 1: General Information ─── */}
        <TabsContent value="general" className="space-y-4 mt-4">
          {/* Hierarchy Selection */}
          <div className="rounded-xl border border-green-200 bg-green-50/30 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-600" />
              {t('euo_hierarchy_selection', 'Entity Selection')}
            </h3>
            <HierarchicalSelector
              initialValues={{
                country: country || undefined,
                farmerId: farmerId || undefined,
              }}
              onSelect={useCallback(({ country: c, farmerId: fid }) => {
                if (c) setCountry(c as any);
                if (fid && fid !== farmerId) {
                  // Fetch farmer details instead of setting fid immediately to avoid UUID/Code blink
                  pb.collection('farmers').getOne(fid).then(rec => {
                    if (rec) {
                      setFarmerName(rec.full_name || rec.name);
                      setFarmerId(rec.farmer_code || rec.id);
                      setFarmerRecordId(rec.id);
                    }
                  }).catch(err => {
                    console.error('Error auto-fetching farmer:', err);
                    setFarmerId(fid); // Fallback to UUID if fetch fails
                  });
                }
              }, [farmerId])}
            />
          </div>

          {/* Farmer Info */}
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              {t('euo_farmer_info')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('farmer_id')} <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    value={farmerId}
                    onChange={e => setFarmerId(e.target.value)}
                    placeholder="e.g. HJ02"
                    className={!farmerId.trim() ? 'border-red-200' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      if (!farmerId) return;
                      try {
                        const records = await pb.collection('farmers').getList(1, 1, {
                          filter: `farmer_code = "${farmerId}" || id = "${farmerId}"`
                        });
                        if (records.items.length > 0) {
                          const rec = records.items[0];
                          setFarmerName(rec.full_name || rec.name);
                          setFarmerId(rec.farmer_code || rec.id);
                          setFarmerRecordId(rec.id);
                        } else {
                          toast.error("Farmer not found");
                        }
                      } catch (err) {
                        toast.error("Fetch failed");
                      }
                    }}
                  >
                    Fetch
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('farmer_name')} <span className="text-red-500">*</span></Label>
                <Input value={farmerName} onChange={e => setFarmerName(e.target.value)} className={!farmerName.trim() ? 'border-red-200' : ''} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('inspector_name')} <span className="text-red-500">*</span></Label>
                <Input value={inspectorName} onChange={e => setInspectorName(e.target.value)} className={!inspectorName.trim() ? 'border-red-200' : ''} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('inspection_date')} <span className="text-red-500">*</span></Label>
                <Input type="date" value={inspectionDate} onChange={e => setInspectionDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('location')}</Label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="GPS / Address" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_informant')}</Label>
                <select
                  value={informant}
                  onChange={e => setInformant(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="member">{t('euo_informant_member')}</option>
                  <option value="family">{t('euo_informant_family')}</option>
                  <option value="representative">{t('euo_informant_rep')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
            </div>
            {informant === 'other' && (
              <Input value={informantDetail} onChange={e => setInformantDetail(e.target.value)} placeholder={t('euo_informant_detail')} className="mt-2" />
            )}
          </div>

          {/* Documents */}
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              {t('euo_farm_documents')}
            </h3>
            <p className="text-xs text-muted-foreground">{t('euo_doc_legend')}</p>
            <div className="space-y-2">
              {[
                { key: 'application_form', label: 'euo_doc_application' },
                { key: 'farm_history', label: 'euo_doc_history' },
                { key: 'production_plan', label: 'euo_doc_production_plan' },
                { key: 'drawing', label: 'euo_doc_drawing' },
                { key: 'production_factors', label: 'euo_doc_production_factors' },
                { key: 'previous_report', label: 'euo_doc_previous_report' },
                { key: 'other', label: 'euo_doc_other' },
                { key: 'organic_standard', label: 'euo_doc_organic_standard' },
              ].map(doc => (
                <div key={doc.key} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700 flex-1">{t(doc.label)}</span>
                  <DocStatusButton value={docs[doc.key]} onChange={v => setDoc(doc.key, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Production Info */}
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">{t('euo_production_info')}</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={productionSame} onChange={e => setProductionSame(e.target.checked)} className="rounded" />
                <span className="text-sm">{t('euo_production_same')}</span>
              </label>
              {!productionSame && (
                <textarea
                  value={productionChangeReason}
                  onChange={e => setProductionChangeReason(e.target.value)}
                  placeholder={t('euo_production_change_reason')}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[50px]"
                />
              )}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={receivesFarmRent} onChange={e => setReceivesFarmRent(e.target.checked)} className="rounded" />
                <span className="text-sm">{t('euo_receives_rent')}</span>
              </label>
              {receivesFarmRent && (
                <Input value={farmRentDetail} onChange={e => setFarmRentDetail(e.target.value)} placeholder={t('euo_rent_detail')} />
              )}
            </div>
          </div>

          {/* Animals */}
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">{t('euo_animals')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_poultry')}</Label>
                <Input type="number" value={numPoultry} onChange={e => setNumPoultry(e.target.value)} min="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_pig')}</Label>
                <Input type="number" value={numPig} onChange={e => setNumPig(e.target.value)} min="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_cow')}</Label>
                <Input type="number" value={numCow} onChange={e => setNumCow(e.target.value)} min="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_buffalo')}</Label>
                <Input type="number" value={numBuffalo} onChange={e => setNumBuffalo(e.target.value)} min="0" />
              </div>
            </div>
          </div>

          {/* Tab Footer Navigation */}
          <div className="flex justify-center gap-4 pt-6 mt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setActiveTab('farms')}
              className="gap-2 px-8"
            >
              {t('next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ─── Tab 2: Farm Inspections ─── */}
        <TabsContent value="farms" className="space-y-4 mt-4">
          {/* Farm selector */}
          <div className="flex items-center gap-2 flex-wrap">
            {farms.map((f, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveFarmIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${idx === activeFarmIdx
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <Sprout className="h-3 w-3" />
                {f.farmName || `${t('farm')} ${idx + 1}`}
                {farms.length > 1 && idx === activeFarmIdx && (
                  <Trash2
                    className="h-3 w-3 ml-1 text-white/80 hover:text-white"
                    onClick={e => { e.stopPropagation(); removeFarm(idx); }}
                  />
                )}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={addFarm} className="h-8 text-xs gap-1">
              <Plus className="h-3 w-3" />
              {t('add_farm')}
            </Button>
          </div>

          {farm && (
            <>
              {/* Production Plan Section */}
              <div className="rounded-xl border-l-4 border-l-green-500 border border-gray-200 overflow-hidden">
                <div className="bg-green-100/60 px-4 py-3">
                  <h3 className="text-sm font-semibold text-green-700 flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    {t('euo_fi_sec_production')}
                  </h3>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{t('farm_id')} <span className="text-red-500">*</span></Label>
                      <Input value={farm.farmId} onChange={e => updateFarm(activeFarmIdx, 'farmId', e.target.value)} className={!farm.farmId.trim() ? 'border-red-200' : ''} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('farm_name')}</Label>
                      <Input value={farm.farmName} onChange={e => updateFarm(activeFarmIdx, 'farmName', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('total_area_ha')}</Label>
                      <Input type="number" value={farm.totalAreaHa} onChange={e => updateFarm(activeFarmIdx, 'totalAreaHa', e.target.value)} step="0.1" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_organic_area_ha')}</Label>
                      <Input type="number" value={farm.organicAreaHa} onChange={e => updateFarm(activeFarmIdx, 'organicAreaHa', e.target.value)} step="0.1" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('production_system')}</Label>
                      <select
                        value={farm.productionSystem}
                        onChange={e => updateFarm(activeFarmIdx, 'productionSystem', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      >
                        <option value="monoculture">{t('euo_monoculture')}</option>
                        <option value="intercropping">{t('euo_intercropping')}</option>
                        <option value="agroforestry">{t('euo_agroforestry')}</option>
                        <option value="mixed">{t('euo_mixed')}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_conversion_date')}</Label>
                      <Input type="date" value={farm.organicConversionDate} onChange={e => updateFarm(activeFarmIdx, 'organicConversionDate', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_plant_species')}</Label>
                      <Input value={farm.plantSpecies} onChange={e => updateFarm(activeFarmIdx, 'plantSpecies', e.target.value)} placeholder="Arabica, Robusta..." />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('location')}</Label>
                      <Input value={farm.location} onChange={e => updateFarm(activeFarmIdx, 'location', e.target.value)} placeholder="GPS" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_a_expected_kg')}</Label>
                      <Input type="number" value={farm.aExpectedKg} onChange={e => updateFarm(activeFarmIdx, 'aExpectedKg', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_r_expected_kg')}</Label>
                      <Input type="number" value={farm.rExpectedKg} onChange={e => updateFarm(activeFarmIdx, 'rExpectedKg', e.target.value)} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={farm.landCertificate}
                      onChange={e => updateFarm(activeFarmIdx, 'landCertificate', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">{t('euo_has_land_cert')}</span>
                  </label>
                </div>
              </div>

              {/* Seed & Fertilizer */}
              <div className="rounded-xl border-l-4 border-l-emerald-500 border border-gray-200 overflow-hidden">
                <div className="bg-emerald-100/60 px-4 py-3">
                  <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                    <Sprout className="h-4 w-4" />
                    {t('euo_fi_sec_seed')}
                  </h3>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_seed_source')}</Label>
                      <Input value={farm.seedSource} onChange={e => updateFarm(activeFarmIdx, 'seedSource', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_seed_qty')}</Label>
                      <Input type="number" value={farm.seedQtyKg} onChange={e => updateFarm(activeFarmIdx, 'seedQtyKg', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('euo_fert_source')}</Label>
                      <Input value={farm.fertilizerSource} onChange={e => updateFarm(activeFarmIdx, 'fertilizerSource', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className="space-y-1">
                        <Label className="text-xs">Qty {n}</Label>
                        <Input
                          type="number"
                          value={farm[`fertQty${n}` as keyof FarmInspection] as string}
                          onChange={e => updateFarm(activeFarmIdx, `fertQty${n}` as keyof FarmInspection, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pest Management */}
              <div className="rounded-xl border-l-4 border-l-red-500 border border-gray-200 overflow-hidden">
                <div className="bg-red-100/60 px-4 py-3">
                  <h3 className="text-sm font-semibold text-red-700 flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    {t('euo_fi_sec_pest')}
                  </h3>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  <div className="space-y-1">
                    <Label className="text-xs">{t('euo_growing_condition')}</Label>
                    <textarea
                      value={farm.growingCondition}
                      onChange={e => updateFarm(activeFarmIdx, 'growingCondition', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[50px]"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={farm.hasDisease} onChange={e => updateFarm(activeFarmIdx, 'hasDisease', e.target.checked)} className="rounded" />
                    <span className="text-sm">{t('euo_has_disease')}</span>
                  </label>
                  {farm.hasDisease && (
                    <Input value={farm.diseaseDescription} onChange={e => updateFarm(activeFarmIdx, 'diseaseDescription', e.target.value)} placeholder={t('euo_disease_desc')} />
                  )}
                  <div className="space-y-1">
                    <Label className="text-xs">{t('euo_pest_method')}</Label>
                    <select
                      value={farm.pestMethod}
                      onChange={e => updateFarm(activeFarmIdx, 'pestMethod', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      <option value="none">{t('none')}</option>
                      <option value="manual">{t('euo_manual')}</option>
                      <option value="biological">{t('euo_biological')}</option>
                      <option value="herbal">{t('euo_herbal')}</option>
                    </select>
                  </div>
                  {farm.pestMethod === 'herbal' && (
                    <Input value={farm.herbalAgents} onChange={e => updateFarm(activeFarmIdx, 'herbalAgents', e.target.value)} placeholder={t('euo_herbal_names')} />
                  )}

                  <Separator />

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={farm.forbiddenChemical} onChange={e => updateFarm(activeFarmIdx, 'forbiddenChemical', e.target.checked)} className="rounded border-red-300" />
                    <span className="text-sm text-red-700 font-medium">{t('euo_forbidden_chem')}</span>
                  </label>
                  {farm.forbiddenChemical && (
                    <Input value={farm.forbiddenChemDesc} onChange={e => updateFarm(activeFarmIdx, 'forbiddenChemDesc', e.target.value)} placeholder={t('euo_forbidden_desc')} className="border-red-200" />
                  )}
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={farm.sharedSprayer} onChange={e => updateFarm(activeFarmIdx, 'sharedSprayer', e.target.checked)} className="rounded" />
                    <span className="text-sm">{t('euo_shared_sprayer')}</span>
                  </label>
                  {farm.sharedSprayer && (
                    <Input value={farm.sharedSprayerCleaning} onChange={e => updateFarm(activeFarmIdx, 'sharedSprayerCleaning', e.target.value)} placeholder={t('euo_sprayer_cleaning')} />
                  )}
                </div>
              </div>

              {/* Contamination Risk */}
              <div className="rounded-xl border-l-4 border-l-yellow-500 border border-gray-200 overflow-hidden">
                <div className="bg-yellow-100/60 px-4 py-3">
                  <h3 className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    {t('euo_fi_sec_contamination')}
                  </h3>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  <p className="text-xs text-muted-foreground">{t('euo_protective_measure')}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(['North', 'West', 'East', 'South'] as const).map(dir => (
                      <div key={dir} className="space-y-1">
                        <Label className="text-xs">{t(`euo_dir_${dir.toLowerCase()}`)}</Label>
                        <Input
                          value={farm[`protective${dir}` as keyof FarmInspection] as string}
                          onChange={e => updateFarm(activeFarmIdx, `protective${dir}` as keyof FarmInspection, e.target.value)}
                          placeholder={t('euo_boundary_desc')}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('euo_risk_assessment')}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'waterRisk', label: 'euo_water_risk' },
                      { key: 'airRisk', label: 'euo_air_risk' },
                      { key: 'toolsRisk', label: 'euo_tools_risk' },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs">{t(label)}</Label>
                        <select
                          value={farm[key as keyof FarmInspection] as string}
                          onChange={e => updateFarm(activeFarmIdx, key as keyof FarmInspection, e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
                        >
                          <option value="">{t('select')}</option>
                          <option value="none">{t('none')}</option>
                          <option value="little">{t('euo_risk_little')}</option>
                          <option value="moderate">{t('euo_risk_moderate')}</option>
                          <option value="high">{t('euo_risk_high')}</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  {(farm.waterRisk === 'high' || farm.airRisk === 'high' || farm.toolsRisk === 'high') && (
                    <textarea
                      value={farm.highRiskDetail}
                      onChange={e => updateFarm(activeFarmIdx, 'highRiskDetail', e.target.value)}
                      placeholder={t('euo_high_risk_detail')}
                      className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm min-h-[50px] bg-red-50/50"
                    />
                  )}
                </div>
              </div>

              {/* Previous Year Tracking */}
              <div className="rounded-xl border-l-4 border-l-purple-500 border border-gray-200 overflow-hidden">
                <div className="bg-purple-100/60 px-4 py-3">
                  <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t('euo_fi_sec_assessment')}
                  </h3>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  <div className="space-y-1">
                    <Label className="text-xs">{t('euo_inconsistency')}</Label>
                    <textarea
                      value={farm.inconsistencyDesc}
                      onChange={e => updateFarm(activeFarmIdx, 'inconsistencyDesc', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[50px]"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={farm.hasImproved} onChange={e => updateFarm(activeFarmIdx, 'hasImproved', e.target.checked)} className="rounded" />
                    <span className="text-sm">{t('euo_has_improved')}</span>
                  </label>
                  {farm.hasImproved && (
                    <Input value={farm.improveSolution} onChange={e => updateFarm(activeFarmIdx, 'improveSolution', e.target.value)} placeholder={t('euo_solution')} />
                  )}
                </div>
              </div>

              {/* Tab Footer Navigation */}
              <div className="flex justify-center gap-4 pt-6 mt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('general')}
                  className="gap-2 px-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('back')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('processing')}
                  className="gap-2 px-8"
                >
                  {t('next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* ─── Tab 3: Processing Q&A (10-Index) ─── */}
        <TabsContent value="processing" className="space-y-4 mt-4">
          <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
            <h3 className="text-sm font-semibold text-orange-800 mb-1">{t('euo_processing_title')}</h3>
            <p className="text-xs text-orange-600">{t('euo_processing_desc')}</p>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-blue-600">{qaAnswered}/{qaTotal} {t('answered')}</span>
              <span className="text-green-600">{qaCompliant} COM</span>
              {qaNonCompliant > 0 && <span className="text-red-600">{qaNonCompliant} NC</span>}
            </div>
          </div>

          {PROCESSING_SECTIONS.map(section => {
            const isExpanded = qaExpanded.has(section.key);
            const sectionQuestions = PROCESSING_QUESTIONS.filter(q => q.section === section.key);
            const Icon = ICON_MAP[section.icon] || FileText;

            return (
              <div key={section.key} className={`rounded-xl border-l-4 ${section.borderColor} border border-gray-200 overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => {
                    setQaExpanded(prev => {
                      const next = new Set(prev);
                      if (next.has(section.key)) next.delete(section.key);
                      else next.add(section.key);
                      return next;
                    });
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left ${section.headerBg} transition-colors`}
                >
                  <Icon className={`h-4 w-4 ${section.color}`} />
                  <span className={`text-sm font-semibold ${section.color} flex-1`}>{t(section.labelKey)}</span>
                  <Badge variant="secondary" className="text-xs">{sectionQuestions.length}</Badge>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="p-3 bg-white space-y-3">
                    {sectionQuestions.map((q, qIdx) => (
                      <div key={q.id} className="rounded-lg border border-gray-200 p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-xs font-bold text-gray-400 mr-2">Q{q.id.replace('q', '')}</span>
                            <span className="text-sm text-gray-700">{t(q.questionKey)}</span>
                          </div>
                          <ComplianceButton
                            value={qaCompliance[q.id] || ''}
                            onChange={v => setQaCompliance(prev => ({ ...prev, [q.id]: v }))}
                          />
                        </div>
                        <textarea
                          value={qaAnswers[q.id] || ''}
                          onChange={e => setQaAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm min-h-[40px] placeholder:text-muted-foreground/50"
                          placeholder={t('euo_answer_placeholder')}
                        />
                        {qaCompliance[q.id] === 'NC' && (
                          <textarea
                            value={qaNotes[q.id] || ''}
                            onChange={e => setQaNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
                            className="w-full rounded-md border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs min-h-[30px] placeholder:text-red-300"
                            placeholder={t('euo_nc_note')}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Tab Footer Navigation */}
          <div className="flex justify-center gap-4 pt-6 mt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setActiveTab('farms')}
              className="gap-2 px-8"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('back')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab('review')}
              className="gap-2 px-8"
            >
              {t('next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ─── Tab 4: Review & Summary ─── */}
        <TabsContent value="review" className="space-y-4 mt-4">
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">{t('euo_inspection_type')}</h3>
            <select
              value={inspectionType}
              onChange={e => setInspectionType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="initial">{t('euo_type_initial')}</option>
              <option value="annual">{t('euo_type_annual')}</option>
              <option value="unannounced">{t('euo_type_unannounced')}</option>
              <option value="follow_up">{t('euo_type_followup')}</option>
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">{t('euo_last_year_comments')}</h3>
            <textarea
              value={lastYearComments}
              onChange={e => setLastYearComments(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[60px]"
              placeholder={t('euo_last_year_placeholder')}
            />
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">{t('euo_inspector_summary')}</h3>
            <textarea
              value={inspectorSummary}
              onChange={e => setInspectorSummary(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[80px]"
              placeholder={t('euo_summary_placeholder')}
            />
          </div>

          <Separator />

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t('euo_review_committee')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_reviewer_name')}</Label>
                <Input value={reviewMemberName} onChange={e => setReviewMemberName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_reviewer_id')}</Label>
                <Input value={reviewMemberId} onChange={e => setReviewMemberId(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_meeting_date')}</Label>
                <Input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('euo_review_result')}</Label>
                <select
                  value={reviewResult}
                  onChange={e => setReviewResult(e.target.value as ReviewResult)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="pending">{t('pending')}</option>
                  <option value="C1">{t('euo_result_c1')}</option>
                  <option value="C2">{t('euo_result_c2')}</option>
                  <option value="C3">{t('euo_result_c3')}</option>
                  <option value="NC">{t('euo_result_nc')}</option>
                  <option value="suspended">{t('euo_result_suspended')}</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('euo_certified_conditions')}</Label>
              <textarea
                value={certifiedConditions}
                onChange={e => setCertifiedConditions(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[40px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('euo_certified_area')}</Label>
              <Input value={certifiedAreaCrops} onChange={e => setCertifiedAreaCrops(e.target.value)} />
            </div>
          </div>

          {/* Save & Back */}
          <div className="flex justify-center gap-4 pt-6 mt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setActiveTab('processing')}
              className="gap-2 px-8"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('back')}
            </Button>
            <Button
              className="rounded-lg btn-3d-success text-white px-8 py-6"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {t('save_inspection')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
