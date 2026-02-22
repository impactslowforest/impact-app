import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QrCode, Search, CheckCircle2, AlertCircle, Loader2, Keyboard, User, Building2,
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

type SourceType = 'Cooperative' | 'Slow farm' | 'Third party';
type InputType = 'QR code' | 'Manual';
type FarmIdType = 'NP' | 'LK' | 'PL' | 'KT';

interface FarmLookupResult {
  farmId: string;
  farmCode: string;
  farmName: string;
  farmerId: string;
  farmerCode: string;
  farmerName: string;
  villageCode: string;
  villageName: string;
  variety: string;
  certificate: string;
}

interface InboundRequestCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: string;
  onCreated: () => void;
}

const SOURCE_OPTIONS: SourceType[] = ['Cooperative', 'Slow farm', 'Third party'];
const INPUT_TYPE_OPTIONS: InputType[] = ['QR code', 'Manual'];
const FARM_ID_OPTIONS: FarmIdType[] = ['NP', 'LK', 'PL', 'KT'];

const COMPANY_NAMES = [
  'CPC Cooperative Coffee',
  'Paksong Small Holders Coffee',
  'LALCO',
  'Mrs. Hien',
  'Paksong Small Holders-2',
];

const SEASON_OPTIONS = [
  { value: '2024/2025', label: '2024/2025' },
  { value: '2025/2026', label: '2025/2026' },
];

