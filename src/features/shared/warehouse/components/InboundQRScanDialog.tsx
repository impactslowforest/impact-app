import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import pb from '@/config/pocketbase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

export interface LotVerificationResult {
  lot_code: string;
  lot_detail_code: string;
  farm: string;
  farmer: string;
  farm_name: string;
  farmer_name: string;
  certificate: string;
  variety: string;
  weight_total_kg: number;
}

interface InboundQRScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLotVerified: (data: LotVerificationResult) => void;
}

export default function InboundQRScanDialog({
  open,
  onOpenChange,
  onLotVerified,
}: InboundQRScanDialogProps) {
  const { t } = useTranslation('common');
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [lotData, setLotData] = useState<LotVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerInitialized = useRef(false);

  useEffect(() => {
    if (!open) {
      // Cleanup scanner when dialog closes
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
      scannerInitialized.current = false;
      setManualCode('');
      setLotData(null);
      setError(null);
      return;
    }

    // Initialize scanner when dialog opens (with delay for DOM)
    const timer = setTimeout(() => {
      if (scannerInitialized.current) return;
      const el = document.getElementById('inbound-qr-reader');
      if (!el) return;

      const scanner = new Html5QrcodeScanner(
        'inbound-qr-reader',
        { fps: 10, qrbox: { width: 220, height: 220 } },
        false
      );
      scanner.render(onScanSuccess, () => {});
      scannerRef.current = scanner;
      scannerInitialized.current = true;
    }, 300);

    return () => clearTimeout(timer);
  }, [open]);

  async function onScanSuccess(decodedText: string) {
    await lookupLot(decodedText);
  }

  async function lookupLot(code: string) {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setLotData(null);

    try {
      // Search by lot_code in log_book_details
      const record = await pb.collection('log_book_details').getFirstListItem(
        `lot_code = "${code.trim()}"`,
        { expand: 'farmer,farm' }
      );

      const result: LotVerificationResult = {
        lot_code: record.lot_code as string || '',
        lot_detail_code: record.lot_code as string || '',
        farm: record.farm as string || '',
        farmer: record.farmer as string || '',
        farm_name: record.farm_name as string || (record.expand?.farm as any)?.farm_name || '',
        farmer_name: (record.expand?.farmer as any)?.full_name || '',
        certificate: record.certificate as string || '',
        variety: record.variety as string || '',
        weight_total_kg: Number(record.weight_total_kg) || 0,
      };

      setLotData(result);
      toast.success(t('lot_verified', 'Lot Verified'));
    } catch {
      setError(t('lot_not_found', 'Lot not found in system'));
      toast.error(t('lot_not_found', 'Lot not found'));
    } finally {
      setLoading(false);
    }
  }

  const handleConfirm = () => {
    if (lotData) {
      onLotVerified(lotData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary-600" />
            {t('scan_qr', 'Scan QR')}
          </DialogTitle>
          <DialogDescription>
            {t('scan_qr_instruction', 'Scan QR code on bag or enter lot code manually')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Scanner */}
          {!lotData && (
            <div
              id="inbound-qr-reader"
              className="overflow-hidden rounded-lg border bg-black min-h-[240px]"
            />
          )}

          {/* Manual input */}
          {!lotData && (
            <div className="flex gap-2">
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t('lot_code', 'Lot code') + '...'}
                className="font-mono"
                onKeyDown={(e) => e.key === 'Enter' && lookupLot(manualCode)}
              />
              <Button onClick={() => lookupLot(manualCode)} disabled={loading} className="gap-1.5">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {t('search', 'Search')}
              </Button>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success state */}
          {lotData && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-800">{t('lot_verified', 'Lot Verified')}</p>
                  <p className="text-xs text-green-600">{lotData.lot_code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border text-sm">
                <div>
                  <p className="text-xs text-gray-500">{t('farm', 'Farm')}</p>
                  <p className="font-medium">{lotData.farm_name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('farmer', 'Farmer')}</p>
                  <p className="font-medium">{lotData.farmer_name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('certificate', 'Certificate')}</p>
                  <p className="font-medium">{lotData.certificate || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('variety', 'Variety')}</p>
                  <p className="font-medium">{lotData.variety || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('weight_total_kg', 'Total (kg)')}</p>
                  <p className="font-bold text-primary-700">{lotData.weight_total_kg}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setLotData(null); setManualCode(''); }}>
                  {t('scan_new', 'Scan New')}
                </Button>
                <Button onClick={handleConfirm} className="gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {t('create_from_qr', 'Create from QR')}
                </Button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
