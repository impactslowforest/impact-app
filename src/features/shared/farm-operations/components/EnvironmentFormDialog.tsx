import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateEnvironmentAssessment, useUpdateEnvironmentAssessment, useFarmsList } from '../hooks/useFarmOpsData';

interface EnvironmentFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

export function EnvironmentFormDialog({ country, open, onOpenChange, editingItem }: EnvironmentFormDialogProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateEnvironmentAssessment();
    const updateMutation = useUpdateEnvironmentAssessment();
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
        if (data.soil_ph) data.soil_ph = parseFloat(data.soil_ph as string) || 0;
        if (data.soil_ph_value) data.soil_ph_value = parseFloat(data.soil_ph_value as string) || 0;
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

                    {/* Risk Assessment */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Risk Assessment</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Water Pollution Risk</span>
                                <select name="water_pollution_risk" defaultValue={(editingItem?.water_pollution_risk as string) ?? 'none'} className={selectClasses}>
                                    <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Air Pollution Risk</span>
                                <select name="air_pollution_risk" defaultValue={(editingItem?.air_pollution_risk as string) ?? 'none'} className={selectClasses}>
                                    <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Distance to Chemical Farm</span>
                                <Input name="distance_to_chemical_farm" defaultValue={(editingItem?.distance_to_chemical_farm as string) ?? ''} placeholder="e.g. 200m" className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Protection Method</span>
                                <Input name="protection_method" defaultValue={(editingItem?.protection_method as string) ?? ''} placeholder="e.g. Buffer zone, fence" className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Buffer Zone (N/W/E/S)</span>
                                <Input name="buffer_zone_nwes" defaultValue={(editingItem?.buffer_zone_nwes as string) ?? ''} placeholder="e.g. N:10m, W:5m, E:8m, S:12m" className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Farm Tools & Compliance */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Farm Tools & Compliance</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Farm Tools Inventory</span>
                                <Input name="farm_tools_inventory" defaultValue={(editingItem?.farm_tools_inventory as string) ?? ''} placeholder="e.g. Sprayer, pruning shears" className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Non-Conformity History</span>
                                <Input name="non_conformity_history" defaultValue={(editingItem?.non_conformity_history as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Corrective Action</span>
                                <Input name="corrective_action" defaultValue={(editingItem?.corrective_action as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('correction_status')}</span>
                                <select name="correction_status" defaultValue={(editingItem?.correction_status as string) ?? 'na'} className={selectClasses}>
                                    <option value="na">N/A</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Soil & Erosion */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Soil & Erosion</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Soil pH</span>
                                <Input name="soil_ph" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Erosion Management</span>
                                <Input name="erosion_management" defaultValue={(editingItem?.erosion_management as string) ?? ''} placeholder="e.g. Terracing, cover crops" className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Organic Matter Status</span>
                                <Input name="organic_matter_status" defaultValue={(editingItem?.organic_matter_status as string) ?? ''} placeholder="e.g. Good, depleted" className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Ecosystem & Biodiversity */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Ecosystem & Biodiversity</h3>
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
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Soil pH (M012)</span>
                                <Input name="soil_ph_value" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph_value as number) ?? ''} className="flex-1 rounded-lg bg-white" />
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
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Waste Management</span>
                                <Input name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            {[
                                { name: 'wild_beekeeping', label: 'Wild Beekeeping' },
                                { name: 'managed_beekeeping', label: 'Managed Beekeeping' },
                                { name: 'riparian_buffer_check', label: 'Riparian Buffer' },
                                { name: 'fire_usage', label: 'Fire Usage' },
                            ].map(({ name, label }, idx) => (
                                <div key={name} className={`flex items-center gap-4 px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{label}</span>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input type="checkbox" id={name} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                                        <label htmlFor={name} className="text-sm text-gray-600 cursor-pointer">Yes</label>
                                    </div>
                                </div>
                            ))}
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
