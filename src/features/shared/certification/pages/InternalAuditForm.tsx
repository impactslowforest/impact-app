import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2, XCircle, Minus, ChevronDown, ArrowLeft,
  FileText, Bug, HardHat, Droplets, Users, Leaf,
  Recycle, Heart, Save, Loader2, ClipboardCheck,
  RefreshCw, Sprout, TreePine, Warehouse, Tag,
} from 'lucide-react';
import pb from '@/config/pocketbase';
import { HierarchicalSelector } from '@/components/shared/HierarchicalSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { ChecklistItem, ChecklistSection } from '../data/ra-checklist';

type CheckValue = 'compliant' | 'non_compliant' | 'na' | 'unset';

type AuditType = 'ra' | 'eu_organic' | 'fairtrade' | 'birdfriendly';

interface InternalAuditFormProps {
  auditType: AuditType;
  sections: ChecklistSection[];
  checklist: ChecklistItem[];
  country: string;
  onSave?: (data: AuditData) => void;
  isSaving?: boolean;
}

export interface AuditData {
  auditType: AuditType;
  country: string;
  auditDate: string;
  auditorName: string;
  auditLocation: string;
  checkValues: Record<string, CheckValue>;
  itemNotes: Record<string, string>;
  sectionNotes: Record<string, string>;
  overallResult: string;
  overallNotes: string;
  correctiveActions: string;
  nextAuditDate: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Bug, HardHat, Droplets, Users, Leaf,
  Recycle, Heart, RefreshCw, Sprout, TreePine, Warehouse, Tag,
};

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
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${value === 'compliant'
          ? 'bg-green-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'
          }`}
      >
        {t('comply')}
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'non_compliant' ? 'unset' : 'non_compliant')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${value === 'non_compliant'
          ? 'bg-red-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-700'
          }`}
      >
        {t('non_comply')}
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'na' ? 'unset' : 'na')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${value === 'na'
          ? 'bg-gray-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
      >
        N/A
      </button>
    </div>
  );
}

