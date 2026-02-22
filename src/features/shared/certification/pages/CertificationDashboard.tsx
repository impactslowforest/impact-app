import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileCheck, ShieldCheck, Leaf, Award,
  ClipboardList, BarChart3, ChevronRight, BookOpen,
  Upload, TreePine, Info, FolderOpen, Loader2, Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import InternalAuditForm from './InternalAuditForm';
import EuOrganicInspectionForm from './EuOrganicInspectionForm';
import { RA_SECTIONS, RA_CHECKLIST } from '../data/ra-checklist';
import { EU_ORGANIC_SECTIONS, EU_ORGANIC_CHECKLIST } from '../data/eu-organic-checklist';
import { FT_SECTIONS, FT_CHECKLIST } from '../data/fairtrade-checklist';
import { BF_SECTIONS, BF_CHECKLIST } from '../data/birdfriendly-checklist';
import type { AuditData } from './InternalAuditForm';
import { toast } from 'sonner';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';

const CertificationLibrary = lazy(() => import('./CertificationLibrary'));

interface CertificationDashboardProps {
  country?: string;
}

type TabKey = 'overview' | 'ra_audit' | 'eu_organic_audit' | 'eu_organic_inspection' | 'ft_audit' | 'bf_audit' | 'library';

interface CertCard {
  key: string;
  tab?: TabKey;
  titleKey: string;
  descKey: string;
  icon: React.ElementType;
  logoSrc: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  items: number;
  hasAudit: boolean;
}

const CERT_CARDS: CertCard[] = [
  {
    key: 'ra',
    tab: 'ra_audit',
    titleKey: 'ra_certification',
    descKey: 'ra_cert_desc',
    icon: Award,
    logoSrc: '/images/ra-logo.png',
    color: 'bg-amber-600',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    items: 30,
    hasAudit: true,
  },
  {
    key: 'eu_organic',
    tab: 'eu_organic_inspection',
    titleKey: 'eu_organic_certification',
    descKey: 'eu_organic_cert_desc',
    icon: Leaf,
    logoSrc: '/images/eu-organic-logo.png',
    color: 'bg-green-600',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    items: 32,
    hasAudit: true,
  },
  {
    key: 'eudr',
    titleKey: 'eudr_compliance',
    descKey: 'eudr_cert_desc',
    icon: ShieldCheck,
    logoSrc: '/images/eudr-logo.png',
    color: 'bg-blue-600',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    items: 36,
    hasAudit: true,
  },
  {
    key: 'fairtrade',
    tab: 'ft_audit',
    titleKey: 'fairtrade_certification',
    descKey: 'fairtrade_cert_desc',
    icon: Award,
    logoSrc: '/images/fairtrade-logo.png',
    color: 'bg-teal-600',
    borderColor: 'border-teal-200',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    items: 35,
    hasAudit: true,
  },
  {
    key: 'birdfriendly',
    tab: 'bf_audit',
    titleKey: 'birdfriendly_certification',
    descKey: 'birdfriendly_cert_desc',
    icon: Award,
    logoSrc: '/images/birdfriendly-logo.jpg',
    color: 'bg-sky-600',
    borderColor: 'border-sky-200',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    items: 32,
    hasAudit: true,
  },
];

