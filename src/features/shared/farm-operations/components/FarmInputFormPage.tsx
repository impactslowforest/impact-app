import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useCreateFarmInput, useUpdateFarmInput, useFarmsList, useFarmersList } from '../hooks/useFarmOpsData';

interface FarmInputFormPageProps {
    country: string;
    editingItem?: Record<string, unknown> | null;
    onBack: () => void;
}

export function FarmInputFormPage({ country, editingItem, onBack }: FarmInputFormPageProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateFarmInput();
    const updateMutation = useUpdateFarmInput();
    const { data: farms } = useFarmsList(country);
    const { data: farmers } = useFarmersList(country);
    const isEditing = !!editingItem;
    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => { if (formRef.current) formRef.current.reset(); }, [editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        const numericFields = ['quantity_kg', 'quantity_liters', 'area_applied_ha', 'cost_local_currency'];
        numericFields.forEach(f => { if (data[f]) data[f] = parseFloat(data[f] as string) || 0; });
        data.is_organic = form.has('is_organic');
        data.country = country;

        if (isEditing) {
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onBack() });
        } else {
            createMutation.mutate(data, { onSuccess: () => onBack() });
        }
    };

    const selectClass = "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none";

    return (
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    {t('go_back')}
                </Button>
                <div className="h-6 w-px bg-border" />
                <h2 className="text-xl font-bold text-foreground">
                    {isEditing ? t('edit_record') : t('add_record')} — {t('farm_inputs', 'Farm Input')}
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
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farm')} *</span>
                            <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className={selectClass}>
                                <option value="">{t('select_farm')}</option>
                                {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('product_name')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('product_name')} *</span>
                            <Input name="product_name" required defaultValue={(editingItem?.product_name as string) ?? ''} placeholder="e.g. NPK 15-15-15" className="flex-1 rounded-lg text-sm bg-white" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('input_type')} *</span>
                            <select name="input_type" required defaultValue={(editingItem?.input_type as string) ?? 'fertilizer'} className={selectClass}>
                                <option value="fertilizer">{t('input_type_fertilizer')}</option>
                                <option value="pesticide">{t('input_type_pesticide')}</option>
                                <option value="herbicide">{t('input_type_herbicide')}</option>
                                <option value="fungicide">{t('input_type_fungicide')}</option>
                                <option value="soil_amendment">{t('input_type_soil_amendment')}</option>
                                <option value="other">{t('input_type_other')}</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('brand')}</span>
                            <Input name="brand" defaultValue={(editingItem?.brand as string) ?? ''} placeholder="Manufacturer / brand" className="flex-1 rounded-lg text-sm bg-white" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('source_supplier')}</span>
                            <Input name="source_supplier" defaultValue={(editingItem?.source_supplier as string) ?? ''} placeholder="Where purchased from" className="flex-1 rounded-lg text-sm bg-white" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('is_organic')}</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" id="is_organic" name="is_organic" defaultChecked={!!editingItem?.is_organic} className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                                <span className="text-sm text-gray-600">Bio-certified</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Application Details */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('application_method')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('application_method')}</span>
                            <select name="application_method" defaultValue={(editingItem?.application_method as string) ?? ''} className={selectClass}>
                                <option value="">{t('select_type')}</option>
                                <option value="spray">{t('method_spray')}</option>
                                <option value="broadcast">{t('method_broadcast')}</option>
                                <option value="foliar">{t('method_foliar')}</option>
                                <option value="drip">{t('method_drip')}</option>
                                <option value="manual">{t('method_manual')}</option>
                                <option value="other">{t('input_type_other')}</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('application_date')} *</span>
                            <Input name="application_date" type="date" required defaultValue={(editingItem?.application_date as string)?.split('T')[0] ?? ''} className="flex-1 rounded-lg text-sm bg-white" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('target_pest_or_deficiency')}</span>
                            <Input name="target_pest_or_deficiency" defaultValue={(editingItem?.target_pest_or_deficiency as string) ?? ''} placeholder="e.g. Coffee berry borer, Nitrogen deficiency" className="flex-1 rounded-lg text-sm bg-white" />
                        </div>
                    </div>
                </div>

                {/* Quantity & Cost */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-primary-700 px-4 py-2.5">
                        <h3 className="text-sm font-bold text-white tracking-wide">{t('quantity_kg')} & {t('cost_local_currency')}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('quantity_kg')}</span>
                            <Input name="quantity_kg" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_kg as number) ?? ''} className="flex-1 rounded-lg text-sm bg-white" placeholder="0.00" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('quantity_liters')}</span>
                            <Input name="quantity_liters" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_liters as number) ?? ''} className="flex-1 rounded-lg text-sm bg-white" placeholder="0.00" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-white">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('area_applied_ha')}</span>
                            <Input name="area_applied_ha" type="number" step="0.01" min="0" defaultValue={(editingItem?.area_applied_ha as number) ?? ''} className="flex-1 rounded-lg text-sm bg-white" placeholder="0.00" />
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                            <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('cost_local_currency')}</span>
                            <Input name="cost_local_currency" type="number" step="0.01" min="0" defaultValue={(editingItem?.cost_local_currency as number) ?? ''} className="flex-1 rounded-lg text-sm bg-white" placeholder="0.00" />
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
                            <textarea name="notes" defaultValue={(editingItem?.notes as string) ?? ''} rows={3} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none" placeholder={t('notes') + '...'} />
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
