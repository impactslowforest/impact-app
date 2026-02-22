import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateGHGEmission, useUpdateGHGEmission, useFarmersList } from '../../farm-operations/hooks/useFarmOpsData';

interface GHGFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

export function GHGFormDialog({ country, open, onOpenChange, editingItem }: GHGFormDialogProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateGHGEmission();
    const updateMutation = useUpdateGHGEmission();
    const { data: farmers } = useFarmersList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        const numericFields = ['year', 'electricity_emissions_tco2e', 'fuel_combustion_emissions_tco2e', 'n_fert_emissions_tco2e', 'waste_emissions_tco2e', 'total_emissions_tco2e'];
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
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('edit_record') : t('add_record')}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* General Info */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('general_info', 'General Info')}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farmer_name')} *</span>
                                <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none">
                                    <option value="">{t('select_farmer', 'Select farmer...')}</option>
                                    {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('ghg_year')} *</span>
                                <Input name="year" type="number" required min="2020" max="2100" defaultValue={(editingItem?.year as number) ?? currentYear} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Emission Sources */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Emission Sources (tCO2e)</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Electricity</span>
                                <Input name="electricity_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.electricity_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Fuel Combustion</span>
                                <Input name="fuel_combustion_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.fuel_combustion_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">N-Fertilizer</span>
                                <Input name="n_fert_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.n_fert_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Waste</span>
                                <Input name="waste_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.waste_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Total Emissions</span>
                                <Input name="total_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.total_emissions_tco2e as number) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('notes')}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('notes')}</span>
                                <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="flex-1 rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={isPending}>
                        {isEditing ? t('save_changes') : t('add_record')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
