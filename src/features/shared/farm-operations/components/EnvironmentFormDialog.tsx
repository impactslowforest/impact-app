import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        // Numeric
        if (data.species_count) data.species_count = parseInt(data.species_count as string) || 0;
        if (data.vegetation_cover_pct) data.vegetation_cover_pct = parseFloat(data.vegetation_cover_pct as string) || 0;
        if (data.soil_ph) data.soil_ph = parseFloat(data.soil_ph as string) || 0;
        if (data.soil_ph_value) data.soil_ph_value = parseFloat(data.soil_ph_value as string) || 0;
        // Booleans
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('edit_assessment', 'Edit Assessment') : t('add_assessment', 'Add Assessment')}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* Farm + Date */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>{t('farm', 'Farm')} *</Label>
                            <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">{t('select_farm', 'Select farm...')}</option>
                                {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('assessment_date', 'Date')} *</Label>
                            <Input name="assessment_date" type="date" required defaultValue={(editingItem?.assessment_date as string)?.split('T')[0] ?? ''} className="rounded-lg" />
                        </div>
                    </div>

                    {/* ─── Risk Assessment ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">⚠️ Risk Assessment</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Water Pollution Risk</Label>
                            <select name="water_pollution_risk" defaultValue={(editingItem?.water_pollution_risk as string) ?? 'none'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Air Pollution Risk</Label>
                            <select name="air_pollution_risk" defaultValue={(editingItem?.air_pollution_risk as string) ?? 'none'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Distance to Chemical Farm</Label>
                            <Input name="distance_to_chemical_farm" defaultValue={(editingItem?.distance_to_chemical_farm as string) ?? ''} placeholder="e.g. 200m" className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Protection Method</Label>
                            <Input name="protection_method" defaultValue={(editingItem?.protection_method as string) ?? ''} placeholder="e.g. Buffer zone, fence" className="rounded-lg" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Buffer Zone (N/W/E/S)</Label>
                        <Input name="buffer_zone_nwes" defaultValue={(editingItem?.buffer_zone_nwes as string) ?? ''} placeholder="e.g. N:10m, W:5m, E:8m, S:12m" className="rounded-lg" />
                    </div>

                    {/* ─── Farm Tools & Compliance History ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🔧 Farm Tools & Compliance</h4>
                    <div className="space-y-1.5">
                        <Label>Farm Tools Inventory</Label>
                        <Input name="farm_tools_inventory" defaultValue={(editingItem?.farm_tools_inventory as string) ?? ''} placeholder="e.g. Sprayer, pruning shears, machete" className="rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Non-Conformity History</Label>
                        <Input name="non_conformity_history" defaultValue={(editingItem?.non_conformity_history as string) ?? ''} placeholder="Previous non-conformity issues..." className="rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Corrective Action</Label>
                            <Input name="corrective_action" defaultValue={(editingItem?.corrective_action as string) ?? ''} className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Correction Status</Label>
                            <select name="correction_status" defaultValue={(editingItem?.correction_status as string) ?? 'na'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="na">N/A</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {/* ─── Soil & Erosion (Indonesia-specific) ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🌍 Soil & Erosion</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>Soil pH</Label>
                            <Input name="soil_ph" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph as number) ?? ''} className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Erosion Management</Label>
                            <Input name="erosion_management" defaultValue={(editingItem?.erosion_management as string) ?? ''} placeholder="e.g. Terracing, cover crops" className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Organic Matter Status</Label>
                            <Input name="organic_matter_status" defaultValue={(editingItem?.organic_matter_status as string) ?? ''} placeholder="e.g. Good, depleted" className="rounded-lg" />
                        </div>
                    </div>

                    {/* ─── Ecosystem & Biodiversity ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🌿 Ecosystem & Biodiversity</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>Species Count</Label>
                            <Input name="species_count" type="number" min="0" defaultValue={(editingItem?.species_count as number) ?? ''} className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Vegetation Cover %</Label>
                            <Input name="vegetation_cover_pct" type="number" min="0" max="100" defaultValue={(editingItem?.vegetation_cover_pct as number) ?? ''} className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Soil pH (M012)</Label>
                            <Input name="soil_ph_value" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph_value as number) ?? ''} className="rounded-lg" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Tree Species List</Label>
                        <Input name="tree_species_list" defaultValue={(editingItem?.tree_species_list as string) ?? ''} placeholder="e.g. Avocado, Macadamia, Teak" className="rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Wildlife Observed</Label>
                        <Input name="wildlife_observed" defaultValue={(editingItem?.wildlife_observed as string) ?? ''} placeholder="e.g. Birds, reptiles, mammals" className="rounded-lg" />
                    </div>

                    {/* ─── Checkboxes ─── */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { name: 'wild_beekeeping', label: '🐝 Wild Beekeeping' },
                            { name: 'managed_beekeeping', label: '🍯 Managed Beekeeping' },
                            { name: 'riparian_buffer_check', label: '💧 Riparian Buffer' },
                            { name: 'fire_usage', label: '🔥 Fire Usage' },
                        ].map(({ name, label }) => (
                            <div key={name} className="flex items-center gap-2">
                                <input type="checkbox" id={name} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300" />
                                <Label htmlFor={name} className="cursor-pointer">{label}</Label>
                            </div>
                        ))}
                    </div>

                    {/* ─── Waste ─── */}
                    <div className="space-y-1.5">
                        <Label>Waste Management Notes</Label>
                        <Input name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} className="rounded-lg" />
                    </div>

                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={createMutation.isPending || updateMutation.isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : t('add_assessment', 'Add Assessment')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
