import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
                    <DialogTitle>{isEditing ? 'Edit GHG Record' : 'Add GHG Record'}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
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
                    </div>

                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🏭 Emission Sources (tCO₂e)</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>⚡ Electricity</Label><Input name="electricity_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.electricity_emissions_tco2e as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>⛽ Fuel Combustion</Label><Input name="fuel_combustion_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.fuel_combustion_emissions_tco2e as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>🧪 N-Fertilizer</Label><Input name="n_fert_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.n_fert_emissions_tco2e as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>🗑️ Waste</Label><Input name="waste_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.waste_emissions_tco2e as number) ?? ''} className="rounded-lg" /></div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>🔥 Total Emissions (tCO₂e)</Label>
                        <Input name="total_emissions_tco2e" type="number" step="0.001" defaultValue={(editingItem?.total_emissions_tco2e as number) ?? ''} className="rounded-lg" />
                    </div>

                    <div className="space-y-1.5"><Label>Notes</Label><Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="rounded-lg" /></div>

                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={createMutation.isPending || updateMutation.isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : 'Add Record'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