export default function InboundRequestCreateDialog({
  open,
  onOpenChange,
  country,
  onCreated,
}: InboundRequestCreateDialogProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();

  // Section A: Source & Input Type
  const [source, setSource] = useState<SourceType>('Cooperative');
  const [inputType, setInputType] = useState<InputType>('Manual');

  // Slow farm specific
  const [farmId, setFarmId] = useState<FarmIdType>('NP');

  // Third party specific
  const [companyName, setCompanyName] = useState(COMPANY_NAMES[0]);

  // Cooperative specific
  const [villages, setVillages] = useState<string[]>([]);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [farmers, setFarmers] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [selectedFarmer, setSelectedFarmer] = useState('');

  // Section B: Lookup
  const [manualCode, setManualCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<FarmLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Section C: Form fields
  const [variety, setVariety] = useState('Arabica');
  const [process, setProcess] = useState('Washed');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [season, setSeason] = useState('2024/2025');
  const [status, setStatus] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  // Submit state
  const [submitting, setSubmitting] = useState(false);

  // QR scanner refs
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerInitialized = useRef(false);

  const today = new Date().toISOString().split('T')[0];
  const staffName = user?.name || pb.authStore.record?.name || '';

  // Reset form on dialog close/open
  useEffect(() => {
    if (!open) {
      cleanupScanner();
      setSource('Cooperative');
      setInputType('Manual');
      setFarmId('NP');
      setCompanyName(COMPANY_NAMES[0]);
      setSelectedVillage('');
      setSelectedFarmer('');
      setManualCode('');
      setLookupLoading(false);
      setLookupResult(null);
      setLookupError(null);
      setVariety('Arabica');
      setProcess('Washed');
      setVehicleNumber('');
      setSeason('2024/2025');
      setStatus('');
      setApprovalStatus('');
      setSubmitting(false);
    }
  }, [open]);

  // Load villages for Cooperative + Manual mode
  useEffect(() => {
    if (source === 'Cooperative' && inputType === 'Manual' && open) {
      loadVillages();
    }
  }, [source, inputType, open]);

  // Load farmers when village selected
  useEffect(() => {
    if (selectedVillage && source === 'Cooperative') {
      loadFarmers(selectedVillage);
    } else {
      setFarmers([]);
      setSelectedFarmer('');
    }
  }, [selectedVillage, source]);

  // Auto-lookup for Slow farm when Farm ID changes
  useEffect(() => {
    if (source === 'Slow farm' && open) {
      lookupSlowFarm(farmId);
    }
  }, [farmId, source, open]);

  // Initialize/cleanup QR scanner when inputType changes (Cooperative only)
  useEffect(() => {
    if (!open || source !== 'Cooperative') return;

    if (inputType === 'QR code' && !lookupResult) {
      const timer = setTimeout(() => {
        if (scannerInitialized.current) return;
        const el = document.getElementById('inbound-create-qr-reader');
        if (!el) return;

        const scanner = new Html5QrcodeScanner(
          'inbound-create-qr-reader',
          { fps: 10, qrbox: { width: 220, height: 220 } },
          false,
        );
        scanner.render(onScanSuccess, () => {});
        scannerRef.current = scanner;
        scannerInitialized.current = true;
      }, 300);

      return () => clearTimeout(timer);
    } else {
      cleanupScanner();
    }
  }, [inputType, open, lookupResult, source]);

  function cleanupScanner() {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    scannerInitialized.current = false;
  }

  async function loadVillages() {
    try {
      const filter = country ? `country = "${country}"` : '';
      const records = await pb.collection('farmers').getList(1, 500, {
        filter,
        fields: 'village',
        sort: 'village',
      });
      const uniqueVillages = Array.from(new Set(
        records.items.map(r => String(r.village || '')).filter(Boolean)
      )).sort();
      setVillages(uniqueVillages);
    } catch {
      toast.error(t('error_loading_villages', 'Error loading villages'));
    }
  }

  async function loadFarmers(village: string) {
    try {
      const filter = country
        ? `country = "${country}" && village = "${village}"`
        : `village = "${village}"`;
      const records = await pb.collection('farmers').getList(1, 500, {
        filter,
        fields: 'id,full_name,farmer_code',
        sort: 'full_name',
      });
      setFarmers(
        records.items.map(r => ({
          id: r.id,
          name: String(r.full_name || ''),
          code: String(r.farmer_code || ''),
        }))
      );
    } catch {
      toast.error(t('error_loading_farmers', 'Error loading farmers'));
    }
  }

  async function lookupSlowFarm(farmIdCode: FarmIdType) {
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      // Look up farm by farm_code starting with farmIdCode (e.g. "NP")
      const farms = await pb.collection('farms').getList(1, 1, {
        filter: `farm_code ~ "${farmIdCode}"`,
        expand: 'farmer',
      });

      if (farms.items.length > 0) {
        const farm = farms.items[0];
        const farmer = farm.expand?.farmer as Record<string, unknown> | undefined;

        setLookupResult({
          farmId: farm.id,
          farmCode: String(farm.farm_code || ''),
          farmName: String(farm.farm_name || ''),
          farmerId: farmer ? String(farmer.id || '') : '',
          farmerCode: farmer ? String(farmer.farmer_code || '') : '',
          farmerName: farmer ? String(farmer.full_name || '') : '',
          villageCode: String(farm.village || ''),
          villageName: String(farm.village || farm.district || ''),
          variety: '',
          certificate: String(farm.certification_status || ''),
        });
      }
    } catch {
      // Silent fail for Slow farm auto-lookup
    } finally {
      setLookupLoading(false);
    }
  }

  async function lookupCooperativeFarmer() {
    if (!selectedFarmer) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const farmer = await pb.collection('farmers').getOne(selectedFarmer);
      // Get farmer's primary farm
      const farms = await pb.collection('farms').getList(1, 1, {
        filter: `farmer = "${selectedFarmer}"`,
      });

      const farm = farms.items.length > 0 ? farms.items[0] : null;

      setLookupResult({
        farmId: farm ? farm.id : '',
        farmCode: farm ? String(farm.farm_code || '') : '',
        farmName: farm ? String(farm.farm_name || '') : '',
        farmerId: farmer.id,
        farmerCode: String(farmer.farmer_code || ''),
        farmerName: String(farmer.full_name || ''),
        villageCode: String(farmer.village || ''),
        villageName: String(farmer.village || ''),
        variety: '',
        certificate: farm ? String(farm.certification_status || '') : '',
      });
    } catch {
      setLookupError(t('farmer_lookup_error', 'Error looking up farmer'));
    } finally {
      setLookupLoading(false);
    }
  }

  async function onScanSuccess(decodedText: string) {
    await lookupByCode(decodedText.trim());
  }

  async function lookupByCode(code: string) {
    if (!code) return;
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      // Try 1: look up in farms by farm_code
      try {
        const farm = await pb.collection('farms').getFirstListItem(
          `farm_code = "${code}"`,
          { expand: 'farmer' },
        );
        const farmer = farm.expand?.farmer as Record<string, unknown> | undefined;

        setLookupResult({
          farmId: farm.id,
          farmCode: String(farm.farm_code || ''),
          farmName: String(farm.farm_name || ''),
          farmerId: farmer ? String(farmer.id || '') : '',
          farmerCode: farmer ? String(farmer.farmer_code || '') : '',
          farmerName: farmer ? String(farmer.full_name || '') : '',
          villageCode: String(farm.village || ''),
          villageName: String(farm.village || farm.district || ''),
          variety: '',
          certificate: String(farm.certification_status || ''),
        });
        setLookupLoading(false);
        return;
      } catch {
        // Not found in farms, try log_book_details
      }

      // Try 2: look up in log_book_details by lot_code
      try {
        const detail = await pb.collection('log_book_details').getFirstListItem(
          `lot_code = "${code}"`,
          { expand: 'farmer,farm' },
        );
        const farm = detail.expand?.farm as Record<string, unknown> | undefined;
        const farmer = detail.expand?.farmer as Record<string, unknown> | undefined;

        setLookupResult({
          farmId: farm ? String(farm.id || '') : String(detail.farm || ''),
          farmCode: farm ? String(farm.farm_code || '') : '',
          farmName: farm ? String(farm.farm_name || '') : '',
          farmerId: farmer ? String(farmer.id || '') : String(detail.farmer || ''),
          farmerCode: farmer ? String(farmer.farmer_code || '') : '',
          farmerName: farmer ? String(farmer.full_name || '') : '',
          villageCode: String(detail.village_code || ''),
          villageName: String(detail.village_code || ''),
          variety: String(detail.variety || ''),
          certificate: String(detail.certificate || ''),
        });
        if (detail.variety) setVariety(String(detail.variety));
        setLookupLoading(false);
        return;
      } catch {
        // Not found
      }

      // Try 3: fuzzy search farms by farm_code containing the input
      const farms = await pb.collection('farms').getList(1, 5, {
        filter: `farm_code ~ "${code}"`,
        expand: 'farmer',
      });

      if (farms.items.length > 0) {
        const farm = farms.items[0];
        const farmer = farm.expand?.farmer as Record<string, unknown> | undefined;

        setLookupResult({
          farmId: farm.id,
          farmCode: String(farm.farm_code || ''),
          farmName: String(farm.farm_name || ''),
          farmerId: farmer ? String(farmer.id || '') : '',
          farmerCode: farmer ? String(farmer.farmer_code || '') : '',
          farmerName: farmer ? String(farmer.full_name || '') : '',
          villageCode: String(farm.village || ''),
          villageName: String(farm.village || farm.district || ''),
          variety: '',
          certificate: String(farm.certification_status || ''),
        });
      } else {
        setLookupError(t('farm_not_found', 'Farm or lot not found in system'));
      }
    } catch {
      setLookupError(t('lookup_error', 'Error looking up code'));
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit() {
    // Validation per source type
    // Slow farm: No validation needed (hook only needs country)
    // Third party: Only needs company name
    if (source === 'Third party' && !companyName) {
      toast.error(t('please_select_company', 'Please select a company'));
      return;
    }
    // Cooperative: MUST have farm lookup
    if (source === 'Cooperative' && !lookupResult) {
      toast.error(t('please_lookup_farm', 'Please search for a farm/farmer first'));
      return;
    }
    if (source === 'Cooperative' && lookupResult && !lookupResult.farmId) {
      toast.error(t('farmer_no_farm', 'This farmer does not have an associated farm. Please link a farm first.'));
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        source,
        input_type: inputType,
        staff: staffName,
        request_date: today,
        variety,
        process,
        vehicle_number: vehicleNumber,
        season,
        status,
        approval_status: approvalStatus,
        country,
      };

      // COOPERATIVE: MUST have farm/farmer from lookup
      if (source === 'Cooperative' && lookupResult) {
        payload.farm = lookupResult.farmId;
        payload.farmer = lookupResult.farmerId;
        payload.village_code = lookupResult.villageCode;
      }

      // SLOW FARM: Optionally add farm/farmer if lookup succeeded
      if (source === 'Slow farm') {
        // Add farm/farmer only if lookup succeeded
        if (lookupResult && lookupResult.farmId) {
          payload.farm = lookupResult.farmId;
          payload.farmer = lookupResult.farmerId;
          payload.village_code = lookupResult.villageCode;
        }
      }

      // THIRD PARTY: NO farm/farmer needed (company name from supplier relation)
      if (source === 'Third party') {
        // company_name removed; available via supplier relation expand
      }

      // Debug logging
      console.log('🔍 Payload to create:', payload);
      console.log('🔍 Lookup result:', lookupResult);

      await pb.collection('inbound_requests').create(payload);

      toast.success(t('created', 'Created successfully'));
      onCreated();
      onOpenChange(false);
    } catch (err: unknown) {
      console.error('❌ Create error:', err);
      const pbErr = err as { response?: { data?: Record<string, { message: string }> }; message?: string };
      if (pbErr?.response?.data) {
        const fieldErrors = Object.entries(pbErr.response.data)
          .map(([field, detail]) => `${field}: ${detail.message}`)
          .join(', ');
        console.error('Field errors:', fieldErrors);
        toast.error(fieldErrors);
      } else {
        const errMsg = pbErr?.message || t('error', 'Error');
        console.error('Error message:', errMsg);
        toast.error(errMsg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Helper to check if we need to show lookup result section
  const showLookupResult = lookupResult && (source === 'Slow farm' || source === 'Cooperative');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {t('create_inbound_request', 'Create Inbound Request')}
          </DialogTitle>
          <DialogDescription>
            {t('inbound_create_desc', 'Create a new warehouse inbound proposal')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ─── Section A: Source ─── */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('source', 'Source')}
            </Label>
            <div className="flex gap-2">
              {SOURCE_OPTIONS.map(opt => (
                <Button
                  key={opt}
                  type="button"
                  variant={source === opt ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSource(opt);
                    setLookupResult(null);
                    setLookupError(null);
                    setManualCode('');
                  }}
                  className={source === opt ? 'bg-primary-700 text-white' : ''}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>

          {/* ─── SLOW FARM UI ─── */}
          {source === 'Slow farm' && (
            <div className="space-y-4">
              {/* Company Name (auto-filled) */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t('company_name', 'Company name')}
                </Label>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium justify-start"
                  disabled
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Forest Plateau Lao Co., Ltd
                </Button>
              </div>

              {/* Farm ID Selection (Optional) */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t('farm_id', 'Farm ID')} <span className="text-xs font-normal text-gray-400">({t('optional', 'Optional')})</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {FARM_ID_OPTIONS.map(opt => (
                    <Button
                      key={opt}
                      type="button"
                      variant={farmId === opt ? 'default' : 'outline'}
                      onClick={() => setFarmId(opt)}
                      className={farmId === opt ? 'bg-primary-700 text-white' : ''}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 italic">
                  {t('slow_farm_id_hint', 'Select a region if you want to link this request to a specific farm')}
                </p>
              </div>
            </div>
          )}

          {/* ─── COOPERATIVE UI ─── */}
          {source === 'Cooperative' && (
            <>
              {/* Input Type */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t('input_type', 'Input Type')}
                </Label>
                <div className="flex gap-2">
                  {INPUT_TYPE_OPTIONS.map(opt => (
                    <Button
                      key={opt}
                      type="button"
                      variant={inputType === opt ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setInputType(opt);
                        setLookupResult(null);
                        setLookupError(null);
                        setManualCode('');
                      }}
                      className={`gap-1.5 ${inputType === opt ? 'bg-primary-700 text-white' : ''}`}
                    >
                      {opt === 'QR code' ? <QrCode className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Lookup Area */}
              {!lookupResult && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                  {inputType === 'QR code' ? (
                    <>
                      <p className="text-sm text-gray-600">
                        {t('scan_qr_instruction', 'Scan QR code on bag or enter lot code manually')}
                      </p>
                      <div
                        id="inbound-create-qr-reader"
                        className="overflow-hidden rounded-lg border bg-black min-h-[240px]"
                      />
                      {/* Manual fallback for QR mode */}
                      <div className="flex gap-2">
                        <Input
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          placeholder={t('lot_code', 'Lot code') + '...'}
                          className="font-mono"
                          onKeyDown={(e) => e.key === 'Enter' && lookupByCode(manualCode)}
                        />
                        <Button
                          onClick={() => lookupByCode(manualCode)}
                          disabled={lookupLoading}
                          size="sm"
                          className="gap-1.5 shrink-0"
                        >
                          {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          {t('search', 'Search')}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        {t('select_village_farmer', 'Select village then farmer')}
                      </p>
                      {/* Village Name dropdown */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700">
                          {t('village_name', 'Village Name')} *
                        </Label>
                        <select
                          value={selectedVillage}
                          onChange={(e) => setSelectedVillage(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        >
                          <option value="">{t('select_village', 'Select village...')}</option>
                          {villages.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>

                      {/* Farmer name dropdown */}
                      {selectedVillage && (
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-gray-700">
                            {t('farmer_name', 'Farmer name')} *
                          </Label>
                          <select
                            value={selectedFarmer}
                            onChange={(e) => setSelectedFarmer(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          >
                            <option value="">{t('select_farmer', 'Select farmer...')}</option>
                            {farmers.map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Lookup button */}
                      {selectedFarmer && (
                        <Button
                          onClick={lookupCooperativeFarmer}
                          disabled={lookupLoading}
                          className="w-full gap-1.5"
                        >
                          {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          {t('lookup_farmer', 'Lookup Farmer')}
                        </Button>
                      )}
                    </>
                  )}

                  {/* Error */}
                  {lookupError && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                      <p className="text-sm text-red-700">{lookupError}</p>
                    </div>
                  )}

                  {/* Loading */}
                  {lookupLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ─── THIRD PARTY UI ─── */}
          {source === 'Third party' && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('company_name', 'Company name')}
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {COMPANY_NAMES.map(name => (
                  <Button
                    key={name}
                    type="button"
                    variant={companyName === name ? 'default' : 'outline'}
                    onClick={() => setCompanyName(name)}
                    className={`justify-start ${companyName === name ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Lookup Result (Slow farm & Cooperative only) ─── */}
          {showLookupResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-800">
                    {source === 'Slow farm' ? t('farm_found', 'Farm Found') : t('farmer_found', 'Farmer Found')}
                  </p>
                  <p className="text-xs text-green-600">
                    {lookupResult.farmCode || lookupResult.farmerCode} — {lookupResult.farmName || lookupResult.farmerName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLookupResult(null);
                    setLookupError(null);
                    setManualCode('');
                    setSelectedVillage('');
                    setSelectedFarmer('');
                  }}
                  className="text-xs"
                >
                  {t('change', 'Change')}
                </Button>
              </div>

              {/* Auto-filled info grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border text-sm">
                <div>
                  <p className="text-xs text-gray-500">{t('farmer', 'Farmer')}</p>
                  <p className="font-medium">{lookupResult.farmerName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('farm', 'Farm')}</p>
                  <p className="font-medium">{lookupResult.farmName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('village', 'Village')}</p>
                  <p className="font-medium">{lookupResult.villageName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('certificate', 'Certificate')}</p>
                  <p className="font-medium">{lookupResult.certificate || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Section C: Form Fields ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Staff (auto-filled, readonly display) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <User className="h-3 w-3" />
                {t('staff', 'Staff')}
              </Label>
              <Input
                value={staffName}
                readOnly
                className="bg-gray-50 border-gray-200 text-gray-600"
              />
            </div>

            {/* Request Date (auto-filled) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                {t('request_date', 'Request Date')}
              </Label>
              <Input
                type="date"
                value={today}
                readOnly
                className="bg-gray-50 border-gray-200 text-gray-600"
              />
            </div>

            {/* Variety */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                {t('variety', 'Variety')}
              </Label>
              <Input
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="Arabica"
                className="border-gray-200"
              />
            </div>

            {/* Process */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                {t('process', 'Process')}
              </Label>
              <select
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="Washed">Washed</option>
              </select>
            </div>

            {/* Vehicle Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                {t('vehicle_number', 'Vehicle Number')}
              </Label>
              <Input
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="border-gray-200"
              />
            </div>

            {/* Season */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                {t('season', 'Season')}
              </Label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {SEASON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                {t('status', 'Status')}
              </Label>
              <Input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border-gray-200"
              />
            </div>

            {/* Approval Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                {t('approval_status', 'Approval')}
              </Label>
              <Input
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                className="border-gray-200"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary-700 hover:bg-primary-800 text-white gap-1.5"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('create_request', 'Create Request')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
