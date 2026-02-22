import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Coffee, DollarSign, TreePine, Landmark } from 'lucide-react';
import { useCreateProductionRecord, useUpdateProductionRecord, useFarmersList } from '../hooks/useFarmOpsData';

interface ProductionFormPageProps {
    country: string;
    editingItem?: Record<string, unknown> | null;
    onBack: () => void;
}

export function ProductionFormPage({ country, editingItem, onBack }: ProductionFormPageProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateProductionRecord();
    const updateMutation = useUpdateProductionRecord();
    const { data: farmers } = useFarmersList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (formRef.current) formRef.current.reset(); }, [editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        const numericFields = [
            'year', 'annual_cherry_kg', 'high_quality_cherry_kg',
            'a_cherry_estimation_kg', 'r_cherry_estimation_kg',
            'total_coffee_income', 'total_production_cost',
            'fertilizer_cost', 'pesticide_cost', 'fuel_cost',
            'hired_labor_cost', 'other_costs',
            'total_household_income', 'current_debt', 'remaining_cash',
            'shade_trees_planted', 'shade_trees_survived',
        ];
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
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />{t('go_back')}
                </Button>
                <div className="h-6 w-px bg-border" />
                <h2 className="text-xl font-bold text-foreground">
                    {isEditing ? t('edit_record') : t('add_record')} — {t('production_record')}
                </h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Identity */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Coffee className="w-4 h-4 text-blue-600" /></div>
                            {t('general_info')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('farmer_name')} *</Label>
                                <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="">{t('select_farmer')}</option>
                                    {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('harvest_year')} *</Label>
                                <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Season</Label>
                                <select name="season" defaultValue={(editingItem?.season as string) ?? 'main'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="main">Main</option><option value="mid">Mid</option><option value="fly">Fly</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Production */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><Coffee className="w-4 h-4 text-green-600" /></div>
                            🌿 Production
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2"><Label className="text-sm font-medium">Annual Cherry (kg)</Label><Input name="annual_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.annual_cherry_kg as number) ?? ''} className="rounded-lg h-10" placeholder="0.0" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">{t('high_quality_cherry_kg')}</Label><Input name="high_quality_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.high_quality_cherry_kg as number) ?? ''} className="rounded-lg h-10" placeholder="0.0" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Arabica Estimation (kg)</Label><Input name="a_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.a_cherry_estimation_kg as number) ?? ''} className="rounded-lg h-10" placeholder="0.0" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Robusta Estimation (kg)</Label><Input name="r_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.r_cherry_estimation_kg as number) ?? ''} className="rounded-lg h-10" placeholder="0.0" /></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center"><DollarSign className="w-4 h-4 text-yellow-600" /></div>
                            💰 Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2"><Label className="text-sm font-medium">Total Coffee Income</Label><Input name="total_coffee_income" type="number" defaultValue={(editingItem?.total_coffee_income as number) ?? ''} className="rounded-lg h-10" placeholder="0" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">{t('total_household_income')}</Label><Input name="total_household_income" type="number" defaultValue={(editingItem?.total_household_income as number) ?? ''} className="rounded-lg h-10" placeholder="0" /></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Production Costs */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center"><DollarSign className="w-4 h-4 text-orange-600" /></div>
                            📊 Production Costs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2"><Label className="text-sm font-medium">Total Production Cost</Label><Input name="total_production_cost" type="number" defaultValue={(editingItem?.total_production_cost as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Fertilizer Cost</Label><Input name="fertilizer_cost" type="number" defaultValue={(editingItem?.fertilizer_cost as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Pesticide Cost</Label><Input name="pesticide_cost" type="number" defaultValue={(editingItem?.pesticide_cost as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Fuel Cost</Label><Input name="fuel_cost" type="number" defaultValue={(editingItem?.fuel_cost as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Hired Labor Cost</Label><Input name="hired_labor_cost" type="number" defaultValue={(editingItem?.hired_labor_cost as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Other Costs</Label><Input name="other_costs" type="number" defaultValue={(editingItem?.other_costs as number) ?? ''} className="rounded-lg h-10" /></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Status */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Landmark className="w-4 h-4 text-indigo-600" /></div>
                            🏦 Financial Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2"><Label className="text-sm font-medium">{t('current_debt')}</Label><Input name="current_debt" type="number" defaultValue={(editingItem?.current_debt as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">{t('remaining_cash')}</Label><Input name="remaining_cash" type="number" defaultValue={(editingItem?.remaining_cash as number) ?? ''} className="rounded-lg h-10" /></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Shade Trees */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><TreePine className="w-4 h-4 text-emerald-600" /></div>
                            🌳 Shade Trees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2"><Label className="text-sm font-medium">Trees Planted</Label><Input name="shade_trees_planted" type="number" defaultValue={(editingItem?.shade_trees_planted as number) ?? ''} className="rounded-lg h-10" /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">{t('shade_trees_survived')}</Label><Input name="shade_trees_survived" type="number" defaultValue={(editingItem?.shade_trees_survived as number) ?? ''} className="rounded-lg h-10" /></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">{t('notes')}</Label>
                            <textarea name="notes" defaultValue={(editingItem?.notes as string) ?? ''} rows={3} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background resize-none" placeholder={t('notes') + '...'} />
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
