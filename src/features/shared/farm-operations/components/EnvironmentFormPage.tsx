import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, TreePine, AlertTriangle, Wrench, Globe } from 'lucide-react';
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
                {/* Farm + Date */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><TreePine className="w-4 h-4 text-blue-600" /></div>
                            {t('general_info')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('farm')} *</Label>
                                <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="">{t('select_farm')}</option>
                                    {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('observation_date')} *</Label>
                                <Input name="assessment_date" type="date" required defaultValue={(editingItem?.assessment_date as string)?.split('T')[0] ?? ''} className="rounded-lg h-10" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Assessment */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50/20">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
                            ⚠️ Risk Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Water Pollution Risk</Label>
                                <select name="water_pollution_risk" defaultValue={(editingItem?.water_pollution_risk as string) ?? 'none'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Air Pollution Risk</Label>
                                <select name="air_pollution_risk" defaultValue={(editingItem?.air_pollution_risk as string) ?? 'none'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="none">None</option><option value="little">Little</option><option value="moderate">Moderate</option><option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('distance_to_chemical_farm')}</Label>
                                <Input name="distance_to_chemical_farm" defaultValue={(editingItem?.distance_to_chemical_farm as string) ?? ''} placeholder="e.g. 200m" className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Protection Method</Label>
                                <Input name="protection_method" defaultValue={(editingItem?.protection_method as string) ?? ''} placeholder="e.g. Buffer zone, fence" className="rounded-lg h-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Buffer Zone (N/W/E/S)</Label>
                            <Input name="buffer_zone_nwes" defaultValue={(editingItem?.buffer_zone_nwes as string) ?? ''} placeholder="e.g. N:10m, W:5m, E:8m, S:12m" className="rounded-lg h-10" />
                        </div>
                    </CardContent>
                </Card>

                {/* Farm Tools & Compliance */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Wrench className="w-4 h-4 text-amber-600" /></div>
                            🔧 {t('farm_tools_inventory')} & {t('corrective_action')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">{t('farm_tools_inventory')}</Label>
                            <Input name="farm_tools_inventory" defaultValue={(editingItem?.farm_tools_inventory as string) ?? ''} placeholder="e.g. Sprayer, pruning shears, machete" className="rounded-lg h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">{t('non_conformity_history')}</Label>
                            <Input name="non_conformity_history" defaultValue={(editingItem?.non_conformity_history as string) ?? ''} placeholder="Previous non-conformity issues..." className="rounded-lg h-10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('corrective_action')}</Label>
                                <Input name="corrective_action" defaultValue={(editingItem?.corrective_action as string) ?? ''} className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('correction_status')}</Label>
                                <select name="correction_status" defaultValue={(editingItem?.correction_status as string) ?? 'na'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="na">N/A</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Soil & Erosion */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><Globe className="w-4 h-4 text-green-600" /></div>
                            🌍 Soil & Erosion
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('soil_ph_value')}</Label>
                                <Input name="soil_ph" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph as number) ?? ''} className="rounded-lg h-10" placeholder="0-14" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('erosion_management')}</Label>
                                <Input name="erosion_management" defaultValue={(editingItem?.erosion_management as string) ?? ''} placeholder="e.g. Terracing, cover crops" className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('organic_matter_status')}</Label>
                                <Input name="organic_matter_status" defaultValue={(editingItem?.organic_matter_status as string) ?? ''} placeholder="e.g. Good, depleted" className="rounded-lg h-10" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ecosystem & Biodiversity */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><TreePine className="w-4 h-4 text-emerald-600" /></div>
                            🌿 Ecosystem & Biodiversity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('tree_species_count')}</Label>
                                <Input name="species_count" type="number" min="0" defaultValue={(editingItem?.species_count as number) ?? ''} className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Vegetation Cover %</Label>
                                <Input name="vegetation_cover_pct" type="number" min="0" max="100" defaultValue={(editingItem?.vegetation_cover_pct as number) ?? ''} className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('soil_ph_value')} (M012)</Label>
                                <Input name="soil_ph_value" type="number" step="0.1" min="0" max="14" defaultValue={(editingItem?.soil_ph_value as number) ?? ''} className="rounded-lg h-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Tree Species List</Label>
                            <Input name="tree_species_list" defaultValue={(editingItem?.tree_species_list as string) ?? ''} placeholder="e.g. Avocado, Macadamia, Teak" className="rounded-lg h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">{t('wildlife_observations')}</Label>
                            <Input name="wildlife_observed" defaultValue={(editingItem?.wildlife_observed as string) ?? ''} placeholder="e.g. Birds, reptiles, mammals" className="rounded-lg h-10" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
                            {[
                                { name: 'wild_beekeeping', label: '🐝 Wild Beekeeping' },
                                { name: 'managed_beekeeping', label: '🍯 Managed Beekeeping' },
                                { name: 'riparian_buffer_check', label: '💧 Riparian Buffer' },
                                { name: 'fire_usage', label: '🔥 Fire Usage' },
                            ].map(({ name, label }) => (
                                <div key={name} className="flex items-center gap-2">
                                    <input type="checkbox" id={name} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300 accent-emerald-600" />
                                    <Label htmlFor={name} className="cursor-pointer text-sm">{label}</Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Waste & Notes */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Waste Management Notes</Label>
                            <textarea name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} rows={3} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background resize-none" />
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
