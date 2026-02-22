import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useCreateProductionRecord, useUpdateProductionRecord, useFarmersList } from '../hooks/useFarmOpsData';

interface ProductionFormPageProps {
    country: string;
    editingItem?: Record<string, unknown> | null;
    onBack: () => void;
}

const selectClass = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

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
                {/* General Info */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('general_info')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farmer_name')} *</span>
                            <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className={selectClass}>
                                <option value="">{t('select_farmer')}</option>
                                {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('harvest_year')} *</span>
                            <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Season</span>
                            <select name="season" defaultValue={(editingItem?.season as string) ?? 'main'} className={selectClass}>
                                <option value="main">Main</option><option value="mid">Mid</option><option value="fly">Fly</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Production */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Production</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Annual Cherry (kg)</span>
                            <Input name="annual_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.annual_cherry_kg as number) ?? ''} className="flex-1 rounded-lg h-10" placeholder="0.0" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('high_quality_cherry_kg')}</span>
                            <Input name="high_quality_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.high_quality_cherry_kg as number) ?? ''} className="flex-1 rounded-lg h-10" placeholder="0.0" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Arabica Estimation (kg)</span>
                            <Input name="a_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.a_cherry_estimation_kg as number) ?? ''} className="flex-1 rounded-lg h-10" placeholder="0.0" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Robusta Estimation (kg)</span>
                            <Input name="r_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.r_cherry_estimation_kg as number) ?? ''} className="flex-1 rounded-lg h-10" placeholder="0.0" />
                        </div>
                    </div>
                </div>

                {/* Revenue */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Revenue</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Total Coffee Income</span>
                            <Input name="total_coffee_income" type="number" defaultValue={(editingItem?.total_coffee_income as number) ?? ''} className="flex-1 rounded-lg h-10" placeholder="0" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('total_household_income')}</span>
                            <Input name="total_household_income" type="number" defaultValue={(editingItem?.total_household_income as number) ?? ''} className="flex-1 rounded-lg h-10" placeholder="0" />
                        </div>
                    </div>
                </div>

                {/* Production Costs */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Production Costs</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Total Production Cost</span>
                            <Input name="total_production_cost" type="number" defaultValue={(editingItem?.total_production_cost as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Fertilizer Cost</span>
                            <Input name="fertilizer_cost" type="number" defaultValue={(editingItem?.fertilizer_cost as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Pesticide Cost</span>
                            <Input name="pesticide_cost" type="number" defaultValue={(editingItem?.pesticide_cost as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Fuel Cost</span>
                            <Input name="fuel_cost" type="number" defaultValue={(editingItem?.fuel_cost as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Hired Labor Cost</span>
                            <Input name="hired_labor_cost" type="number" defaultValue={(editingItem?.hired_labor_cost as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Other Costs</span>
                            <Input name="other_costs" type="number" defaultValue={(editingItem?.other_costs as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                    </div>
                </div>

                {/* Financial Status */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Financial Status</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('current_debt')}</span>
                            <Input name="current_debt" type="number" defaultValue={(editingItem?.current_debt as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('remaining_cash')}</span>
                            <Input name="remaining_cash" type="number" defaultValue={(editingItem?.remaining_cash as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                    </div>
                </div>

                {/* Shade Trees */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">Shade Trees</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Trees Planted</span>
                            <Input name="shade_trees_planted" type="number" defaultValue={(editingItem?.shade_trees_planted as number) ?? ''} className="flex-1 rounded-lg h-10" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('shade_trees_survived')}</span>
                            <Input name="shade_trees_survived" type="number" defaultValue={(editingItem?.shade_trees_survived as number) ?? ''} className="flex-1 rounded-lg h-10" />
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
                            <textarea name="notes" defaultValue={(editingItem?.notes as string) ?? ''} rows={3} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none resize-none" placeholder={t('notes') + '...'} />
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
