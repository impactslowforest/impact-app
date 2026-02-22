import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGHGEmissions, useDeleteGHGEmission, useGHGStats } from '../../farm-operations/hooks/useFarmOpsData';
import { GHGFormPage } from '../components/GHGFormPage';

interface GHGCollectionPageProps {
    country?: string;
}

export function GHGCollectionPage({ country = 'laos' }: GHGCollectionPageProps) {
    const { t } = useTranslation('common');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

    const filters: Record<string, string> = {};
    const { data, isLoading, error } = useGHGEmissions(country, search, filters, page);
    const { data: stats } = useGHGStats(country);
    const deleteMutation = useDeleteGHGEmission();

    const handleEdit = (item: Record<string, unknown>) => { setEditingItem(item); setShowForm(true); };
    const handleDelete = (id: string) => { if (window.confirm(t('confirm_delete', 'Delete?'))) deleteMutation.mutate(id); };
    const handleAdd = () => { setEditingItem(null); setShowForm(true); };
    const handleBack = () => { setShowForm(false); setEditingItem(null); };

    // Show full-page form when adding/editing
    if (showForm) {
        return <GHGFormPage country={country} editingItem={editingItem} onBack={handleBack} />;
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('ghg_collection_title', 'GHG Collection')}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {country === 'laos' ? 'Laos' : country === 'vietnam' ? 'Vietnam' : 'Indonesia'} — {t('ghg_subtitle', 'Greenhouse Gas Emissions Tracking')}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="rounded-xl">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-50"><Flame className="h-5 w-5 text-orange-600" /></div>
                        <div>
                            <p className="text-xl font-bold">{stats?.totalRecords ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Records</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-50"><Flame className="h-5 w-5 text-red-600" /></div>
                        <div>
                            <p className="text-xl font-bold">{stats?.totalEmissions ?? 0}</p>
                            <p className="text-xs text-muted-foreground">tCO₂e Total</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50"><Flame className="h-5 w-5 text-blue-600" /></div>
                        <div>
                            <p className="text-xl font-bold">{stats?.yearsTracked ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Years Tracked</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main content */}
            <Card className="rounded-xl overflow-hidden">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-600" />
                            {t('ghg_emissions', 'GHG Emissions')}
                            {data && <Badge variant="secondary" className="ml-1">{data.totalItems}</Badge>}
                        </CardTitle>
                        <Button size="sm" className="btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                            <Plus className="mr-1.5 h-4 w-4" />{t('add_record', 'Add Record')}
                        </Button>
                    </div>
                    <div className="flex mt-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t('search', 'Search...')} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 rounded-lg" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {error ? (
                        <div className="text-center py-8 text-red-500"><Flame className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>{t('error_loading', 'Error')}</p></div>
                    ) : isLoading ? (
                        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
                    ) : !data?.items.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Flame className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>{t('no_records', 'No records found')}</p>
                            <Button size="sm" className="mt-3 btn-3d-primary text-white rounded-lg" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" />{t('add_record')}</Button>
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
                                                    {farmerName && <span className="text-sm font-medium">{farmerName}</span>}
                                                    <Badge className="text-xs border-0 bg-orange-100 text-orange-700">
                                                        {item.total_emissions_tco2e ?? 0} tCO₂e
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-xs">
                                                    {item.electricity_emissions_tco2e > 0 && <div><span className="text-muted-foreground">⚡ Electricity:</span> {item.electricity_emissions_tco2e}</div>}
                                                    {item.fuel_combustion_emissions_tco2e > 0 && <div><span className="text-muted-foreground">⛽ Fuel:</span> {item.fuel_combustion_emissions_tco2e}</div>}
                                                    {item.n_fert_emissions_tco2e > 0 && <div><span className="text-muted-foreground">🧪 N-Fert:</span> {item.n_fert_emissions_tco2e}</div>}
                                                    {item.waste_emissions_tco2e > 0 && <div><span className="text-muted-foreground">🗑️ Waste:</span> {item.waste_emissions_tco2e}</div>}
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
                                    <Button variant="outline" size="sm" className="rounded-lg" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                                    <span className="text-sm text-muted-foreground">{page} / {data.totalPages}</span>
                                    <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default GHGCollectionPage;
