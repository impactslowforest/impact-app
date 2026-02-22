import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateProductionRecord, useUpdateProductionRecord, useFarmersList } from '../hooks/useFarmOpsData';

interface ProductionFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

export function ProductionFormDialog({ country, open, onOpenChange, editingItem }: ProductionFormDialogProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateProductionRecord();
    const updateMutation = useUpdateProductionRecord();
    const { data: farmers } = useFarmersList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

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
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onOpenChange(false) });
        } else {
            createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
        }
    };

    const currentYear = new Date().getFullYear();
    const selectClasses = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('edit_record', 'Edit Record') : t('add_record', 'Add Record')}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* Identity */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('identity', 'Identity')}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farmer_name')} *</span>
                                <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className={selectClasses}>
                                    <option value="">{t('select_farmer', 'Select farmer...')}</option>
                                    {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('ghg_year')} *</span>
                                <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('season')}</span>
                                <select name="season" defaultValue={(editingItem?.season as string) ?? 'main'} className={selectClasses}>
                                    <option value="main">Main</option><option value="mid">Mid</option><option value="fly">Fly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Production */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('production', 'Production')}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Annual Cherry (kg)</span>
                                <Input name="annual_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.annual_cherry_kg as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">High Quality Cherry (kg)</span>
                                <Input name="high_quality_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.high_quality_cherry_kg as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Arabica Estimation (kg)</span>
                                <Input name="a_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.a_cherry_estimation_kg as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Robusta Estimation (kg)</span>
                                <Input name="r_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.r_cherry_estimation_kg as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Revenue</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Total Coffee Income</span>
                                <Input name="total_coffee_income" type="number" defaultValue={(editingItem?.total_coffee_income as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Total Household Income</span>
                                <Input name="total_household_income" type="number" defaultValue={(editingItem?.total_household_income as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Production Costs */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Production Costs</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Total Production Cost</span>
                                <Input name="total_production_cost" type="number" defaultValue={(editingItem?.total_production_cost as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Fertilizer Cost</span>
                                <Input name="fertilizer_cost" type="number" defaultValue={(editingItem?.fertilizer_cost as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Pesticide Cost</span>
                                <Input name="pesticide_cost" type="number" defaultValue={(editingItem?.pesticide_cost as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Fuel Cost</span>
                                <Input name="fuel_cost" type="number" defaultValue={(editingItem?.fuel_cost as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Hired Labor Cost</span>
                                <Input name="hired_labor_cost" type="number" defaultValue={(editingItem?.hired_labor_cost as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Other Costs</span>
                                <Input name="other_costs" type="number" defaultValue={(editingItem?.other_costs as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Financial Status */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Financial Status</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Current Debt</span>
                                <Input name="current_debt" type="number" defaultValue={(editingItem?.current_debt as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Remaining Cash</span>
                                <Input name="remaining_cash" type="number" defaultValue={(editingItem?.remaining_cash as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Shade Trees & Notes */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Shade Trees & Notes</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Trees Planted</span>
                                <Input name="shade_trees_planted" type="number" defaultValue={(editingItem?.shade_trees_planted as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Trees Survived</span>
                                <Input name="shade_trees_survived" type="number" defaultValue={(editingItem?.shade_trees_survived as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('notes')}</span>
                                <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : t('add_record', 'Add Record')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
