import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, User, MapPin, Phone, Calendar, TreePine,
  ShieldCheck, FileCheck, BarChart3, Loader2, QrCode,
  Sprout, Scale, Leaf, Download,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import pb from '@/config/pocketbase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import DataExportBar from '@/components/shared/DataExportBar';

export default function FarmerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['common', 'nav']);
  const navigate = useNavigate();

  // Fetch farmer with expanded relations
  const { data: farmer, isLoading } = useQuery({
    queryKey: ['farmer-profile', id],
    queryFn: () =>
      pb.collection('farmers').getOne(id!, {
        expand: 'cooperative',
      }),
    enabled: !!id,
  });

  // Fetch all farms for this farmer
  const { data: farms } = useQuery({
    queryKey: ['farmer-farms', id],
    queryFn: () =>
      pb.collection('farms').getFullList({
        filter: `farmer = "${id}"`,
        sort: '-created',
      }),
    enabled: !!id,
  });

  // Fetch harvest records
  const { data: harvests } = useQuery({
    queryKey: ['farmer-harvests', id],
    queryFn: () =>
      pb.collection('harvest_records').getFullList({
        filter: `farmer = "${id}"`,
        sort: '-harvest_date',
      }),
    enabled: !!id,
  });

  // Fetch compliance records
  const { data: compliance } = useQuery({
    queryKey: ['farmer-compliance', id],
    queryFn: () =>
      pb.collection('compliance_records').getFullList({
        filter: `farmer = "${id}"`,
        sort: '-year',
      }),
    enabled: !!id,
  });

  // Fetch annual data
  const { data: annualData } = useQuery({
    queryKey: ['farmer-annual', id],
    queryFn: () =>
      pb.collection('farmer_annual_data').getFullList({
        filter: `farmer = "${id}"`,
        sort: '-year',
      }),
    enabled: !!id,
  });

  // Fetch GHG emissions
  const { data: ghg } = useQuery({
    queryKey: ['farmer-ghg', id],
    queryFn: () =>
      pb.collection('ghg_emissions').getFullList({
        filter: `farmer = "${id}"`,
        sort: '-year',
      }),
    enabled: !!id,
  });

  const qrUrl = farmer ? `${window.location.origin}/farmer/${farmer.id}` : '';

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="text-center py-20 text-gray-400">
        <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
        <p>{t('common:no_record_found', 'Farmer not found')}</p>
      </div>
    );
  }

  const certBadgeColor: Record<string, string> = {
    none: 'bg-gray-100 text-gray-600',
    organic: 'bg-green-100 text-green-700',
    transitional: 'bg-amber-100 text-amber-700',
    fair_trade: 'bg-blue-100 text-blue-700',
    multiple: 'bg-purple-100 text-purple-700',
  };

  // Export column definitions
  const harvestColumns = [
    { key: 'harvest_date', label: t('common:date', 'Date') },
    { key: 'crop_type', label: t('common:crop', 'Crop') },
    { key: 'variety', label: t('common:variety', 'Variety') },
    { key: 'quantity_kg', label: t('common:quantity_kg', 'Qty (kg)') },
    { key: 'quality_grade', label: t('common:grade', 'Grade') },
    { key: 'price_per_kg', label: t('common:price', 'Price/kg') },
    { key: 'buyer', label: t('common:buyer', 'Buyer') },
  ];

  const farmColumns = [
    { key: 'farm_code', label: t('common:code', 'Code') },
    { key: 'farm_name', label: t('common:name', 'Name') },
    { key: 'area_ha', label: t('common:area', 'Area (ha)') },
    { key: 'commodity', label: t('common:commodity', 'Commodity') },
    { key: 'production_system', label: t('common:system', 'System') },
    { key: 'certification_status', label: t('common:certification', 'Cert.') },
  ];

  return (
    <div className="space-y-6 page-enter max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Button variant="ghost" size="sm" className="h-8 pl-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('common:back', 'Back')}
        </Button>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-primary-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-primary-500" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar & Name */}
              <div className="flex flex-col items-center gap-3 md:w-48">
                <div className="h-20 w-20 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                  <User className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-900">{farmer.full_name}</h2>
                  <p className="text-xs font-mono text-gray-500">{farmer.farmer_code}</p>
                </div>
                <Badge className={`text-xs ${certBadgeColor[farmer.certification_status] || certBadgeColor.none}`}>
                  {farmer.certification_status?.replace('_', ' ')}
                </Badge>
              </div>

              {/* Details Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                <InfoRow icon={Phone} label={t('common:phone', 'Phone')} value={farmer.phone} />
                <InfoRow icon={MapPin} label={t('common:village', 'Village')} value={farmer.village} />
                <InfoRow icon={MapPin} label={t('common:district', 'District')} value={farmer.district} />
                <InfoRow icon={MapPin} label={t('common:province', 'Province')} value={farmer.province} />
                <InfoRow icon={Calendar} label={t('common:dob', 'Date of Birth')} value={farmer.date_of_birth ? new Date(farmer.date_of_birth).toLocaleDateString() : '--'} />
                <InfoRow icon={User} label={t('common:gender', 'Gender')} value={farmer.gender} />
                <InfoRow icon={Scale} label={t('common:farm_size', 'Farm Size')} value={`${farmer.farm_size_ha || 0} ha`} />
                <InfoRow icon={User} label={t('common:household', 'Household')} value={`${farmer.household_size || 0} members`} />
                {(farmer.expand as any)?.cooperative && (
                  <InfoRow icon={Leaf} label={t('common:cooperative', 'Cooperative')} value={(farmer.expand as any).cooperative.name} />
                )}
                <InfoRow icon={Calendar} label={t('common:registered', 'Registered')} value={new Date(farmer.registration_date || farmer.created).toLocaleDateString()} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card className="shadow-sm flex flex-col items-center justify-center p-6 gap-4">
          <QRCodeSVG value={qrUrl} size={160} level="H" />
          <p className="text-xs text-gray-500 font-mono text-center break-all max-w-[200px]">
            {farmer.farmer_code || farmer.id}
          </p>
          <Badge variant="outline" className="text-[10px]">
            <QrCode className="h-3 w-3 mr-1" />
            Scan for traceability
          </Badge>
        </Card>
      </div>

      {/* Farms */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="py-4 flex flex-row items-center justify-between border-b bg-gray-50/50">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <TreePine className="h-4 w-4 text-primary-600" />
            {t('common:farms', 'Farms')}
            <Badge variant="secondary" className="ml-1">{farms?.length || 0}</Badge>
          </CardTitle>
          {farms && farms.length > 0 && (
            <DataExportBar
              data={farms as unknown as Record<string, unknown>[]}
              columns={farmColumns}
              filename={`farms_${farmer.farmer_code}`}
              sheetName="Farms"
            />
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs">{t('common:code', 'Code')}</TableHead>
                <TableHead className="text-xs">{t('common:name', 'Name')}</TableHead>
                <TableHead className="text-xs text-right">{t('common:area', 'Area (ha)')}</TableHead>
                <TableHead className="text-xs">{t('common:commodity', 'Commodity')}</TableHead>
                <TableHead className="text-xs">{t('common:system', 'System')}</TableHead>
                <TableHead className="text-xs text-center">{t('common:certification', 'Cert.')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farms && farms.length > 0 ? farms.map((farm) => (
                <TableRow key={farm.id} className="text-sm hover:bg-primary-50/10">
                  <TableCell className="font-mono text-xs">{farm.farm_code}</TableCell>
                  <TableCell className="font-medium">{farm.farm_name}</TableCell>
                  <TableCell className="text-right font-bold text-primary-700">{farm.area_ha}</TableCell>
                  <TableCell className="capitalize">{String(farm.commodity).replace('_', ' ')}</TableCell>
                  <TableCell className="capitalize text-gray-600">{String(farm.production_system).replace('_', ' ')}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-[10px]">{String(farm.certification_status)}</Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-gray-400 text-sm">
                    {t('common:no_data', 'No data')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Harvest Records */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="py-4 flex flex-row items-center justify-between border-b bg-gray-50/50">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary-600" />
            {t('common:harvest_records', 'Harvest Records')}
            <Badge variant="secondary" className="ml-1">{harvests?.length || 0}</Badge>
          </CardTitle>
          {harvests && harvests.length > 0 && (
            <DataExportBar
              data={harvests as unknown as Record<string, unknown>[]}
              columns={harvestColumns}
              filename={`harvests_${farmer.farmer_code}`}
              sheetName="Harvests"
            />
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs">{t('common:date', 'Date')}</TableHead>
                <TableHead className="text-xs">{t('common:crop', 'Crop')}</TableHead>
                <TableHead className="text-xs">{t('common:variety', 'Variety')}</TableHead>
                <TableHead className="text-xs text-right">{t('common:quantity_kg', 'Qty (kg)')}</TableHead>
                <TableHead className="text-xs text-right">{t('common:grade', 'Grade')}</TableHead>
                <TableHead className="text-xs text-right">{t('common:price', 'Price/kg')}</TableHead>
                <TableHead className="text-xs">{t('common:buyer', 'Buyer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {harvests && harvests.length > 0 ? harvests.map((h) => (
                <TableRow key={h.id} className="text-sm hover:bg-primary-50/10">
                  <TableCell className="text-gray-600">{new Date(h.harvest_date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{String(h.crop_type).replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-gray-600">{h.variety || '--'}</TableCell>
                  <TableCell className="text-right font-bold text-primary-700">{h.quantity_kg}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-[10px]">{h.quality_grade}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-gray-600">{h.price_per_kg || '--'}</TableCell>
                  <TableCell className="text-gray-600">{h.buyer || '--'}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-20 text-center text-gray-400 text-sm">
                    {t('common:no_data', 'No data')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assessment Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Compliance */}
        <Card className="shadow-sm">
          <CardHeader className="py-3 border-b">
            <CardTitle className="text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              {t('common:compliance', 'Compliance')}
              <Badge variant="secondary" className="ml-auto">{compliance?.length || 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {compliance && compliance.length > 0 ? compliance.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{c.year}</span>
                <Badge variant="outline" className={`text-[9px] ${
                  c.corrective_action_status === 'resolved' ? 'bg-green-50 text-green-700' :
                  c.corrective_action_status === 'pending' ? 'bg-amber-50 text-amber-700' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {String(c.corrective_action_status)}
                </Badge>
              </div>
            )) : (
              <p className="text-xs text-gray-400 text-center py-4">{t('common:no_data', 'No data')}</p>
            )}
          </CardContent>
        </Card>

        {/* Annual Production */}
        <Card className="shadow-sm">
          <CardHeader className="py-3 border-b">
            <CardTitle className="text-xs font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              {t('common:annual_production', 'Annual Production')}
              <Badge variant="secondary" className="ml-auto">{annualData?.length || 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {annualData && annualData.length > 0 ? annualData.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{a.year}</span>
                <span className="font-bold text-primary-700">{a.annual_cherry_kg || 0} kg</span>
              </div>
            )) : (
              <p className="text-xs text-gray-400 text-center py-4">{t('common:no_data', 'No data')}</p>
            )}
          </CardContent>
        </Card>

        {/* GHG Emissions */}
        <Card className="shadow-sm">
          <CardHeader className="py-3 border-b">
            <CardTitle className="text-xs font-bold flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-orange-600" />
              {t('common:ghg_emissions', 'GHG Emissions')}
              <Badge variant="secondary" className="ml-auto">{ghg?.length || 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {ghg && ghg.length > 0 ? ghg.slice(0, 5).map((g) => (
              <div key={g.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                <span className="font-medium">{g.year}</span>
                <span className="font-bold text-orange-700">{g.total_emissions_tco2e?.toFixed(2) || 0} tCO2e</span>
              </div>
            )) : (
              <p className="text-xs text-gray-400 text-center py-4">{t('common:no_data', 'No data')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-medium text-gray-800 capitalize">{value || '--'}</p>
      </div>
    </div>
  );
}
