import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    QrCode, Search, History, CheckCircle2, AlertCircle,
    MapPin, User, Calendar, Scale, Info, Loader2,
    ArrowRight, ShieldCheck
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import pb from '@/config/pocketbase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function QRIntakeVerification() {
    const { t } = useTranslation(['common', 'certification']);
    const [scannedId, setScannedId] = useState<string | null>(null);
    const [manualId, setManualId] = useState('');
    const [loading, setLoading] = useState(false);
    const [farmData, setFarmData] = useState<any>(null);
    const [harvests, setHarvests] = useState<any[]>([]);
    const [assessments, setAssessments] = useState<any[]>([]);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, []);

    async function onScanSuccess(decodedText: string) {
        if (decodedText === scannedId) return;
        setScannedId(decodedText);
        fetchData(decodedText);
        toast.success(t('common:qr_scanned', 'QR Code Scanned Successfully'));
    }

    function onScanFailure(error: any) {
        // Silently ignore failures as they happen frequently during searching
    }

    async function fetchData(code: string) {
        setLoading(true);
        try {
            // Extract ID from URL pattern, SF-XXXX, or plain ID
            let cleanId = code;
            // Handle URL: https://example.com/farmer/RECORD_ID
            const urlMatch = code.match(/\/farmer\/([a-z0-9]+)\/?$/i);
            if (urlMatch) {
                cleanId = urlMatch[1];
            } else {
                cleanId = code.replace('SF-', '');
            }

            // 1. Fetch Farm/Farmer
            // Search by farm_code or id
            const farm = await pb.collection('farms').getFirstListItem(`id="${cleanId}" || farm_code="${code}"`, {
                expand: 'farmer,farmer.cooperative'
            });
            setFarmData(farm);

            // 2. Fetch Harvest Records
            const harvestList = await pb.collection('harvest_records').getList(1, 10, {
                filter: `farm="${farm.id}"`,
                sort: '-harvest_date'
            });
            setHarvests(harvestList.items);

            // 3. Fetch Recent Assessments (EUDR and EU Organic)
            const [eudr, organic] = await Promise.all([
                pb.collection('eudr_assessments').getList(1, 5, {
                    filter: `plot.plot_code="${farm.farm_code}"`,
                    sort: '-assessment_date'
                }),
                pb.collection('eu_organic_farm_inspections').getList(1, 5, {
                    filter: `farm_id="${farm.farm_code}"`,
                    sort: '-inspection_date'
                })
            ]);

            const combinedAssessments = [
                ...eudr.items.map(i => ({ i, type: 'eudr', date: i.assessment_date, status: i.overall_compliance })),
                ...organic.items.map(i => ({ i, type: 'eu_organic', date: i.inspection_date, status: i.status || 'completed' }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setAssessments(combinedAssessments);

        } catch (err: any) {
            console.error('Fetch error:', err);
            toast.error(t('common:record_not_found', 'Farm record not found for this ID'));
            setFarmData(null);
        } finally {
            setLoading(false);
        }
    }

    const handleManualSearch = () => {
        if (!manualId) return;
        setScannedId(manualId);
        fetchData(manualId);
    };

    const resetScanner = () => {
        setScannedId(null);
        setFarmData(null);
        setHarvests([]);
        setAssessments([]);
        setManualId('');
    };

    return (
        <div className="space-y-6 page-enter max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
                        <QrCode className="h-6 w-6 text-primary-600" />
                        {t('nav:qr_scan')}
                    </h2>
                    <p className="text-sm text-gray-500">Scan farm code for intake history verification.</p>
                </div>
                {scannedId && (
                    <Button variant="outline" size="sm" onClick={resetScanner} className="gap-2">
                        <QrCode className="h-4 w-4" />
                        {t('common:scan_new', 'Scan New')}
                    </Button>
                )}
            </div>

            {!scannedId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <Card className="border-2 border-dashed border-primary-100 bg-primary-50/30 overflow-hidden">
                        <CardContent className="p-6">
                            <div id="qr-reader" className="overflow-hidden rounded-xl border-4 border-white shadow-md bg-black min-h-[300px]"></div>
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">{t('common:align_qr_instructions', 'Align the farm QR code within the frame.')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Search className="h-4 w-4 text-primary-500" />
                                {t('common:manual_lookup', 'Manual Lookup')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-500">Enter the Farm ID (e.g., SF-123) or PocketBase ID if scanning is not available.</p>
                            <div className="flex gap-2">
                                <Input
                                    value={manualId}
                                    onChange={(e) => setManualId(e.target.value)}
                                    placeholder="SF-..."
                                    className="font-mono"
                                    onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                                />
                                <Button onClick={handleManualSearch} className="bg-primary-600">
                                    {t('common:search', 'Search')}
                                </Button>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('common:recent_scans', 'Recent Scans')}</h4>
                                <div className="space-y-2">
                                    <p className="text-xs text-center text-gray-400 py-4 italic">No recent history</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Farm/Farmer Profile */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="overflow-hidden border-primary-100 shadow-sm relative">
                            <div className="h-2 bg-primary-500"></div>
                            {loading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary-600" />
                                    {t('common:farm_profile', 'Farm Profile')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {farmData ? (
                                    <>
                                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="h-12 w-12 rounded-lg bg-white border flex items-center justify-center shadow-sm">
                                                <MapPin className="h-6 w-6 text-primary-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t('common:farm_code', 'Farm Code')}</p>
                                                <p className="text-base font-bold text-gray-900">{farmData.farm_code}</p>
                                                <p className="text-xs text-primary-600 font-medium">{farmData.farm_name || 'Unnamed Plot'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {t('common:farmer', 'Farmer')}</span>
                                                <span className="font-semibold text-gray-800">{(farmData.expand?.farmer as any)?.full_name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> {t('common:area', 'Area')}</span>
                                                <span className="font-semibold text-gray-800">{farmData.area_ha} ha</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {t('common:certification', 'Cert.')}</span>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 ml-auto uppercase text-[10px]">
                                                    {farmData.certification_status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                            <Badge className="bg-primary-600 capitalize">{farmData.country}</Badge>
                                            <Badge variant="secondary" className="text-[10px]">{(farmData.expand?.farmer as any)?.expand?.cooperative?.name || 'No Group'}</Badge>
                                        </div>
                                    </>
                                ) : !loading && (
                                    <div className="text-center p-8 text-gray-400">
                                        <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">{t('common:no_record_found', 'No record found')}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Verification Alert */}
                        {farmData && (
                            <Card className={`border-2 ${harvests.length > 0 ? 'border-green-100 bg-green-50/30' : 'border-amber-100 bg-amber-50/30'}`}>
                                <CardContent className="p-4 flex items-center gap-3">
                                    {harvests.length > 0 ? (
                                        <>
                                            <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-green-900">{t('common:verified_source', 'Verified Source')}</p>
                                                <p className="text-xs text-green-700">{t('common:active_harvest_history', 'Active harvest history found.')}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                <AlertCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-amber-900">{t('common:caution_verification', 'Caution')}</p>
                                                <p className="text-xs text-amber-700">{t('common:no_harvest_history', 'No recent harvest history recorded.')}</p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* History Tables */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Harvest History */}
                        <Card className="shadow-sm border-gray-100 overflow-hidden">
                            <CardHeader className="py-4 flex flex-row items-center justify-between bg-gray-50/50 border-b">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <History className="h-4 w-4 text-primary-600" />
                                    {t('common:harvesting_logbook', 'Harvesting Logbook')}
                                </CardTitle>
                                <Badge variant="outline" className="bg-white">{harvests.length} {t('common:records', 'Records')}</Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-primary-700 [&_th]:text-white">
                                        <TableRow>
                                            <TableHead className="text-xs">{t('common:date', 'Date')}</TableHead>
                                            <TableHead className="text-xs">{t('common:crop', 'Crop')}</TableHead>
                                            <TableHead className="text-xs text-right">{t('common:quantity_kg', 'Qty (kg)')}</TableHead>
                                            <TableHead className="text-xs text-right">{t('common:grade', 'Grade')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {harvests.length > 0 ? harvests.map((h) => (
                                            <TableRow key={h.id} className="text-sm hover:bg-primary-50/10 active:bg-primary-50/20 transition-colors">
                                                <TableCell className="py-3 text-gray-600">
                                                    {new Date(h.harvest_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="py-3 font-medium capitalize">
                                                    {h.crop_type.replace('_', ' ')}
                                                </TableCell>
                                                <TableCell className="py-3 text-right font-bold text-primary-700">
                                                    {h.quantity_kg}
                                                </TableCell>
                                                <TableCell className="py-3 text-right">
                                                    <Badge variant="outline" className="text-[10px] bg-white">{h.quality_grade}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-gray-400 text-sm">
                                                    {t('common:no_data')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Assessment History */}
                        <Card className="shadow-sm border-gray-100 overflow-hidden">
                            <CardHeader className="py-4 bg-gray-50/50 border-b">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary-600" />
                                    {t('common:assessment_history', 'Assessment History')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-primary-700 [&_th]:text-white">
                                        <TableRow>
                                            <TableHead className="text-xs">{t('common:type', 'Type')}</TableHead>
                                            <TableHead className="text-xs">{t('common:date', 'Date')}</TableHead>
                                            <TableHead className="text-xs text-right">{t('common:status', 'Status')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assessments.length > 0 ? assessments.map((a, idx) => (
                                            <TableRow key={idx} className="text-sm hover:bg-primary-50/10 transition-colors">
                                                <TableCell className="py-3 capitalize">
                                                    {a.type === 'eudr' ? (
                                                        <Badge className="bg-blue-600 text-[10px]">EUDR Compliance</Badge>
                                                    ) : (
                                                        <Badge className="bg-green-600 text-[10px]">EU Organic Insp.</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3 text-gray-600">
                                                    {new Date(a.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="py-3 text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] capitalize ${a.status === 'compliant' || a.status === 'completed' || a.status === 'approved'
                                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                                : 'bg-amber-50 text-amber-700 border-amber-100'
                                                            }`}
                                                    >
                                                        {a.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-gray-400 text-sm">
                                                    {t('common:no_data')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
