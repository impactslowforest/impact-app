import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Package, Beaker, BarChart3 } from 'lucide-react';
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
                {/* Identity */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Package className="w-4 h-4 text-blue-600" />
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
                                <Label className="text-sm font-medium">{t('farm')} *</Label>
                                <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background transition-colors focus:ring-2 focus:ring-primary/20">
                                    <option value="">{t('select_farm')}</option>
                                    {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Info */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <Beaker className="w-4 h-4 text-green-600" />
                            </div>
                            📦 {t('product_name')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('product_name')} *</Label>
                                <Input name="product_name" required defaultValue={(editingItem?.product_name as string) ?? ''} placeholder="e.g. NPK 15-15-15" className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('input_type')} *</Label>
                                <select name="input_type" required defaultValue={(editingItem?.input_type as string) ?? 'fertilizer'} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="fertilizer">{t('input_type_fertilizer')}</option>
                                    <option value="pesticide">{t('input_type_pesticide')}</option>
                                    <option value="herbicide">{t('input_type_herbicide')}</option>
                                    <option value="fungicide">{t('input_type_fungicide')}</option>
                                    <option value="soil_amendment">{t('input_type_soil_amendment')}</option>
                                    <option value="other">{t('input_type_other')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('brand')}</Label>
                                <Input name="brand" defaultValue={(editingItem?.brand as string) ?? ''} placeholder="Manufacturer / brand" className="rounded-lg h-10" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('source_supplier')}</Label>
                                <Input name="source_supplier" defaultValue={(editingItem?.source_supplier as string) ?? ''} placeholder="Where purchased from" className="rounded-lg h-10" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                            <input type="checkbox" id="is_organic" name="is_organic" defaultChecked={!!editingItem?.is_organic} className="h-4 w-4 rounded border-gray-300 accent-emerald-600" />
                            <Label htmlFor="is_organic" className="cursor-pointer text-sm">🌿 {t('is_organic')} / Bio-certified</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Application Details */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Beaker className="w-4 h-4 text-amber-600" />
                            </div>
                            🔄 {t('application_method')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('application_method')}</Label>
                                <select name="application_method" defaultValue={(editingItem?.application_method as string) ?? ''} className="w-full rounded-lg border border-input px-3 py-2.5 text-sm bg-background">
                                    <option value="">{t('select_type')}</option>
                                    <option value="spray">{t('method_spray')}</option>
                                    <option value="broadcast">{t('method_broadcast')}</option>
                                    <option value="foliar">{t('method_foliar')}</option>
                                    <option value="drip">{t('method_drip')}</option>
                                    <option value="manual">{t('method_manual')}</option>
                                    <option value="other">{t('input_type_other')}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('application_date')} *</Label>
                                <Input name="application_date" type="date" required defaultValue={(editingItem?.application_date as string)?.split('T')[0] ?? ''} className="rounded-lg h-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">{t('target_pest_or_deficiency')}</Label>
                            <Input name="target_pest_or_deficiency" defaultValue={(editingItem?.target_pest_or_deficiency as string) ?? ''} placeholder="e.g. Coffee berry borer, Nitrogen deficiency" className="rounded-lg h-10" />
                        </div>
                    </CardContent>
                </Card>

                {/* Quantity & Cost */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-purple-600" />
                            </div>
                            📊 {t('quantity_kg')} & {t('cost_local_currency')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('quantity_kg')}</Label>
                                <Input name="quantity_kg" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_kg as number) ?? ''} className="rounded-lg h-10" placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('quantity_liters')}</Label>
                                <Input name="quantity_liters" type="number" step="0.01" min="0" defaultValue={(editingItem?.quantity_liters as number) ?? ''} className="rounded-lg h-10" placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('area_applied_ha')}</Label>
                                <Input name="area_applied_ha" type="number" step="0.01" min="0" defaultValue={(editingItem?.area_applied_ha as number) ?? ''} className="rounded-lg h-10" placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('cost_local_currency')}</Label>
                                <Input name="cost_local_currency" type="number" step="0.01" min="0" defaultValue={(editingItem?.cost_local_currency as number) ?? ''} className="rounded-lg h-10" placeholder="0.00" />
                            </div>
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
