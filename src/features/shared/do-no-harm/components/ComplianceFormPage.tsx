import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, ShieldCheck, AlertTriangle, Stethoscope } from 'lucide-react';
import { useCreateComplianceRecord, useUpdateComplianceRecord, useFarmersList, useFarmsList } from '../../farm-operations/hooks/useFarmOpsData';

interface ComplianceFormPageProps {
    country: string;
    editingItem?: Record<string, unknown> | null;
    onBack: () => void;
}

export function ComplianceFormPage({ country, editingItem, onBack }: ComplianceFormPageProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateComplianceRecord();
    const updateMutation = useUpdateComplianceRecord();
    const { data: farmers } = useFarmersList(country);
    const { data: farms } = useFarmsList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (formRef.current) formRef.current.reset(); }, [editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        if (data.year) data.year = parseInt(data.year as string) || new Date().getFullYear();
        const boolFields = [
            'production_plan_recorded', 'seed_purchase_notes', 'worker_ppe_available',
            'child_labor_check', 'access_drinking_water', 'hazardous_work_ppe',
            'land_conversion_check', 'wildlife_protection', 'fire_usage_policy',
            'compost_production', 'compost_storage_distance',
        ];
        boolFields.forEach(f => { data[f] = form.has(f); });
        data.country = country;

        if (isEditing) {
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onBack() });
        } else {
            createMutation.mutate(data, { onSuccess: () => onBack() });
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />{t('go_back')}
                </Button>
                <div className="h-6 w-px bg-border" />
                <h2 className="text-xl font-bold">{isEditing ? t('edit_record') : t('add_record')} — {t('compliance_record')}</h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Identity */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-blue-600" /></div>
                            {t('general_info')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <Label>{t('farmer_name')} *</Label>
                                <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="">{t('select_farmer')}</option>
                                    {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('farm')}</Label>
                                <select name="farm" defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="">{t('select_farm')}</option>
                                    {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('ghg_year')} *</Label>
                                <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="rounded-lg h-10" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk & Status */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50/20">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
                            ⚠️ Risk & Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label>Contamination Risk Level</Label>
                                <select name="contamination_risk_level" defaultValue={(editingItem?.contamination_risk_level as string) ?? 'none'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="none">None</option><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('correction_status')}</Label>
                                <select name="corrective_action_status" defaultValue={(editingItem?.corrective_action_status as string) ?? 'na'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="na">N/A</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Checklist */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                            ✅ Compliance Checklist
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
                            {[
                                { name: 'production_plan_recorded', label: '📋 Production plan recorded' },
                                { name: 'seed_purchase_notes', label: '🌱 Seed purchase notes kept' },
                                { name: 'worker_ppe_available', label: '🦺 Worker PPE available' },
                                { name: 'child_labor_check', label: '👶 No child labor' },
                                { name: 'access_drinking_water', label: '💧 Drinking water access' },
                                { name: 'hazardous_work_ppe', label: '⚠️ Hazardous work PPE' },
                                { name: 'land_conversion_check', label: '🏔️ No land conversion' },
                                { name: 'wildlife_protection', label: '🦜 Wildlife protection' },
                                { name: 'fire_usage_policy', label: '🔥 Fire usage policy' },
                                { name: 'compost_production', label: '♻️ Compost production' },
                                { name: 'compost_storage_distance', label: '📏 Compost 25m from water' },
                            ].map(({ name, label }) => (
                                <div key={name} className="flex items-center gap-2">
                                    <input type="checkbox" id={`comp_${name}`} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300 accent-emerald-600" />
                                    <Label htmlFor={`comp_${name}`} className="cursor-pointer text-sm">{label}</Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Details + Worker Safety */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4"><CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" /> 📝 Details & Worker Safety
                    </CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Protective Measures</Label><Input name="protective_measures" defaultValue={(editingItem?.protective_measures as string) ?? ''} className="rounded-lg h-10" /></div>
                        <div className="space-y-2"><Label>Non-Compliance Record</Label><Input name="non_compliance_record" defaultValue={(editingItem?.non_compliance_record as string) ?? ''} className="rounded-lg h-10" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2"><Label>Waste Management</Label><Input name="waste_management" defaultValue={(editingItem?.waste_management as string) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label>{t('residue_management')}</Label><Input name="residue_management" defaultValue={(editingItem?.residue_management as string) ?? ''} className="rounded-lg h-10" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2"><Label>{t('work_accident_records')}</Label><Input name="work_accident_records" defaultValue={(editingItem?.work_accident_records as string) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label>{t('first_aid_availability')}</Label><Input name="first_aid_availability" defaultValue={(editingItem?.first_aid_availability as string) ?? ''} className="rounded-lg h-10" /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('notes')}</Label>
                            <textarea name="notes" defaultValue={(editingItem?.notes as string) ?? ''} rows={3} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background resize-none" />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="flex-1 h-12 btn-3d-primary text-white rounded-xl text-base font-semibold shadow-lg" disabled={isPending}>
                        {isPending ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />{t('loading')}</> : <><Save className="w-5 h-5 mr-2" />{isEditing ? t('save_changes') : t('add_record')}</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl">{t('cancel')}</Button>
                </div>
            </form>
        </div>
    );
}
