import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useCreateEnvironmentAssessment, useUpdateEnvironmentAssessment, useFarmsList } from '../hooks/useFarmOpsData';

interface EnvironmentFormPageProps {
    country: string;
    editingItem?: Record<string, unknown> | null;
    onBack: () => void;
}

export function EnvironmentFormPage({ country, editingItem, onBack }: EnvironmentFormPageProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateEnvironmentAssessment();
    const updateMutation = useUpdateEnvironmentAssessment();
    const { data: farms } = useFarmsList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (formRef.current) formRef.current.reset(); }, [editingItem]);

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
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onBack() });
        } else {
            createMutation.mutate(data, { onSuccess: () => onBack() });
        }
    };

    const selectClass = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

    return (
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />{t('go_back')}
                </Button>
                <div className="h-6 w-px bg-border" />
                <h2 className="text-xl font-bold text-foreground">
                    {isEditing ? t('edit_record') : t('add_record')} — {t('environment_assessment')}
                </h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* General Info */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('general_info')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farm')} *</span>
                            <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className={selectClass}>
                                <option value="">{t('select_farm')}</option>
                                {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('observation_date')} *</span>
                            <Input name="assessment_date" type="date" required defaultValue={(editingItem?.assessment_date as string)?.split('T')[0] ?? ''} className="flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Risk Assessment */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Risk Assessment</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Water Pollution Risk</span>
                            <select name="water_pollution_risk" defaultValue={(editingItem?.water_pollution_risk as string) ?? 'none'} className={selectClass}>
                                <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Air Pollution Risk</span>
                            <select name="air_pollution_risk" defaultValue={(editingItem?.air_pollution_risk as string) ?? 'none'} className={selectClass}>
                                <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('distance_to_chemical_farm')}</span>
                            <Input name="distance_to_chemical_farm" defaultValue={(editingItem?.distance_to_chemical_farm as string) ?? ''} placeholder="e.g. 200m" className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Protection Method</span>
                            <Input name="protection_method" defaultValue={(editingItem?.protection_method as string) ?? ''} placeholder="e.g. Buffer zone, fence" className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Buffer Zone (N/W/E/S)</span>
                            <Input name="buffer_zone_nwes" defaultValue={(editingItem?.buffer_zone_nwes as string) ?? ''} placeholder="e.g. N:10m, W:5m, E:8m, S:12m" className="flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Farm Tools & Compliance */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('farm_tools_inventory')} & {t('corrective_action')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farm_tools_inventory')}</span>
                            <Input name="farm_tools_inventory" defaultValue={(editingItem?.farm_tools_inventory as string) ?? ''} placeholder="e.g. Sprayer, pruning shears, machete" className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('non_conformity_history')}</span>
                            <Input name="non_conformity_history" defaultValue={(editingItem?.non_conformity_history as string) ?? ''} placeholder="Previous non-conformity issues..." className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('corrective_action')}</span>
                            <Input name="corrective_action" defaultValue={(editingItem?.corrective_action as string) ?? ''} className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('correction_status')}</span>
                            <select name="correction_status" defaultValue={(editingItem?.correction_status as string) ?? 'na'} className={selectClass}>
                                <option value="na">N/A</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Soil & Erosion */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Soil & Erosion</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('soil_ph_value')}</span>
                            <Input name="soil_ph" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph as number) ?? ''} className="flex-1 rounded-lg" placeholder="0-14" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('erosion_management')}</span>
                            <Input name="erosion_management" defaultValue={(editingItem?.erosion_management as string) ?? ''} placeholder="e.g. Terracing, cover crops" className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('organic_matter_status')}</span>
                            <Input name="organic_matter_status" defaultValue={(editingItem?.organic_matter_status as string) ?? ''} placeholder="e.g. Good, depleted" className="flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Ecosystem & Biodiversity */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Ecosystem & Biodiversity</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('tree_species_count')}</span>
                            <Input name="species_count" type="number" min="0" defaultValue={(editingItem?.species_count as number) ?? ''} className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Vegetation Cover %</span>
                            <Input name="vegetation_cover_pct" type="number" min="0" max="100" defaultValue={(editingItem?.vegetation_cover_pct as number) ?? ''} className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('soil_ph_value')} (M012)</span>
                            <Input name="soil_ph_value" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph_value as number) ?? ''} className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Tree Species List</span>
                            <Input name="tree_species_list" defaultValue={(editingItem?.tree_species_list as string) ?? ''} placeholder="e.g. Avocado, Macadamia, Teak" className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('wildlife_observations')}</span>
                            <Input name="wildlife_observed" defaultValue={(editingItem?.wildlife_observed as string) ?? ''} placeholder="e.g. Birds, reptiles, mammals" className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Wild Beekeeping</span>
                            <input type="checkbox" name="wild_beekeeping" defaultChecked={!!editingItem?.wild_beekeeping} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Managed Beekeeping</span>
                            <input type="checkbox" name="managed_beekeeping" defaultChecked={!!editingItem?.managed_beekeeping} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Riparian Buffer</span>
                            <input type="checkbox" name="riparian_buffer_check" defaultChecked={!!editingItem?.riparian_buffer_check} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Fire Usage</span>
                            <input type="checkbox" name="fire_usage" defaultChecked={!!editingItem?.fire_usage} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Notes</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-start gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0 pt-2">Waste Management Notes</span>
                            <textarea name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} rows={3} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none resize-none" />
                        </div>
                    </div>
                </div>

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
