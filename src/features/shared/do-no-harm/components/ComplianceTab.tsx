import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useComplianceRecords, useDeleteComplianceRecord } from '../../farm-operations/hooks/useFarmOpsData';
import { ComplianceFormPage } from './ComplianceFormPage';

interface ComplianceTabProps {
    country: string;
}

const riskColors: Record<string, string> = {
    none: 'bg-green-100 text-green-700',
    low: 'bg-blue-100 text-blue-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    na: 'bg-gray-100 text-gray-600',
};

export function ComplianceTab({ country }: ComplianceTabProps) {
    const { t } = useTranslation('common');
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

    const filters: Record<string, string> = { contamination_risk_level: riskFilter };
    const { data, isLoading, error } = useComplianceRecords(country, search, filters, page);
    const deleteMutation = useDeleteComplianceRecord();

    const handleEdit = (item: Record<string, unknown>) => { setEditingItem(item); setShowForm(true); };
    const handleDelete = (id: string) => { if (window.confirm(t('confirm_delete', 'Delete?'))) deleteMutation.mutate(id); };
    const handleAdd = () => { setEditingItem(null); setShowForm(true); };
    const handleBack = () => { setShowForm(false); setEditingItem(null); };

    if (showForm) {
        return <ComplianceFormPage country={country} editingItem={editingItem} onBack={handleBack} />;
    }

    return (
        <>
            <Card className="rounded-xl overflow-hidden">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-600" />
                            {t('compliance_records', 'Compliance Records')}
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
                        <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-full sm:w-[180px] rounded-lg"><SelectValue placeholder="Risk Level" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('all', 'All')}</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {error ? (
                        <div className="text-center py-8 text-red-500"><ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>{t('error_loading', 'Error')}</p></div>
                    ) : isLoading ? (
                        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
                    ) : !data?.items.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>{t('no_records', 'No records')}</p>
                            <Button size="sm" className="mt-3 btn-3d-primary text-white rounded-lg" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" />Add First Record</Button>
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
                                                    {item.contamination_risk_level && (
                                                        <Badge className={`text-xs border-0 ${riskColors[item.contamination_risk_level as string] || ''}`}>
                                                            Risk: {item.contamination_risk_level}
                                                        </Badge>
                                                    )}
                                                    {item.corrective_action_status && item.corrective_action_status !== 'na' && (
                                                        <Badge className={`text-xs border-0 ${statusColors[item.corrective_action_status as string] || ''}`}>
                                                            {item.corrective_action_status}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                                                    {item.production_plan_recorded && <span>📋 Plan recorded</span>}
                                                    {item.worker_ppe_available && <span>🦺 PPE</span>}
                                                    {item.access_drinking_water && <span>💧 Water</span>}
                                                    {!item.child_labor_check && <span>👶 No child labor</span>}
                                                    {item.wildlife_protection && <span>🦜 Wildlife</span>}
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
