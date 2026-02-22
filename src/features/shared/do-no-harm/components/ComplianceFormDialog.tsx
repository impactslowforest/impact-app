import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        if (data.year) data.year = parseInt(data.year as string) || new Date().getFullYear();
        // ALL Boolean fields
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Compliance Record' : 'Add Compliance Record'}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* Identity */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>Farmer *</Label>
                            <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">Select farmer...</option>
                                {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Farm</Label>
                            <select name="farm" defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">Select farm...</option>
                                {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Year *</Label>
                            <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="rounded-lg" />
                        </div>
                    </div>

                    {/* ─── Risk & Status ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">⚠️ Risk & Status</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Contamination Risk Level</Label>
                            <select name="contamination_risk_level" defaultValue={(editingItem?.contamination_risk_level as string) ?? 'none'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="none">None</option><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Corrective Action Status</Label>
                            <select name="corrective_action_status" defaultValue={(editingItem?.corrective_action_status as string) ?? 'na'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="na">N/A</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {/* ─── Compliance Checklist (all bool fields) ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">✅ Compliance Checklist</h4>
                    <div className="grid grid-cols-2 gap-2">
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
                                <input type="checkbox" id={`comp_${name}`} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300" />
                                <Label htmlFor={`comp_${name}`} className="cursor-pointer text-sm">{label}</Label>
                            </div>
                        ))}
                    </div>

                    {/* ─── Text Detail Fields ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">📝 Details</h4>
                    <div className="space-y-1.5">
                        <Label>Protective Measures</Label>
                        <Input name="protective_measures" defaultValue={(editingItem?.protective_measures as string) ?? ''} placeholder="Describe protective measures taken..." className="rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Non-Compliance Record</Label>
                        <Input name="non_compliance_record" defaultValue={(editingItem?.non_compliance_record as string) ?? ''} placeholder="Previous issues recorded..." className="rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Waste Management</Label>
                        <Input name="waste_management" defaultValue={(editingItem?.waste_management as string) ?? ''} placeholder="Waste disposal practices..." className="rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Residue Management</Label>
                        <Input name="residue_management" defaultValue={(editingItem?.residue_management as string) ?? ''} placeholder="How crop residues are handled..." className="rounded-lg" />
                    </div>

                    {/* ─── Worker Safety ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🩺 Worker Safety</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Work Accident Records</Label>
                            <Input name="work_accident_records" defaultValue={(editingItem?.work_accident_records as string) ?? ''} placeholder="Any accidents recorded..." className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>First Aid Availability</Label>
                            <Input name="first_aid_availability" defaultValue={(editingItem?.first_aid_availability as string) ?? ''} placeholder="e.g. Kit available, trained staff" className="rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Notes</Label>
                        <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="rounded-lg" />
                    </div>

                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={createMutation.isPending || updateMutation.isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : 'Add Record'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