export default function CertificationDashboard({ country: propCountry }: CertificationDashboardProps) {
  const { t } = useTranslation(['common', 'nav']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  // Country from prop (country-specific page) or URL param (global page with selector)
  const urlCountry = searchParams.get('country') || undefined;
  const [selectedCountry, setSelectedCountry] = useState<string>(propCountry || urlCountry || 'all');
  const country = propCountry || (selectedCountry !== 'all' ? selectedCountry : undefined);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    if (value === 'all') {
      searchParams.delete('country');
    } else {
      searchParams.set('country', value);
    }
    setSearchParams(searchParams, { replace: true });
  };
  const [viewingAudit, setViewingAudit] = useState<any | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAudit = async (data: AuditData) => {
    setIsSaving(true);
    try {
      const collectionMap: Record<string, string> = {
        ra: 'ra_audits',
        eu_organic: 'eu_organic_inspections',
        fairtrade: 'fairtrade_audits',
        birdfriendly: 'birdfriendly_audits',
      };
      const collection = collectionMap[data.auditType] || 'eu_organic_inspections';

      await pb.collection(collection).create({
        country: data.country,
        audit_date: data.auditDate,
        auditor_name: data.auditorName,
        audit_location: data.auditLocation,
        check_values: data.checkValues,
        item_notes: data.itemNotes,
        section_notes: data.sectionNotes,
        overall_result: data.overallResult,
        overall_notes: data.overallNotes,
        corrective_actions: data.correctiveActions,
        next_audit_date: data.nextAuditDate || undefined,
        assessed_by: user?.id,
      });
      toast.success(t('common:assessment_saved'));
      setActiveTab('overview');
      setSelectedCert(null);
    } catch (error: any) {
      console.error('Failed to save audit:', error);
      const pbError = error?.data?.data;
      let detailed = '';
      if (pbError) {
        detailed = Object.entries(pbError)
          .map(([f, d]: [string, any]) => `${f}: ${d.message}`)
          .join(', ');
      }
      toast.error(detailed ? `Save failed: ${detailed}` : (error.message || t('common:error')));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardClick = (card: CertCard) => {
    if (card.key === 'eudr') {
      // Navigate to EUDR module
      if (country) {
        navigate(`${ROUTES.IMPACT_EUDR}?country=${country}`);
      } else {
        navigate(ROUTES.IMPACT_EUDR);
      }
      return;
    }
    setSelectedCert(card.key);
  };

  const handleBackToOverview = () => {
    setSelectedCert(null);
    setActiveTab('overview');
  };

  // Fetch recent audits (Moved above early return to satisfy Rules of Hooks)
  const { data: auditsData, isLoading: isLoadingAudits } = useQuery({
    queryKey: ['recent_audits', country],
    queryFn: async () => {
      const countryFilter = country ? `(country = "${country}" || country = "global" || country = "")` : '';

      const fetchList = async (coll: string, opts: any) => {
        try {
          return await pb.collection(coll).getList(1, 15, opts);
        } catch (e) {
          console.warn(`Dashboard fetch failed for ${coll}:`, e);
          return { items: [] };
        }
      };

      const [ra, euo, euoFarm, euoQa] = await Promise.all([
        fetchList('ra_audits', { filter: countryFilter, sort: '-created' }),
        fetchList('eu_organic_inspections', { filter: countryFilter, sort: '-created', expand: 'farmer' }),
        fetchList('eu_organic_farm_inspections', { sort: '-created', expand: 'farmer,farm' }),
        fetchList('eu_organic_processing_qa', { sort: '-created', expand: 'inspection' }),
      ]);

      const combined = [
        ...(ra?.items || []).map(item => ({ ...item, type: 'ra' })),
        ...(euo?.items || []).map(item => ({ ...item, type: 'eu_organic' })),
        ...(euoFarm?.items || []).map(item => ({
          ...item,
          type: 'eu_organic_farm',
          audit_date: item.inspection_date || item.created,
          audit_location: (item.expand as any)?.farm?.farm_name || item.farm_id,
          auditor_name: item.inspector_name || 'System'
        })),
        ...(euoQa?.items || []).map(item => ({
          ...item,
          type: 'eu_organic_qa',
          audit_date: (item.expand?.inspection as any)?.inspection_date || item.created,
          audit_location: (item.expand?.inspection as any)?.expand?.farmer?.full_name || 'Post-Harvest QA',
          auditor_name: (item.expand?.inspection as any)?.expand?.inspector?.name || (item.expand?.inspection as any)?.inspector_name || 'System'
        })),
      ].sort((a: any, b: any) => new Date(b.created || 0).getTime() - new Date(a.created || 0).getTime());

      return combined.slice(0, 15);
    },
  });

  // Certification detail view (when a cert card is clicked)
  if (selectedCert) {
    const card = CERT_CARDS.find(c => c.key === selectedCert)!;
    return (
      <div className="space-y-6 page-enter">
        {/* Header with back */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackToOverview} className="gap-1.5 text-muted-foreground">
            <ChevronRight className="h-4 w-4 rotate-180" />
            {t('common:back')}
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
              <img src={card.logoSrc} alt={card.key} className="h-8 w-8 object-contain" />
            </div>
            <h2 className="text-lg font-bold text-primary-800">
              {t(`common:${card.titleKey}`)}
              {country && <> — <span className="capitalize">{country}</span></>}
            </h2>
          </div>
        </div>

        {/* Sub-tabs for this certification */}
        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'overview'
              ? 'border-primary-500 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t('common:general_info', 'General Info')}
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'library'
              ? 'border-purple-500 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t('common:documents', 'Documents')}
            </div>
          </button>
          {card.hasAudit && (
            <button
              type="button"
              onClick={() => {
                const tabMap: Record<string, TabKey> = {
                  ra: 'ra_audit',
                  eu_organic: 'eu_organic_inspection',
                  fairtrade: 'ft_audit',
                  birdfriendly: 'bf_audit',
                };
                setActiveTab(tabMap[selectedCert] || 'overview');
              }}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${['ra_audit', 'eu_organic_audit', 'eu_organic_inspection', 'ft_audit', 'bf_audit'].includes(activeTab)
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                {t('common:audit_inspection', 'Audit / Inspection')}
              </div>
            </button>
          )}
        </div>

        {/* Sub-tab content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* General Info */}
            <div className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-6`}>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <img src={card.logoSrc} alt={card.key} className="h-14 w-14 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-base font-bold ${card.textColor}`}>
                    {t(`common:${card.titleKey}`)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {t(`common:${card.descKey}`)}
                  </p>
                  {card.items > 0 && (
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ClipboardList className="h-3.5 w-3.5" />
                        {card.items} {t('common:checklist', 'checklist items').toLowerCase()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <TreePine className="h-3.5 w-3.5" />
                        {t('common:plots', 'Plots')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
                <FolderOpen className="h-8 w-8 text-primary-500 mb-3" />
                <h4 className="text-sm font-semibold text-gray-800">{t('common:plots', 'Plots')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('common:view_certified_plots', 'View certified plots and farm data')}</p>
                <div className="h-24 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-lg mt-3">
                  <p className="text-xs text-gray-400">{t('common:coming_soon', 'Coming soon')}</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
                <Upload className="h-8 w-8 text-primary-500 mb-3" />
                <h4 className="text-sm font-semibold text-gray-800">{t('common:uploaded_documents', 'Uploaded Documents')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('common:manage_cert_docs', 'Manage certification documents')}</p>
                <div className="h-24 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-lg mt-3">
                  <p className="text-xs text-gray-400">{t('common:coming_soon', 'Coming soon')}</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
                <BarChart3 className="h-8 w-8 text-primary-500 mb-3" />
                <h4 className="text-sm font-semibold text-gray-800">{t('common:recent_audits', 'Recent Audits')}</h4>
                <p className="text-xs text-gray-500 mt-1">{t('common:view_audit_history', 'View audit and inspection history')}</p>
                <div className="h-24 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-lg mt-3">
                  <p className="text-xs text-gray-400">{t('common:no_data')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>}>
            <CertificationLibrary />
          </Suspense>
        )}

        {activeTab === 'ra_audit' && selectedCert === 'ra' && (
          <InternalAuditForm
            auditType="ra"
            sections={RA_SECTIONS}
            checklist={RA_CHECKLIST}
            country={country || 'global'}
            onSave={handleSaveAudit}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'eu_organic_audit' && selectedCert === 'eu_organic' && (
          <InternalAuditForm
            auditType="eu_organic"
            sections={EU_ORGANIC_SECTIONS}
            checklist={EU_ORGANIC_CHECKLIST}
            country={country || 'global'}
            onSave={handleSaveAudit}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'eu_organic_inspection' && selectedCert === 'eu_organic' && (
          <EuOrganicInspectionForm country={country as any} />
        )}

        {activeTab === 'ft_audit' && selectedCert === 'fairtrade' && (
          <InternalAuditForm
            auditType="fairtrade"
            sections={FT_SECTIONS}
            checklist={FT_CHECKLIST}
            country={country || 'global'}
            onSave={handleSaveAudit}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'bf_audit' && selectedCert === 'birdfriendly' && (
          <InternalAuditForm
            auditType="birdfriendly"
            sections={BF_SECTIONS}
            checklist={BF_CHECKLIST}
            country={country || 'global'}
            onSave={handleSaveAudit}
            isSaving={isSaving}
          />
        )}
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Report Content for Printing
  const renderAuditReport = (audit: any) => {
    if (!audit) return null;
    const isRA = audit.type === 'ra';

    return (
      <div className="p-8 bg-white text-black print:p-0" id="audit-report">
        <div className="flex justify-between items-start border-b-2 border-[#15803d] pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16">
              <img
                src={isRA ? '/images/ra-logo.png' : '/images/eu-organic-logo.png'}
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900">
                {isRA ? 'Rainforest Alliance Audit Report' :
                  audit.type === 'eu_organic_farm' ? 'EU Organic Farm Inspection' :
                    audit.type === 'eu_organic_qa' ? 'EU Organic Post-Harvest QA' :
                      'EU Organic Inspection Report'}
              </h1>
              <p className="text-sm text-gray-500">Official Certification Record — {(audit.country || 'unknown').toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">ID: {audit.id}</div>
            <div className="text-xs text-gray-500">Date: {new Date(audit.audit_date || audit.inspection_date || audit.created).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Assessment Details</h3>
            <div className="space-y-1">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-sm text-gray-600">Location/Farmer:</span>
                <span className="text-sm font-semibold">{audit.audit_location || (audit.expand as any)?.farmer?.full_name || audit.inspection_id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-sm text-gray-600">Inspector:</span>
                <span className="text-sm font-semibold">{audit.auditor_name || audit.inspector_name || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-sm text-gray-600">Result:</span>
                <span className="text-sm font-bold capitalize text-green-700">{audit.overall_result || audit.status}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Certification Scope</h3>
            <div className="space-y-1">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-sm text-gray-600">Standard:</span>
                <span className="text-sm font-semibold">{isRA ? 'RA 2020' : 'EU 2018/848'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="text-sm font-semibold capitalize">{audit.country}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold border-l-4 border-green-500 pl-2 mb-3">Overall Notes & Findings</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap leading-relaxed border border-gray-100">
              {audit.overall_notes || 'No specific notes provided for this assessment.'}
            </p>
          </div>

          {(audit.corrective_actions || audit.certified_conditions) && (
            <div>
              <h3 className="text-sm font-bold border-l-4 border-amber-500 pl-2 mb-3">Required Actions</h3>
              <p className="text-sm text-amber-900 bg-amber-50 p-4 rounded-lg whitespace-pre-wrap leading-relaxed border border-amber-100 italic">
                {audit.corrective_actions || audit.certified_conditions}
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-end">
          <div className="space-y-4">
            <div className="h-12 w-32 border-b border-gray-400"></div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Inspector's Signature</p>
          </div>
          <div className="text-right text-[10px] text-gray-400 italic">
            Generated by Slow Forest IMPACT Platform on {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  // Main overview — all certification cards
  return (
    <div className="space-y-6 page-enter">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary-800 flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary-600" />
          {t('nav:certification')}{country && <> — <span className="capitalize">{country}</span></>}
        </h2>
        <div className="flex items-center gap-2">
          {!propCountry && (
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common:all_countries', 'All countries')}</SelectItem>
                <SelectItem value="laos">Laos</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
                <SelectItem value="vietnam">Vietnam</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CERT_LIBRARY)}
            className="gap-1.5"
          >
            <BookOpen className="h-4 w-4" />
            {t('common:library')}
          </Button>
        </div>
      </div>

      {/* All Certification Cards — ERP Premium Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 relative">
        {/* Background Decorative Mesh (Subtle) */}
        <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 blur-3xl pointer-events-none -z-10" />

        {CERT_CARDS.map((card) => (
          <GlassCard
            key={card.key}
            hover
            onClick={() => handleCardClick(card)}
            className={cn(
              "flex flex-col border-none p-0 overflow-hidden cursor-pointer h-full group",
              card.bgColor
            )}
          >
            {/* Top accent line */}
            <div className={cn("h-1.5 w-full", card.color)} />

            <div className="p-5 flex flex-col items-center text-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out border border-white/50">
                <img src={card.logoSrc} alt={card.key} className="h-14 w-14 object-contain rounded-lg p-1" />
              </div>

              <h3 className={cn("text-sm font-bold leading-tight transition-colors", card.textColor)}>
                {t(`common:${card.titleKey}`)}
              </h3>

              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 min-h-8">
                {t(`common:${card.descKey}`)}
              </p>

              {card.items > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/50 hover:bg-white/80 border-none">
                    <ClipboardList className="h-3 w-3 mr-1 opacity-60" />
                    {card.items} items
                  </Badge>
                </div>
              )}
            </div>

            <div className={cn(
              "mt-auto py-3 flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-all border-t border-white/20",
              card.textColor,
              "group-hover:bg-white/40"
            )}>
              {t('common:view_details', 'View Details')}
              <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Audits */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary-600" />
            {t('common:recent_audits')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          {isLoadingAudits ? (
            <div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
          ) : !auditsData || auditsData.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-lg mx-6 mb-4">
              <div className="text-center">
                <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm text-gray-400">{t('common:no_data')}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-primary-700 [&_th]:text-white">
                  <TableRow>
                    <TableHead className="py-2 text-xs">{t('common:type', 'Type')}</TableHead>
                    <TableHead className="py-2 text-xs">{t('common:date', 'Date')}</TableHead>
                    <TableHead className="py-2 text-xs">{t('common:subject', 'Subject')}</TableHead>
                    <TableHead className="py-2 text-xs">{t('common:inspector', 'Inspector')}</TableHead>
                    <TableHead className="py-2 text-xs text-right">{t('common:status', 'Status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditsData.map((audit: any) => (
                    <TableRow key={audit.id} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setViewingAudit(audit)}>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={`text-[10px] uppercase ${audit.type === 'ra' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                          audit.type.includes('farm') ? 'border-sky-200 bg-sky-50 text-sky-700' :
                            audit.type.includes('qa') ? 'border-purple-200 bg-purple-50 text-purple-700' :
                              'border-green-200 bg-green-50 text-green-700'
                          }`}>
                          {audit.type === 'ra' ? 'RA Audit' :
                            audit.type === 'eu_organic_farm' ? 'EU Farm Insp' :
                              audit.type === 'eu_organic_qa' ? 'EU QA' :
                                'EU Organic'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-600">
                        {new Date(audit.audit_date || audit.inspection_date || audit.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {audit.type === 'eu_organic_farm' ? `Farm: ${(audit.expand as any)?.farm?.farm_name || audit.farm_id}` :
                            audit.type === 'eu_organic_qa' ? `QA: ${(audit.expand as any)?.farmer?.full_name || (audit.expand?.inspection as any)?.expand?.farmer?.full_name || 'Processing'}` :
                              audit.audit_location || (audit.expand as any)?.farmer?.full_name || audit.inspection_id}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-500">
                        {audit.auditor_name || audit.inspector_name || '-'}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant="outline" className={`text-[10px] ${getStatusBadge(audit.status)}`}>
                            {t(`common:${audit.status}`, { defaultValue: audit.status }) as string}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setViewingAudit(audit); }}>
                            <FolderOpen className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Detail/Print Dialog */}
      <Dialog open={!!viewingAudit} onOpenChange={() => setViewingAudit(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between no-print">
            <DialogHeader className="flex-row items-center gap-4 space-y-0">
              <div className="h-8 w-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Assessment Report</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 border-green-200 hover:bg-green-50 text-green-700 shadow-sm transition-all hover:scale-105">
                <Printer className="h-4 w-4" />
                <span>Export PDF</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setViewingAudit(null)}>Close</Button>
            </div>
          </div>
          <div className="bg-gray-100 py-8 print:p-0 print:bg-white transition-all">
            <Card className="mx-auto max-w-[21cm] shadow-xl border-none print:shadow-none print:max-w-none">
              <CardContent className="p-0">
                {renderAuditReport(viewingAudit)}
              </CardContent>
            </Card>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            @media print {
              body * { visibility: hidden; }
              .no-print { display: none !important; }
              #audit-report, #audit-report * { visibility: visible; }
              #audit-report { position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; overflow: visible; }
              @page { margin: 0; }
            }
          `}} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
