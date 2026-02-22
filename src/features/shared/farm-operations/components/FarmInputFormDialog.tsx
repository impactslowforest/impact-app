import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateFarmInput, useUpdateFarmInput, useFarmsList, useFarmersList } from '../hooks/useFarmOpsData';

interface FarmInputFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

const selectCls = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

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

                    {/* General Info */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">General Info</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Farmer *</span>
                                <select name="farmer" required defaultValue={(editingItem?.farmer as string) ?? ''} className={selectCls}>
                                    <option value="">Select farmer...</option>
                                    {farmers?.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Farm *</span>
                                <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className={selectCls}>
                                    <option value="">{t('select_farm', 'Select farm...')}</option>
                                    {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Product Information</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Product Name *</span>
                                <Input name="product_name" required defaultValue={(editingItem?.product_name as string) ?? ''} placeholder="e.g. NPK 15-15-15" className="flex-1 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Input Type *</span>
                                <select name="input_type" required defaultValue={(editingItem?.input_type as string) ?? 'fertilizer'} className={selectCls}>
                                    <option value="fertilizer">Fertilizer</option>
                                    <option value="pesticide">Pesticide</option>
                                    <option value="herbicide">Herbicide</option>
                                    <option value="fungicide">Fungicide</option>
                                    <option value="soil_amendment">Soil Amendment</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Brand</span>
                                <Input name="brand" defaultValue={(editingItem?.brand as string) ?? ''} placeholder="Manufacturer / brand" className="flex-1 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Source / Supplier</span>
                                <Input name="source_supplier" defaultValue={(editingItem?.source_supplier as string) ?? ''} placeholder="Where purchased from" className="flex-1 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Organic</span>
                                <div className="flex items-center gap-2 flex-1">
                                    <input type="checkbox" id="is_organic" name="is_organic" defaultChecked={!!editingItem?.is_organic} className="h-4 w-4 rounded border-gray-300" />
                                    <label htmlFor="is_organic" className="text-sm text-gray-700 cursor-pointer">Organic / Bio-certified</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Application Details</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Application Method</span>
                                <select name="application_method" defaultValue={(editingItem?.application_method as string) ?? ''} className={selectCls}>
                                    <option value="">Select...</option>
                                    <option value="spray">Spray</option>
                                    <option value="granular">Granular</option>
                                    <option value="foliar">Foliar</option>
                                    <option value="soil_drench">Soil Drench</option>
                                    <option value="manual">Manual</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Application Date *</span>
                                <Input name="application_date" type="date" required defaultValue={(editingItem?.application_date as string)?.split('T')[0] ?? ''} className="flex-1 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Target Pest or Deficiency</span>
                                <Input name="target_pest_or_deficiency" defaultValue={(editingItem?.target_pest_or_deficiency as string) ?? ''} placeholder="e.g. Coffee berry borer, Nitrogen deficiency" className="flex-1 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Quantity & Cost */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Quantity & Cost</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Quantity (kg)</span>
                                <Input name="quantity_kg" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_kg as number) ?? ''} className="flex-1 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Quantity (liters)</span>
                                <Input name="quantity_liters" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_liters as number) ?? ''} className="flex-1 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Area Applied (ha)</span>
                                <Input name="area_applied_ha" type="number" step="0.01" min="0" defaultValue={(editingItem?.area_applied_ha as number) ?? ''} className="flex-1 rounded-lg" />
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Cost (local currency)</span>
                                <Input name="cost_local_currency" type="number" step="0.01" min="0" defaultValue={(editingItem?.cost_local_currency as number) ?? ''} className="flex-1 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-primary-700 px-4 py-2">
                            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Notes</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white">
                                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">Notes</span>
                                <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="flex-1 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : t('add_input', 'Add Input')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