export default function InternalAuditForm({
  auditType,
  sections,
  checklist,
  country,
  onSave,
  isSaving = false,
}: InternalAuditFormProps) {
  const { t } = useTranslation('common');

  const [checks, setChecks] = useState<Record<string, CheckValue>>(() => {
    const initial: Record<string, CheckValue> = {};
    checklist.forEach(c => { initial[c.id] = 'unset'; });
    return initial;
  });
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [sectionNotes, setSectionNotes] = useState<Record<string, string>>({});
  const [overallResult, setOverallResult] = useState<string>('pending');
  const [overallNotes, setOverallNotes] = useState('');
  const [correctiveActions, setCorrectiveActions] = useState('');
  const [nextAuditDate, setNextAuditDate] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [auditLocation, setAuditLocation] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(s => s.key))
  );

  const setCheck = (id: string, value: CheckValue) => {
    setChecks(prev => ({ ...prev, [id]: value }));
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Statistics
  const compliantCount = Object.values(checks).filter(v => v === 'compliant').length;
  const nonCompliantCount = Object.values(checks).filter(v => v === 'non_compliant').length;
  const naCount = Object.values(checks).filter(v => v === 'na').length;
  const answeredCount = compliantCount + nonCompliantCount + naCount;
  const totalChecks = checklist.length;
  const complianceRate = (answeredCount - naCount) > 0
    ? Math.round((compliantCount / (answeredCount - naCount)) * 100)
    : 0;

  const getSectionProgress = (sectionKey: string) => {
    const sectionChecks = checklist.filter(c => c.section === sectionKey);
    const sCompliant = sectionChecks.filter(c => checks[c.id] === 'compliant').length;
    const sNonCompliant = sectionChecks.filter(c => checks[c.id] === 'non_compliant').length;
    const sNa = sectionChecks.filter(c => checks[c.id] === 'na').length;
    const sAnswered = sCompliant + sNonCompliant + sNa;
    return {
      compliant: sCompliant,
      nonCompliant: sNonCompliant,
      na: sNa,
      answered: sAnswered,
      total: sectionChecks.length,
    };
  };

  const getItemNumber = (item: ChecklistItem) => {
    const sectionIdx = sections.findIndex(s => s.key === item.section);
    const sectionItems = checklist.filter(c => c.section === item.section);
    const itemIdx = sectionItems.indexOf(item);
    return `${sectionIdx + 1}.${itemIdx + 1}`;
  };

  const autoResult = () => {
    if (nonCompliantCount === 0 && compliantCount > 0) return 'pass';
    if (complianceRate >= 80) return 'minor_nc';
    if (complianceRate >= 50) return 'major_nc';
    return 'fail';
  };

  const handleSave = () => {
    if (!auditorName.trim()) {
      toast.error(t('auditor_name_required'));
      return;
    }
    onSave?.({
      auditType,
      country,
      auditDate: new Date().toISOString(),
      auditorName,
      auditLocation,
      checkValues: checks,
      itemNotes,
      sectionNotes,
      overallResult,
      overallNotes,
      correctiveActions,
      nextAuditDate,
    });
  };

  const auditTitleMap: Record<AuditType, string> = {
    ra: t('ra_internal_audit'),
    eu_organic: t('eu_organic_internal_audit'),
    fairtrade: t('ft_internal_audit', 'FairTrade Internal Audit'),
    birdfriendly: t('bf_internal_audit', 'Bird Friendly Internal Audit'),
  };
  const auditTitle = auditTitleMap[auditType];

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4">
        <h2 className="text-lg font-bold text-primary-800 flex items-center gap-2 mb-3">
          <ClipboardCheck className="h-5 w-5 text-primary-600" />
          {auditTitle}
        </h2>
        <div className="space-y-4 pt-2">
          <Label className="text-xs font-semibold text-primary-700 uppercase tracking-wider">{t('audit_location_hierarchy', 'Audit Location / Subject Selection')}</Label>
          <HierarchicalSelector
            initialValues={{
              country: country || undefined,
            }}
            onSelect={useCallback(({ farmerId: fid }) => {
              if (fid) {
                // Fetch farmer details to set location name
                pb.collection('farmers').getOne(fid).then(rec => {
                  if (rec) {
                    setAuditLocation(`${rec.farmer_code ? `[${rec.farmer_code}] ` : ''}${rec.full_name || rec.name}`);
                  }
                }).catch(console.error);
              }
            }, [])}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-primary-700">{t('auditor_name')}</Label>
            <Input
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder={t('full_name')}
              className="rounded-lg border-primary-200"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-primary-700">{t('audit_location_label', 'Manual Location / Subject Label')}</Label>
            <Input
              value={auditLocation}
              onChange={(e) => setAuditLocation(e.target.value)}
              placeholder={t('location')}
              className="rounded-lg border-primary-200"
            />
          </div>
        </div>
      </div>

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
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t('compliance_rate')}</span>
            <span className={`font-bold ${complianceRate >= 80 ? 'text-green-600' : complianceRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {complianceRate}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${complianceRate >= 80 ? 'bg-green-500' : complianceRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              style={{ width: `${complianceRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Assessment Sections */}
      {sections.map((section, sectionIdx) => {
        const prog = getSectionProgress(section.key);
        const isExpanded = expandedSections.has(section.key);
        const Icon = ICON_MAP[section.icon] || FileText;
        const sectionItems = checklist.filter(c => c.section === section.key);

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
                  <span className={`text-sm font-semibold ${section.color}`}>
                    {t(section.labelKey)}
                  </span>
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
                  {sectionItems.map((item) => {
                    const itemNum = getItemNumber(item);
                    const value = checks[item.id];
                    const hasNote = !!itemNotes[item.id];

                    return (
                      <div
                        key={item.id}
                        className={`rounded-lg border p-3 transition-all ${value === 'compliant'
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
                            <span className={`text-xs font-bold mt-0.5 shrink-0 ${value === 'compliant' ? 'text-green-600' :
                              value === 'non_compliant' ? 'text-red-600' :
                                'text-gray-400'
                              }`}>
                              {itemNum}
                            </span>
                            <span className={`text-sm leading-snug ${value === 'compliant' ? 'text-green-800' :
                              value === 'non_compliant' ? 'text-red-800' :
                                'text-gray-700'
                              }`}>
                              {t(item.labelKey)}
                            </span>
                          </div>
                          {value === 'compliant' && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
                          {value === 'non_compliant' && <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                          {value === 'na' && <Minus className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />}
                        </div>

                        <TriStateButton
                          value={value}
                          onChange={(v) => setCheck(item.id, v)}
                          t={t}
                        />

                        {(value === 'non_compliant' || hasNote) && (
                          <textarea
                            value={itemNotes[item.id] || ''}
                            onChange={(e) => setItemNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="w-full mt-2 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs min-h-[36px] placeholder:text-muted-foreground/50 focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
                            placeholder={t('item_note_placeholder')}
                          />
                        )}

                        {value !== 'non_compliant' && !hasNote && value !== 'unset' && (
                          <button
                            type="button"
                            onClick={() => setItemNotes(prev => ({ ...prev, [item.id]: '' }))}
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

      <Separator className="my-4" />

      {/* Overall Result */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
          <h3 className="font-semibold text-sm flex items-center gap-2 text-primary-800">
            <ClipboardCheck className="h-4 w-4" />
            {t('audit_result')}
          </h3>
        </div>
        <div className="p-4 space-y-4 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('overall_result')}</Label>
              <select
                value={overallResult}
                onChange={(e) => setOverallResult(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
              >
                <option value="pending">{t('pending')}</option>
                <option value="pass">{t('audit_pass')}</option>
                <option value="minor_nc">{t('audit_minor_nc')}</option>
                <option value="major_nc">{t('audit_major_nc')}</option>
                <option value="fail">{t('audit_fail')}</option>
              </select>
              <button
                type="button"
                className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                onClick={() => setOverallResult(autoResult())}
              >
                <ClipboardCheck className="h-3 w-3" />
                {t('auto_suggest')}: {t(`audit_${autoResult()}`)}
              </button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('next_review_date')}</Label>
              <Input
                type="date"
                value={nextAuditDate}
                onChange={(e) => setNextAuditDate(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('notes')}</Label>
            <textarea
              value={overallNotes}
              onChange={(e) => setOverallNotes(e.target.value)}
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
        </div>
      </div>

      {/* Centered Action Buttons */}
      <div className="flex justify-center gap-4 pt-6 mt-4 border-t">
        <Button
          variant="outline"
          className="rounded-lg px-8"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>
        <Button
          className="rounded-lg btn-3d-primary text-white px-8"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
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
