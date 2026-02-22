import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });

        // Parse ALL numeric fields
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('edit_record', 'Edit Record') : t('add_record', 'Add Record')}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* Identity */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>Farmer *</Label>
                            <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">Select farmer...</option>
                                {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Year *</Label>
                            <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Season</Label>
                            <select name="season" defaultValue={(editingItem?.season as string) ?? 'main'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="main">Main</option><option value="mid">Mid</option><option value="fly">Fly</option>
                            </select>
                        </div>
                    </div>

                    {/* ─── Production ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🌿 Production</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Annual Cherry (kg)</Label><Input name="annual_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.annual_cherry_kg as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>High Quality Cherry (kg)</Label><Input name="high_quality_cherry_kg" type="number" step="0.1" defaultValue={(editingItem?.high_quality_cherry_kg as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Arabica Estimation (kg)</Label><Input name="a_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.a_cherry_estimation_kg as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Robusta Estimation (kg)</Label><Input name="r_cherry_estimation_kg" type="number" step="0.1" defaultValue={(editingItem?.r_cherry_estimation_kg as number) ?? ''} className="rounded-lg" /></div>
                    </div>

                    {/* ─── Revenue ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">💰 Revenue</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Total Coffee Income</Label><Input name="total_coffee_income" type="number" defaultValue={(editingItem?.total_coffee_income as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Total Household Income</Label><Input name="total_household_income" type="number" defaultValue={(editingItem?.total_household_income as number) ?? ''} className="rounded-lg" /></div>
                    </div>

                    {/* ─── Production Costs ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">📊 Production Costs</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Total Production Cost</Label><Input name="total_production_cost" type="number" defaultValue={(editingItem?.total_production_cost as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Fertilizer Cost</Label><Input name="fertilizer_cost" type="number" defaultValue={(editingItem?.fertilizer_cost as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Pesticide Cost</Label><Input name="pesticide_cost" type="number" defaultValue={(editingItem?.pesticide_cost as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Fuel Cost</Label><Input name="fuel_cost" type="number" defaultValue={(editingItem?.fuel_cost as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Hired Labor Cost</Label><Input name="hired_labor_cost" type="number" defaultValue={(editingItem?.hired_labor_cost as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Other Costs</Label><Input name="other_costs" type="number" defaultValue={(editingItem?.other_costs as number) ?? ''} className="rounded-lg" /></div>
                    </div>

                    {/* ─── Financial Status ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🏦 Financial Status</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Current Debt</Label><Input name="current_debt" type="number" defaultValue={(editingItem?.current_debt as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Remaining Cash</Label><Input name="remaining_cash" type="number" defaultValue={(editingItem?.remaining_cash as number) ?? ''} className="rounded-lg" /></div>
                    </div>

                    {/* ─── Shade Trees ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🌳 Shade Trees</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Trees Planted</Label><Input name="shade_trees_planted" type="number" defaultValue={(editingItem?.shade_trees_planted as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Trees Survived</Label><Input name="shade_trees_survived" type="number" defaultValue={(editingItem?.shade_trees_survived as number) ?? ''} className="rounded-lg" /></div>
                    </div>

                    <div className="space-y-1.5"><Label>Notes</Label><Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="rounded-lg" /></div>

                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={createMutation.isPending || updateMutation.isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : t('add_record', 'Add Record')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
