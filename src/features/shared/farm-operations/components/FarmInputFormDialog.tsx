import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateFarmInput, useUpdateFarmInput, useFarmsList, useFarmersList } from '../hooks/useFarmOpsData';

interface FarmInputFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

export function FarmInputFormDialog({ country, open, onOpenChange, editingItem }: FarmInputFormDialogProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateFarmInput();
    const updateMutation = useUpdateFarmInput();
    const { data: farms } = useFarmsList(country);
    const { data: farmers } = useFarmersList(country);
    const isEditing = !!editingItem;

    useEffect(() => {
        if (open && formRef.current) formRef.current.reset();
    }, [open, editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });

        // Parse numeric fields
        const numericFields = ['quantity_kg', 'quantity_liters', 'area_applied_ha', 'cost_local_currency'];
        numericFields.forEach(f => { if (data[f]) data[f] = parseFloat(data[f] as string) || 0; });
        // Boolean
        data.is_organic = form.has('is_organic');
        data.country = country;

        if (isEditing) {
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onOpenChange(false) });
        } else {
            createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('edit_input', 'Edit Input') : t('add_input', 'Add Input')}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* ─── Identity ─── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Farmer *</Label>
                            <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">Select farmer...</option>
                                {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Farm *</Label>
                            <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">{t('select_farm', 'Select farm...')}</option>
                                {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ─── Product Info ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">📦 Product Information</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Product Name *</Label>
                            <Input name="product_name" required defaultValue={(editingItem?.product_name as string) ?? ''} placeholder="e.g. NPK 15-15-15" className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Input Type *</Label>
                            <select name="input_type" required defaultValue={(editingItem?.input_type as string) ?? 'fertilizer'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="fertilizer">Fertilizer</option>
                                <option value="pesticide">Pesticide</option>
                                <option value="herbicide">Herbicide</option>
                                <option value="fungicide">Fungicide</option>
                                <option value="soil_amendment">Soil Amendment</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Brand</Label>
                            <Input name="brand" defaultValue={(editingItem?.brand as string) ?? ''} placeholder="Manufacturer / brand" className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Source / Supplier</Label>
                            <Input name="source_supplier" defaultValue={(editingItem?.source_supplier as string) ?? ''} placeholder="Where purchased from" className="rounded-lg" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_organic" name="is_organic" defaultChecked={!!editingItem?.is_organic} className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="is_organic" className="cursor-pointer">🌿 Organic / Bio-certified</Label>
                    </div>

                    {/* ─── Application ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">🔄 Application Details</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Application Method</Label>
                            <select name="application_method" defaultValue={(editingItem?.application_method as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">Select...</option>
                                <option value="spray">Spray</option>
                                <option value="granular">Granular</option>
                                <option value="foliar">Foliar</option>
                                <option value="soil_drench">Soil Drench</option>
                                <option value="manual">Manual</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Application Date *</Label>
                            <Input name="application_date" type="date" required defaultValue={(editingItem?.application_date as string)?.split('T')[0] ?? ''} className="rounded-lg" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Target Pest or Deficiency</Label>
                        <Input name="target_pest_or_deficiency" defaultValue={(editingItem?.target_pest_or_deficiency as string) ?? ''} placeholder="e.g. Coffee berry borer, Nitrogen deficiency" className="rounded-lg" />
                    </div>

                    {/* ─── Quantity & Cost ─── */}
                    <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">📊 Quantity & Cost</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Quantity (kg)</Label>
                            <Input name="quantity_kg" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_kg as number) ?? ''} className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Quantity (liters)</Label>
                            <Input name="quantity_liters" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_liters as number) ?? ''} className="rounded-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Area Applied (ha)</Label>
                            <Input name="area_applied_ha" type="number" step="0.01" min="0" defaultValue={(editingItem?.area_applied_ha as number) ?? ''} className="rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Cost (local currency)</Label>
                            <Input name="cost_local_currency" type="number" step="0.01" min="0" defaultValue={(editingItem?.cost_local_currency as number) ?? ''} className="rounded-lg" />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <Label>Notes</Label>
                        <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="rounded-lg" />
                    </div>

                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : t('add_input', 'Add Input')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
