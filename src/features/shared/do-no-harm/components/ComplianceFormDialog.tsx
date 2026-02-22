import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateComplianceRecord, useUpdateComplianceRecord, useFarmersList, useFarmsList } from '../../farm-operations/hooks/useFarmOpsData';

interface ComplianceFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

export function ComplianceFormDialog({ country, open, onOpenChange, editingItem }: ComplianceFormDialogProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateComplianceRecord();
    const updateMutation = useUpdateComplianceRecord();
    const { data: farmers } = useFarmersList(country);
    const { data: farms } = useFarmsList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

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
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onOpenChange(false) });
        } else {
            createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
        }
    };

    const currentYear = new Date().getFullYear();
    const selectClasses = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('edit_record') : t('add_record')}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* General Info */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('general_info', 'General Info')}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farmer_name')} *</span>
                                <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className={selectClasses}>
                                    <option value="">{t('select_farmer', 'Select farmer...')}</option>
                                    {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farm')}</span>
                                <select name="farm" defaultValue={(editingItem?.farm as string) ?? ''} className={selectClasses}>
                                    <option value="">{t('select_farm', 'Select farm...')}</option>
                                    {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('ghg_year')} *</span>
                                <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Risk & Status */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Risk & Status</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Contamination Risk</span>
                                <select name="contamination_risk_level" defaultValue={(editingItem?.contamination_risk_level as string) ?? 'none'} className={selectClasses}>
                                    <option value="none">None</option><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('correction_status')}</span>
                                <select name="corrective_action_status" defaultValue={(editingItem?.corrective_action_status as string) ?? 'na'} className={selectClasses}>
                                    <option value="na">N/A</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Compliance Checklist */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Compliance Checklist</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {[
                                { name: 'production_plan_recorded', label: 'Production Plan Recorded' },
                                { name: 'seed_purchase_notes', label: 'Seed Purchase Notes Kept' },
                                { name: 'worker_ppe_available', label: 'Worker PPE Available' },
                                { name: 'child_labor_check', label: 'No Child Labor' },
                                { name: 'access_drinking_water', label: 'Drinking Water Access' },
                                { name: 'hazardous_work_ppe', label: 'Hazardous Work PPE' },
                                { name: 'land_conversion_check', label: 'No Land Conversion' },
                                { name: 'wildlife_protection', label: 'Wildlife Protection' },
                                { name: 'fire_usage_policy', label: 'Fire Usage Policy' },
                                { name: 'compost_production', label: 'Compost Production' },
                                { name: 'compost_storage_distance', label: 'Compost 25m from Water' },
                            ].map(({ name, label }, idx) => (
                                <div key={name} className={`flex items-center gap-4 px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{label}</span>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input type="checkbox" id={`comp_${name}`} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                                        <label htmlFor={`comp_${name}`} className="text-sm text-gray-600 cursor-pointer select-none">Yes</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details & Worker Safety */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Details & Worker Safety</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Protective Measures</span>
                                <Input name="protective_measures" defaultValue={(editingItem?.protective_measures as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Non-Compliance Record</span>
                                <Input name="non_compliance_record" defaultValue={(editingItem?.non_compliance_record as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Waste Management</span>
                                <Input name="waste_management" defaultValue={(editingItem?.waste_management as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('residue_management')}</span>
                                <Input name="residue_management" defaultValue={(editingItem?.residue_management as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('work_accident_records')}</span>
                                <Input name="work_accident_records" defaultValue={(editingItem?.work_accident_records as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('first_aid_availability')}</span>
                                <Input name="first_aid_availability" defaultValue={(editingItem?.first_aid_availability as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('notes')}</span>
                                <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={isPending}>
                        {isEditing ? t('save_changes') : t('add_record')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
