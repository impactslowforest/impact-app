import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateEcosystemAssessment, useUpdateEcosystemAssessment, useFarmsList } from '../../farm-operations/hooks/useFarmOpsData';

interface EcosystemFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

export function EcosystemFormDialog({ country, open, onOpenChange, editingItem }: EcosystemFormDialogProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateEcosystemAssessment();
    const updateMutation = useUpdateEcosystemAssessment();
    const { data: farms } = useFarmsList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        if (data.species_count) data.species_count = parseInt(data.species_count as string) || 0;
        if (data.vegetation_cover_pct) data.vegetation_cover_pct = parseFloat(data.vegetation_cover_pct as string) || 0;
        data.wild_beekeeping = form.has('wild_beekeeping');
        data.managed_beekeeping = form.has('managed_beekeeping');
        data.riparian_buffer_check = form.has('riparian_buffer_check');
        data.fire_usage = form.has('fire_usage');
        data.country = country;

        if (isEditing) {
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onOpenChange(false) });
        } else {
            createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
        }
    };

    const selectClasses = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('edit_assessment', 'Edit Assessment') : t('add_assessment', 'Add Assessment')}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* General Info */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('general_info', 'General Info')}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farm')} *</span>
                                <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className={selectClasses}>
                                    <option value="">{t('select_farm', 'Select farm...')}</option>
                                    {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('assessment_date', 'Date')} *</span>
                                <Input name="assessment_date" type="date" required defaultValue={(editingItem?.assessment_date as string)?.split('T')[0] ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Biodiversity */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Biodiversity</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Species Count</span>
                                <Input name="species_count" type="number" min="0" defaultValue={(editingItem?.species_count as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Vegetation Cover %</span>
                                <Input name="vegetation_cover_pct" type="number" min="0" max="100" defaultValue={(editingItem?.vegetation_cover_pct as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Biodiversity Rating</span>
                                <select name="biodiversity_rating" defaultValue={(editingItem?.biodiversity_rating as string) ?? 'good'} className={selectClasses}>
                                    <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Tree Species</span>
                                <Input name="tree_species_list" defaultValue={(editingItem?.tree_species_list as string) ?? ''} placeholder="e.g. Avocado, Macadamia, Teak" className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Wildlife Observed</span>
                                <Input name="wildlife_observed" defaultValue={(editingItem?.wildlife_observed as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Buffer Zone Details</span>
                                <Input name="buffer_zone_details" defaultValue={(editingItem?.buffer_zone_details as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Waste Management</span>
                                <Input name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Ecosystem Checks */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Ecosystem Checks</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {[
                                { name: 'wild_beekeeping', label: 'Wild Beekeeping' },
                                { name: 'managed_beekeeping', label: 'Managed Beekeeping' },
                                { name: 'riparian_buffer_check', label: 'Riparian Buffer' },
                                { name: 'fire_usage', label: 'Fire Usage' },
                            ].map(({ name, label }, idx) => (
                                <div key={name} className={`flex items-center gap-4 px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{label}</span>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input type="checkbox" id={`eco_${name}`} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                                        <label htmlFor={`eco_${name}`} className="text-sm text-gray-600 cursor-pointer">Yes</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('notes')}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('notes')}</span>
                                <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : t('add_assessment', 'Add Assessment')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
