import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    useFarmInputs, useDeleteFarmInput,
} from '../hooks/useFarmOpsData';
import { FarmInputFormPage } from './FarmInputFormPage';

interface FarmInputTabProps {
    country: string;
}

const typeColors: Record<string, string> = {
    fertilizer: 'bg-green-100 text-green-700',
    pesticide: 'bg-red-100 text-red-700',
    herbicide: 'bg-orange-100 text-orange-700',
    fungicide: 'bg-purple-100 text-purple-700',
    soil_amendment: 'bg-amber-100 text-amber-700',
    seed: 'bg-blue-100 text-blue-700',
    other: 'bg-gray-100 text-gray-600',
};

export function FarmInputTab({ country }: FarmInputTabProps) {
    const { t } = useTranslation('common');
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

    const filters: Record<string, string> = { input_type: typeFilter };
    const { data, isLoading, error } = useFarmInputs(country, search, filters, page);
    const deleteMutation = useDeleteFarmInput();

    const handleEdit = (item: Record<string, unknown>) => { setEditingItem(item); setShowForm(true); };
    const handleDelete = (id: string) => { if (window.confirm(t('confirm_delete', 'Delete this record?'))) deleteMutation.mutate(id); };
    const handleAdd = () => { setEditingItem(null); setShowForm(true); };
    const handleBack = () => { setShowForm(false); setEditingItem(null); };

    // Show full-page form
    if (showForm) {
        return <FarmInputFormPage country={country} editingItem={editingItem} onBack={handleBack} />;
    }

    return (
        <Card className="rounded-xl overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary-600" />
                        {t('farm_inputs', 'Farm Inputs')}
                        {data && <Badge variant="secondary" className="ml-1">{data.totalItems}</Badge>}
                    </CardTitle>
                    <Button size="sm" className="btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                        <Plus className="mr-1.5 h-4 w-4" />{t('add_input', 'Add Input')}
                    </Button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row mt-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder={t('search_inputs', 'Search inputs...')} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 rounded-lg" />
                    </div>
                    <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                        <SelectTrigger className="w-full sm:w-[160px] rounded-lg">
                            <SelectValue placeholder={t('input_type', 'Type')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('all', 'All')}</SelectItem>
                            <SelectItem value="fertilizer">{t('fertilizer', 'Fertilizer')}</SelectItem>
                            <SelectItem value="pesticide">{t('pesticide', 'Pesticide')}</SelectItem>
                            <SelectItem value="herbicide">{t('herbicide', 'Herbicide')}</SelectItem>
                            <SelectItem value="fungicide">{t('fungicide', 'Fungicide')}</SelectItem>
                            <SelectItem value="soil_amendment">{t('soil_amendment', 'Soil Amendment')}</SelectItem>
                            <SelectItem value="other">{t('other', 'Other')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {error ? (
                    <div className="text-center py-8 text-red-500">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">{t('error_loading', 'Error loading data')}</p>
                        <p className="text-xs mt-1">{(error as Error).message}</p>
                    </div>
                ) : isLoading ? (
                    <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
                ) : !data?.items.length ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>{t('no_inputs', 'No farm inputs recorded')}</p>
                        <Button size="sm" className="mt-3 btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" />{t('add_first_input', 'Add First Input')}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.items.map((item) => (
                            <div key={item.id} className="rounded-lg border border-gray-200 p-3 hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-sm text-gray-900">{item.product_name || 'Unnamed'}</span>
                                            {item.input_type && (
                                                <Badge className={`text-xs border-0 ${typeColors[item.input_type as string] || typeColors.other}`}>
                                                    {item.input_type}
                                                </Badge>
                                            )}
                                            {item.is_organic && (
                                                <Badge className="text-xs border-0 bg-emerald-100 text-emerald-700">🌿 Organic</Badge>
                                            )}
                                            {item.brand && (
                                                <span className="text-xs text-muted-foreground italic">{item.brand as string}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                                            {(item.quantity_kg as number) > 0 && <span>{item.quantity_kg} kg</span>}
                                            {(item.quantity_liters as number) > 0 && <span>{item.quantity_liters} L</span>}
                                            {(item.area_applied_ha as number) > 0 && <span>{item.area_applied_ha} ha</span>}
                                            {(item.cost_local_currency as number) > 0 && <span>Cost: {item.cost_local_currency}</span>}
                                            {item.application_method && <span>Method: {item.application_method as string}</span>}
                                            {item.application_date && <span>{new Date(item.application_date as string).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="outline" size="sm" className="h-8 rounded-lg" onClick={() => handleEdit(item as unknown as Record<string, unknown>)}>
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Button variant="outline" size="sm" className="rounded-lg" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                    {t('previous', 'Previous')}
                                </Button>
                                <span className="text-sm text-muted-foreground">{page} / {data.totalPages}</span>
                                <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>
                                    {t('next', 'Next')}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
