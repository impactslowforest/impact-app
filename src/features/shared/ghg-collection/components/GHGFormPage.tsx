import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Zap, Flame, FlaskConical } from 'lucide-react';
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
                {/* Section 1: Basic Info */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-blue-600" />
                            </div>
                            {t('general_info')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('farmer_name')} *</Label>
                                <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background transition-colors focus:ring-2 focus:ring-primary/20">
                                    <option value="">{t('select_farmer')}</option>
                                    {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('ghg_year')} *</Label>
                                <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="rounded-lg h-10" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Emission Sources */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Flame className="w-4 h-4 text-orange-600" />
                            </div>
                            {t('emission_sources')} (tCO₂e)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-1.5">⚡ {t('electricity_emissions')}</Label>
                                <Input name="electricity_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.electricity_emissions_tco2e as number) ?? ''} className="rounded-lg h-10" placeholder="0.000" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-1.5">⛽ {t('fuel_combustion_emissions')}</Label>
                                <Input name="fuel_combustion_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.fuel_combustion_emissions_tco2e as number) ?? ''} className="rounded-lg h-10" placeholder="0.000" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-1.5">🧪 {t('n_fert_emissions')}</Label>
                                <Input name="n_fert_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.n_fert_emissions_tco2e as number) ?? ''} className="rounded-lg h-10" placeholder="0.000" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-1.5">🗑️ {t('waste_emissions')}</Label>
                                <Input name="waste_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.waste_emissions_tco2e as number) ?? ''} className="rounded-lg h-10" placeholder="0.000" />
                            </div>
                        </div>

                        <div className="mt-5 p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-red-700 flex items-center gap-1.5">🔥 {t('total_emissions')}</Label>
                                <Input name="total_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.total_emissions_tco2e as number) ?? ''} className="rounded-lg h-10 border-red-200 bg-white font-semibold" placeholder="0.000" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Notes */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FlaskConical className="w-4 h-4 text-gray-600" />
                            </div>
                            {t('notes')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            name="notes"
                            defaultValue={(editingItem?.notes as string) ?? ''}
                            rows={3}
                            className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background resize-none transition-colors focus:ring-2 focus:ring-primary/20"
                            placeholder={t('notes') + '...'}
                        />
                    </CardContent>
                </Card>

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
