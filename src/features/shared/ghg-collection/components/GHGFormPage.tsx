import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useCreateGHGEmission, useUpdateGHGEmission, useFarmersList } from '../../farm-operations/hooks/useFarmOpsData';

interface GHGFormPageProps {
    country: string;
    editingItem?: Record<string, unknown> | null;
    onBack: () => void;
}

export function GHGFormPage({ country, editingItem, onBack }: GHGFormPageProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateGHGEmission();
    const updateMutation = useUpdateGHGEmission();
    const { data: farmers } = useFarmersList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (formRef.current) formRef.current.reset(); }, [editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        const numericFields = ['year', 'electricity_emissions_tco2e', 'fuel_combustion_emissions_tco2e', 'n_fert_emissions_tco2e', 'waste_emissions_tco2e', 'total_emissions_tco2e'];
        numericFields.forEach(f => { if (data[f]) data[f] = parseFloat(data[f] as string) || 0; });
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
            {/* Header with back button */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    {t('go_back')}
                </Button>
                <div className="h-6 w-px bg-border" />
                <h2 className="text-xl font-bold text-foreground">
                    {isEditing ? t('edit_record') : t('add_record')} — {t('ghg_record')}
                </h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: General Info */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('general_info')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farmer_name')} *</span>
                            <select
                                name="farmer"
                                required
                                defaultValue={(editingItem?.farmer as string) ?? ''}
                                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                            >
                                <option value="">{t('select_farmer')}</option>
                                {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('ghg_year')} *</span>
                            <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="flex-1 rounded-lg bg-white" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Emission Sources */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('emission_sources')} (tCO2e)</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('electricity_emissions')}</span>
                            <Input name="electricity_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.electricity_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" placeholder="0.000" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('fuel_combustion_emissions')}</span>
                            <Input name="fuel_combustion_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.fuel_combustion_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" placeholder="0.000" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('n_fert_emissions')}</span>
                            <Input name="n_fert_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.n_fert_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" placeholder="0.000" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('waste_emissions')}</span>
                            <Input name="waste_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.waste_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" placeholder="0.000" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('total_emissions')}</span>
                            <Input name="total_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.total_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" placeholder="0.000" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Notes */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('notes')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-start gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0 pt-2">{t('notes')}</span>
                            <textarea
                                name="notes"
                                defaultValue={(editingItem?.notes as string) ?? ''}
                                rows={3}
                                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                                placeholder={t('notes') + '...'}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="flex-1 h-12 btn-3d-primary text-white rounded-xl text-base font-semibold shadow-lg" disabled={isPending}>
                        {isPending ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" />{t('loading')}</>
                        ) : (
                            <><Save className="w-5 h-5 mr-2" />{isEditing ? t('save_changes') : t('add_record')}</>
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl">
                        {t('cancel')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
