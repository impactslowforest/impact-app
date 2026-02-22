import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useEnvironmentAssessments, useDeleteEnvironmentAssessment } from '../hooks/useFarmOpsData';
import { EnvironmentFormPage } from './EnvironmentFormPage';

interface EnvironmentTabProps {
    country: string;
}

const riskColors: Record<string, string> = {
    none: 'bg-green-100 text-green-700',
    little: 'bg-blue-100 text-blue-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
};

export function EnvironmentTab({ country }: EnvironmentTabProps) {
    const { t } = useTranslation('common');
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

    const filters: Record<string, string> = { water_pollution_risk: riskFilter };
    const { data, isLoading, error } = useEnvironmentAssessments(country, search, filters, page);
    const deleteMutation = useDeleteEnvironmentAssessment();

    const handleEdit = (item: Record<string, unknown>) => { setEditingItem(item); setShowForm(true); };
    const handleDelete = (id: string) => { if (window.confirm(t('confirm_delete', 'Delete?'))) deleteMutation.mutate(id); };
    const handleAdd = () => { setEditingItem(null); setShowForm(true); };
    const handleBack = () => { setShowForm(false); setEditingItem(null); };

    if (showForm) {
        return <EnvironmentFormPage country={country} editingItem={editingItem} onBack={handleBack} />;
    }

    return (
        <>
            <Card className="rounded-xl overflow-hidden">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-green-600" />
                            {t('environment_assessments', 'Environment Assessments')}
                            {data && <Badge variant="secondary" className="ml-1">{data.totalItems}</Badge>}
                        </CardTitle>
                        <Button size="sm" className="btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                            <Plus className="mr-1.5 h-4 w-4" />{t('add_assessment', 'Add Assessment')}
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row mt-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t('search', 'Search...')} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 rounded-lg" />
                        </div>
                        <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-full sm:w-[180px] rounded-lg"><SelectValue placeholder={t('water_risk', 'Water Risk')} /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('all', 'All')}</SelectItem>
                                <SelectItem value="none">{t('none', 'None')}</SelectItem>
                                <SelectItem value="little">{t('little', 'Little')}</SelectItem>
                                <SelectItem value="moderate">{t('moderate', 'Moderate')}</SelectItem>
                                <SelectItem value="high">{t('high', 'High')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {error ? (
                        <div className="text-center py-8 text-red-500">
                            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium">{t('error_loading', 'Error loading data')}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
                    ) : !data?.items.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>{t('no_assessments', 'No assessments recorded')}</p>
                            <Button size="sm" className="mt-3 btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />{t('add_first_assessment', 'Add First Assessment')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.items.map((item) => (
                                <div key={item.id} className="rounded-lg border border-gray-200 p-3 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium">{item.assessment_date ? new Date(item.assessment_date as string).toLocaleDateString() : 'No date'}</span>
                                                {item.water_pollution_risk && (
                                                    <Badge className={`text-xs border-0 ${riskColors[item.water_pollution_risk as string] || ''}`}>
                                                        Water: {item.water_pollution_risk}
                                                    </Badge>
                                                )}
                                                {item.air_pollution_risk && item.air_pollution_risk !== 'none' && (
                                                    <Badge className={`text-xs border-0 ${riskColors[item.air_pollution_risk as string] || ''}`}>
                                                        Air: {item.air_pollution_risk}
                                                    </Badge>
                                                )}
                                                {item.species_count > 0 && <span className="text-xs text-muted-foreground">{item.species_count} species</span>}
                                                {item.vegetation_cover_pct > 0 && <span className="text-xs text-muted-foreground">{item.vegetation_cover_pct}% cover</span>}
                                            </div>
                                            <div className="flex gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                                                {item.wildlife_observed && <span>🦎 {item.wildlife_observed}</span>}
                                                {item.wild_beekeeping && <span>🐝 Wild bees</span>}
                                                {item.managed_beekeeping && <span>🍯 Managed bees</span>}
                                                {item.protection_method && <span>🛡️ {item.protection_method}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button variant="outline" size="sm" className="h-8 rounded-lg" onClick={() => handleEdit(item as unknown as Record<string, unknown>)}><Pencil className="h-3 w-3" /></Button>
                                            <Button variant="outline" size="sm" className="h-8 rounded-lg text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)} disabled={deleteMutation.isPending}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
