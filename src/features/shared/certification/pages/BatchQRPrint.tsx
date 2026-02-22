import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Printer, Loader2, QrCode, Search, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import pb from '@/config/pocketbase';
import { Button } from '@/components/ui/button';
import { HierarchicalSelector } from '@/components/shared/HierarchicalSelector';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FarmerWithFarms {
    id: string;
    full_name: string;
    farmer_code: string;
    village: string;
    cooperative: string;
    expand?: {
        cooperative?: { name: string };
        'farms(farmer)'?: any[];
    };
}

export default function BatchQRPrint() {
    const { t } = useTranslation(['common', 'certification']);
    const [selectedCriteria, setSelectedCriteria] = useState<any>({});
    const [farmers, setFarmers] = useState<FarmerWithFarms[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [qrSize, setQrSize] = useState(80); // Default size in pixels (for display)
    const [showAll, setShowAll] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Farmer_QR_Codes_${new Date().toISOString().slice(0, 10)}`,
        onBeforePrint: async () => {
            if (!showAll && farmers.length > 50) {
                const proceed = confirm(`You are about to print ${farmers.length} QR codes. It is recommended to enable "Show All" first to verify the layout. Proceed with printing all?`);
                if (!proceed) return;
            }
        }
    });

    const loadFarmers = async () => {
        const { country, cooperativeId, farmerId } = selectedCriteria;

        if (!country && !cooperativeId && !farmerId) {
            toast.error("Please select at least a country or cooperative");
            return;
        }

        setIsLoading(true);
        try {
            let filter = '';
            if (farmerId) {
                filter = `id = "${farmerId}"`;
            } else if (cooperativeId) {
                filter = `cooperative = "${cooperativeId}"`;
            } else if (country) {
                filter = `country = "${country}"`;
            }

            const records = await pb.collection('farmers').getFullList<FarmerWithFarms>({
                filter,
                sort: 'full_name',
                expand: 'cooperative,farms(farmer)',
            });

            setFarmers(records);
            toast.success(`Loaded ${records.length} farmers`);
        } catch (err) {
            console.error('Error loading farmers:', err);
            toast.error("Failed to load farmers");
        } finally {
            setIsLoading(false);
        }
    };

    const displayFarmers = showAll ? farmers : farmers.slice(0, 50);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <QrCode className="h-6 w-6 text-primary-600" />
                        {t('batch_qr_print', 'Batch QR Code Printing')}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Generate and print bulk QR labels for farm management and harvest tracking.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {farmers.length > 50 && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                            <input
                                type="checkbox"
                                id="show-all"
                                checked={showAll}
                                onChange={(e) => setShowAll(e.target.checked)}
                                className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="show-all" className="text-xs font-medium text-amber-800">
                                Show all {farmers.length} (May slow down browser)
                            </label>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={loadFarmers}
                            disabled={isLoading}
                            className="bg-primary-600 hover:bg-primary-700"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                            {t('load_farmers', 'Load Farmers')}
                        </Button>
                        <Button
                            onClick={() => handlePrint()}
                            disabled={farmers.length === 0}
                            variant="outline"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            {t('print_all', 'Print All (A4)')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Selectors */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <HierarchicalSelector
                    onSelect={useCallback((data) => setSelectedCriteria(data), [])}
                />

                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                QR Code Size: {qrSize}mm
                            </Label>
                            <Badge variant="secondary" className="text-[10px]">{qrSize}mm</Badge>
                        </div>
                        <input
                            type="range"
                            value={qrSize}
                            onChange={(e) => setQrSize(parseInt(e.target.value))}
                            min={40}
                            max={150}
                            step={5}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>
                    <div className="text-xs text-gray-400 italic md:w-64">
                        Adjusting height and width for optimal A4 placement. Large sizes may result in fewer labels per page.
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="bg-gray-100 p-8 rounded-xl min-h-[400px] flex justify-center overflow-auto border-2 border-dashed border-gray-300">
                {farmers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 space-y-2">
                        <QrCode className="h-12 w-12 opacity-20" />
                        <p>Select criteria and load farmers to see preview</p>
                    </div>
                ) : (
                    <div
                        ref={componentRef}
                        className="bg-white shadow-2xl print:shadow-none"
                        style={{
                            width: '210mm',
                            minHeight: '297mm',
                            padding: '10mm',
                            boxSizing: 'border-box'
                        }}
                    >
                        {!showAll && farmers.length > 50 && (
                            <div className="print:hidden bg-blue-50 text-blue-700 p-2 mb-4 text-xs italic text-center rounded border border-blue-100">
                                Currently showing first 50 labels for performance. Use "Show all" to see all {farmers.length} labels.
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-[5mm] print:gap-[5mm]">
                            {displayFarmers.map((farmer) => (
                                <div
                                    key={farmer.id}
                                    className="border border-gray-300 p-3 rounded flex flex-col justify-between"
                                    style={{ height: 'auto', minHeight: '60mm', breakInside: 'avoid' }}
                                >
                                    <div className="text-center font-bold text-[10px] border-b border-gray-200 pb-1 mb-2 uppercase text-gray-700">
                                        Slow Eco Coffee Farmers Cooperative
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Left Info */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-gray-400 italic leading-none">Village name:</span>
                                                <span className="text-[10px] font-medium leading-tight">{farmer.village || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-gray-400 italic leading-none">Farmer name:</span>
                                                <span className="text-[10px] font-bold leading-tight uppercase">{farmer.full_name}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-gray-400 italic leading-none">Date / Season:</span>
                                                <span className="text-[10px] leading-tight">....../....../2025</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-gray-400 italic leading-none">Lot no:</span>
                                                <span className="text-[10px] font-medium leading-tight">........................</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1">
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] text-gray-400 leading-none">Weight:</span>
                                                    <span className="text-[9px]">............kg</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] text-gray-400 leading-none">Mois:</span>
                                                    <span className="text-[9px]">............%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] text-gray-400 leading-none italic">Standard:</span>
                                                <span className="text-[8px] leading-tight font-medium">EU LA-Bio-121 / IFOAM</span>
                                            </div>
                                        </div>

                                        {/* Right QR */}
                                        <div className="w-auto flex flex-col items-center justify-center gap-1">
                                            <QRCodeSVG
                                                value={`${window.location.origin}/farmer/${farmer.id}`}
                                                size={qrSize}
                                                level="H"
                                                includeMargin={false}
                                            />
                                            <div className="text-[8px] font-mono text-center">
                                                <div>Farm ID:</div>
                                                <div className="font-bold">{farmer.farmer_code || farmer.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Help / Guidelines */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                <div className="text-sm text-blue-800">
                    <p className="font-semibold">Printing Tips:</p>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Ensure "Background Graphics" is enabled in your print settings.</li>
                        <li>Set "Margins" to "None" or "Default" for best alignment.</li>
                        <li>Recommended QR size for most scanners is 60-80mm.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
