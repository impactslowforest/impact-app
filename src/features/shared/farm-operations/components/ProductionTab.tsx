import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductionRecords, useDeleteProductionRecord } from '../hooks/useFarmOpsData';
import { ProductionFormPage } from './ProductionFormPage';

interface ProductionTabProps {
    country: string;
}

export function ProductionTab({ country }: ProductionTabProps) {
    const { t } = useTranslation('common');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

    const filters: Record<string, string> = {};
    const { data, isLoading, error } = useProductionRecords(country, search, filters, page);
    const deleteMutation = useDeleteProductionRecord();

    const handleEdit = (item: Record<string, unknown>) => { setEditingItem(item); setShowForm(true); };
    const handleDelete = (id: string) => { if (window.confirm(t('confirm_delete', 'Delete?'))) deleteMutation.mutate(id); };
    const handleAdd = () => { setEditingItem(null); setShowForm(true); };
    const handleBack = () => { setShowForm(false); setEditingItem(null); };

    if (showForm) {
        return <ProductionFormPage country={country} editingItem={editingItem} onBack={handleBack} />;
    }

    return (
        <>
            <Card className="rounded-xl overflow-hidden">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            {t('production_records', 'Production Records')}
                            {data && <Badge variant="secondary" className="ml-1">{data.totalItems}</Badge>}
                        </CardTitle>
                        <Button size="sm" className="btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                            <Plus className="mr-1.5 h-4 w-4" />{t('add_record', 'Add Record')}
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row mt-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t('search', 'Search...')} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 rounded-lg" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {error ? (
                        <div className="text-center py-8 text-red-500">
                            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium">{t('error_loading', 'Error')}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
                    ) : !data?.items.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>{t('no_records', 'No production records')}</p>
                            <Button size="sm" className="mt-3 btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />{t('add_first_record', 'Add First Record')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.items.map((item) => {
                                const farmerName = (item.expand as Record<string, Record<string, unknown>> | undefined)?.farmer?.full_name as string || '';
                                return (
                                    <div key={item.id} className="rounded-lg border border-gray-200 p-3 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge variant="secondary" className="font-mono">{item.year}</Badge>
                                                    {farmerName && <span className="text-sm font-medium text-gray-900">{farmerName}</span>}
                                                    {item.season && <Badge className="text-xs bg-blue-50 text-blue-700 border-0">{item.season}</Badge>}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-xs">
                                                    {item.annual_cherry_kg > 0 && (
                                                        <div><span className="text-muted-foreground">Cherry:</span> <span className="font-medium">{item.annual_cherry_kg} kg</span></div>
                                                    )}
                                                    {item.high_quality_cherry_kg > 0 && (
                                                        <div><span className="text-muted-foreground">HQ Cherry:</span> <span className="font-medium">{item.high_quality_cherry_kg} kg</span></div>
                                                    )}
                                                    {item.total_coffee_income > 0 && (
                                                        <div><span className="text-muted-foreground">☕ Income:</span> <span className="font-medium text-green-700">{Number(item.total_coffee_income).toLocaleString()}</span></div>
                                                    )}
                                                    {item.total_household_income > 0 && (
                                                        <div><span className="text-muted-foreground">🏠 HH Income:</span> <span className="font-medium">{Number(item.total_household_income).toLocaleString()}</span></div>
                                                    )}
                                                    {item.total_production_cost > 0 && (
                                                        <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium text-red-600">{Number(item.total_production_cost).toLocaleString()}</span></div>
                                                    )}
                                                    {item.current_debt > 0 && (
                                                        <div><span className="text-muted-foreground">🏦 Debt:</span> <span className="font-medium text-amber-600">{Number(item.current_debt).toLocaleString()}</span></div>
                                                    )}
                                                    {item.remaining_cash > 0 && (
                                                        <div><span className="text-muted-foreground">💰 Cash:</span> <span className="font-medium text-emerald-600">{Number(item.remaining_cash).toLocaleString()}</span></div>
                                                    )}
                                                    {item.shade_trees_planted > 0 && (
                                                        <div><span className="text-muted-foreground">🌳 Planted:</span> <span className="font-medium">{item.shade_trees_planted}</span> {item.shade_trees_survived > 0 && <span className="text-muted-foreground">(survived: {item.shade_trees_survived})</span>}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="outline" size="sm" className="h-8 rounded-lg" onClick={() => handleEdit(item as unknown as Record<string, unknown>)}><Pencil className="h-3 w-3" /></Button>
                                                <Button variant="outline" size="sm" className="h-8 rounded-lg text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending}><Trash2 className="h-3 w-3" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {data.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <Button variant="outline" size="sm" className="rounded-lg" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t('previous', 'Previous')}</Button>
                                    <span className="text-sm text-muted-foreground">{page} / {data.totalPages}</span>
                                    <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>{t('next', 'Next')}</Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

        </>
    );
}
