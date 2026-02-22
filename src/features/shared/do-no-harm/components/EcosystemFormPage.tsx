import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
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

    const selectClasses = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

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
                {/* General Info */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('general_info')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farm')} *</span>
                            <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className={selectClasses}>
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

                {/* Biodiversity */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Biodiversity</h3>
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
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Biodiversity Rating</span>
                            <select name="biodiversity_rating" defaultValue={(editingItem?.biodiversity_rating as string) ?? 'good'} className={selectClasses}>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Tree Species</span>
                            <Input name="tree_species_list" defaultValue={(editingItem?.tree_species_list as string) ?? ''} placeholder="e.g. Avocado, Macadamia, Teak" className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('wildlife_observations')}</span>
                            <Input name="wildlife_observed" defaultValue={(editingItem?.wildlife_observed as string) ?? ''} className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Buffer Zone Details</span>
                            <Input name="buffer_zone_details" defaultValue={(editingItem?.buffer_zone_details as string) ?? ''} className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Waste Management</span>
                            <Input name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} className="flex-1 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Wild Beekeeping</span>
                            <div className="flex-1 flex items-center gap-2">
                                <input type="checkbox" id="eco_wild_beekeeping" name="wild_beekeeping" defaultChecked={!!editingItem?.wild_beekeeping} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                                <label htmlFor="eco_wild_beekeeping" className="text-sm text-gray-600 cursor-pointer">Yes</label>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Managed Beekeeping</span>
                            <div className="flex-1 flex items-center gap-2">
                                <input type="checkbox" id="eco_managed_beekeeping" name="managed_beekeeping" defaultChecked={!!editingItem?.managed_beekeeping} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                                <label htmlFor="eco_managed_beekeeping" className="text-sm text-gray-600 cursor-pointer">Yes</label>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Riparian Buffer</span>
                            <div className="flex-1 flex items-center gap-2">
                                <input type="checkbox" id="eco_riparian_buffer_check" name="riparian_buffer_check" defaultChecked={!!editingItem?.riparian_buffer_check} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                                <label htmlFor="eco_riparian_buffer_check" className="text-sm text-gray-600 cursor-pointer">Yes</label>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Fire Usage</span>
                            <div className="flex-1 flex items-center gap-2">
                                <input type="checkbox" id="eco_fire_usage" name="fire_usage" defaultChecked={!!editingItem?.fire_usage} className="h-4 w-4 rounded border-gray-300 accent-primary-600" />
                                <label htmlFor="eco_fire_usage" className="text-sm text-gray-600 cursor-pointer">Yes</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('notes')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-start gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0 pt-2">{t('notes')}</span>
                            <textarea name="notes" defaultValue={(editingItem?.notes as string) ?? ''} rows={3} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none resize-none" />
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
