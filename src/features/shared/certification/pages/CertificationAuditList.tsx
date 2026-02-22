import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
    ClipboardList, Search, Filter, Calendar, MapPin,
    ChevronRight, ArrowLeft, FileText, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pb from '@/config/pocketbase';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/GlassCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import DataExportBar from '@/components/shared/DataExportBar';

export default function CertificationAuditList() {
    const { t } = useTranslation(['common', 'nav']);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');

    // Fetch all audit records
    const { data: audits, isLoading } = useQuery({
        queryKey: ['all_audits', search, typeFilter, countryFilter],
        queryFn: async () => {
            const fetchList = async (coll: string, type: string) => {
                try {
                    const filters: string[] = [];

                    // Map collection specific fields for search
                    let locField = 'location';
                    let audField = 'inspector_name';

                    if (type === 'ra') {
                        locField = 'audit_location';
                        audField = 'auditor_name';
                    } else if (type === 'fairtrade' || type === 'birdfriendly') {
                        // Assume standard naming for these or generic 'location' / 'inspector'
                        locField = 'location';
                        audField = 'inspector_name';
                    }

                    if (search) {
                        filters.push(`(${locField} ~ "${search}" || ${audField} ~ "${search}")`);
                    }
                    if (countryFilter !== 'all') {
                        filters.push(`(country = "${countryFilter}" || country = "" || country = null)`);
                    }

                    const opts: any = {
                        filter: filters.join(' && '),
                        sort: '-created',
                    };
                    if (coll === 'eu_organic_farm_inspections') opts.expand = 'farmer,farm';
                    else if (coll === 'eu_organic_inspections') opts.expand = 'farmer';
                    return (await pb.collection(coll).getFullList(opts)).map(item => ({ ...item, type }));
                } catch (e) {
                    console.warn(`Fetch failed for ${coll}:`, e);
                    return [];
                }
            };

            const [ra, euo, euoFarm, euoQa, ft, bf] = await Promise.all([
                fetchList('ra_audits', 'ra'),
                fetchList('eu_organic_inspections', 'eu_organic'),
                fetchList('eu_organic_farm_inspections', 'eu_organic_farm'),
                fetchList('eu_organic_processing_qa', 'eu_organic_qa'),
                fetchList('fairtrade_audits', 'fairtrade'),
                fetchList('birdfriendly_audits', 'birdfriendly'),
            ]);

            let combined = [...ra, ...euo, ...euoFarm, ...euoQa, ...ft, ...bf];

            // Client-side type filtering because they come from different collections
            if (typeFilter !== 'all') {
                combined = combined.filter(a => a.type === typeFilter);
            }

            return combined.sort((a: any, b: any) =>
                new Date(b.created).getTime() - new Date(a.created).getTime()
            );
        },
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'ra': return 'RA Audit';
            case 'eu_organic': return 'EU Organic';
            case 'eu_organic_farm': return 'EU Farm Insp';
            case 'eu_organic_qa': return 'EU QA';
            case 'fairtrade': return 'Fairtrade';
            case 'birdfriendly': return 'Bird Friendly';
            default: return type;
        }
    };

    return (
        <div className="space-y-6 page-enter">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Button variant="ghost" size="sm" className="h-8 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            {t('common:back')}
                        </Button>
                    </div>
                    <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
                        <ClipboardList className="h-7 w-7 text-primary-600" />
                        {t('common:assessment_records', 'Assessment Records')}
                    </h1>
                    <p className="text-gray-500">Comprehensive history of all certification audits and inspections.</p>
                </div>
                <DataExportBar
                    data={(audits || []).map((a: any) => ({
                        type: getTypeLabel(a.type),
                        date: new Date(a.audit_date || a.inspection_date || a.created).toLocaleDateString(),
                        location: a.audit_location || (a.expand as any)?.farm?.farm_name || a.inspection_id || '',
                        auditor: a.auditor_name || a.inspector_name || 'System',
                        country: a.country || 'Global',
                        status: a.status || '',
                    }))}
                    columns={[
                        { key: 'type', label: 'Type' },
                        { key: 'date', label: 'Date' },
                        { key: 'location', label: 'Location' },
                        { key: 'auditor', label: 'Auditor' },
                        { key: 'country', label: 'Country' },
                        { key: 'status', label: 'Status' },
                    ]}
                    filename="audit_records"
                    sheetName="Audits"
                    totalLabel={`${audits?.length || 0} records`}
                />
            </div>

            {/* Filters Area */}
            <GlassCard className="p-4 border-none shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by location or auditor..."
                            className="pl-9 bg-white/50 border-white/40 focus:bg-white transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[160px] bg-white/50 border-white/40">
                                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="ra">RA Audit</SelectItem>
                                <SelectItem value="eu_organic">EU Organic</SelectItem>
                                <SelectItem value="eu_organic_farm">EU Farm Insp</SelectItem>
                                <SelectItem value="eu_organic_qa">EU QA</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={countryFilter} onValueChange={setCountryFilter}>
                            <SelectTrigger className="w-[140px] bg-white/50 border-white/40">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Countries</SelectItem>
                                <SelectItem value="vietnam">Vietnam</SelectItem>
                                <SelectItem value="laos">Laos</SelectItem>
                                <SelectItem value="indonesia">Indonesia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </GlassCard>

            {/* Table Area */}
            <GlassCard className="p-0 border-none shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-primary-50/50 backdrop-blur-sm">
                            <TableRow className="border-b-white/20">
                                <TableHead className="font-bold text-primary-900">Type</TableHead>
                                <TableHead className="font-bold text-primary-900">Date</TableHead>
                                <TableHead className="font-bold text-primary-900">Subject / Location</TableHead>
                                <TableHead className="font-bold text-primary-900">Auditor</TableHead>
                                <TableHead className="font-bold text-primary-900">Country</TableHead>
                                <TableHead className="font-bold text-primary-900 text-center">Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                                            <p className="text-sm text-gray-500">Loading records...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : audits?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-12 w-12 opacity-10" />
                                            <p>No records found matching your filters.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                audits?.map((audit: any) => (
                                    <TableRow
                                        key={audit.id}
                                        className="group border-b-white/10 hover:bg-white/40 transition-colors cursor-pointer"
                                        onClick={() => navigate(`${ROUTES.IMPACT_CERTIFICATION}?view=${audit.id}`)}
                                    >
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-[10px] uppercase font-bold",
                                                audit.type === 'ra' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                                    audit.type.includes('farm') ? 'border-sky-200 bg-sky-50 text-sky-700' :
                                                        audit.type.includes('qa') ? 'border-purple-200 bg-purple-50 text-purple-700' :
                                                            'border-green-200 bg-green-50 text-green-700'
                                            )}>
                                                {getTypeLabel(audit.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 opacity-40" />
                                                {new Date(audit.audit_date || audit.inspection_date || audit.created).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-gray-900">
                                                {audit.audit_location || (audit.expand as any)?.farm?.farm_name || audit.inspection_id}
                                            </div>
                                            <div className="text-[11px] text-gray-500 truncate max-w-[200px]">
                                                ID: {audit.id}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-700 italic">
                                            {audit.auditor_name || audit.inspector_name || 'System'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-white/50 text-[10px] uppercase">
                                                {audit.country || 'Global'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={cn("text-[10px] h-5", getStatusBadge(audit.status))}>
                                                {audit.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </GlassCard>
        </div>
    );
}
