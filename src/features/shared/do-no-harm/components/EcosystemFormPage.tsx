import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, TreePine } from 'lucide-react';
import { useCreateEcosystemAssessment, useUpdateEcosystemAssessment, useFarmsList } from '../../farm-operations/hooks/useFarmOpsData';

interface EcosystemFormPageProps {
    country: string;
    editingItem?: Record<string, unknown> | null;
    onBack: () => void;
}

export function EcosystemFormPage({ country, editingItem, onBack }: EcosystemFormPageProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateEcosystemAssessment();
    const updateMutation = useUpdateEcosystemAssessment();
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
                <h2 className="text-xl font-bold">{isEditing ? t('edit_record') : t('add_record')} — {t('ecosystem_assessment')}</h2>
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
                                <Label>{t('farm')} *</Label>
                                <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="">{t('select_farm')}</option>
                                    {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('observation_date')} *</Label>
                                <Input name="assessment_date" type="date" required defaultValue={(editingItem?.assessment_date as string)?.split('T')[0] ?? ''} className="rounded-lg h-10" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Biodiversity */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><TreePine className="w-4 h-4 text-emerald-600" /></div>
                            🌿 Biodiversity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2"><Label>{t('tree_species_count')}</Label><Input name="species_count" type="number" min="0" defaultValue={(editingItem?.species_count as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label>Vegetation Cover %</Label><Input name="vegetation_cover_pct" type="number" min="0" max="100" defaultValue={(editingItem?.vegetation_cover_pct as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2">
                                <Label>Biodiversity Rating</Label>
                                <select name="biodiversity_rating" defaultValue={(editingItem?.biodiversity_rating as string) ?? 'good'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Tree Species</Label><Input name="tree_species_list" defaultValue={(editingItem?.tree_species_list as string) ?? ''} placeholder="e.g. Avocado, Macadamia, Teak" className="rounded-lg h-10" /></div>
                        <div className="space-y-2"><Label>{t('wildlife_observations')}</Label><Input name="wildlife_observed" defaultValue={(editingItem?.wildlife_observed as string) ?? ''} className="rounded-lg h-10" /></div>
                        <div className="space-y-2"><Label>Buffer Zone Details</Label><Input name="buffer_zone_details" defaultValue={(editingItem?.buffer_zone_details as string) ?? ''} className="rounded-lg h-10" /></div>
                        <div className="space-y-2"><Label>Waste Management</Label><Input name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} className="rounded-lg h-10" /></div>

                        <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
                            {[
                                { name: 'wild_beekeeping', label: '🐝 Wild Beekeeping' },
                                { name: 'managed_beekeeping', label: '🍯 Managed Beekeeping' },
                                { name: 'riparian_buffer_check', label: '💧 Riparian Buffer' },
                                { name: 'fire_usage', label: '🔥 Fire Usage' },
                            ].map(({ name, label }) => (
                                <div key={name} className="flex items-center gap-2">
                                    <input type="checkbox" id={`eco_${name}`} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300 accent-emerald-600" />
                                    <Label htmlFor={`eco_${name}`} className="cursor-pointer text-sm">{label}</Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
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
