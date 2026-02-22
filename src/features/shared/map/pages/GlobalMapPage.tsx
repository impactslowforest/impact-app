import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Globe, MapPin, Users, Sprout, TreePine, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pb from '@/config/pocketbase';
import { ROUTES } from '@/config/routes';

// Fix leaflet default marker icon issue
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─── Location data ─── */

interface SlowForestLocation {
  id: string;
  name: string;
  country: string;
  type: 'operational' | 'partner';
  lat: number;
  lng: number;
  description: string;
  commodity?: string;
  countryCode?: 'vietnam' | 'laos' | 'indonesia';
  hubRoute?: string;
}

const LOCATIONS: SlowForestLocation[] = [
  // Operational
  { id: 'paksong', name: 'Paksong', country: 'Laos', type: 'operational', lat: 15.1881, lng: 106.2289, description: 'Bolaven Plateau — Slow Farm & Daycare Center', commodity: 'Coffee (Arabica & Robusta)', countryCode: 'laos', hubRoute: ROUTES.LAOS_HUB },
  { id: 'huonghoa', name: 'Hướng Hóa', country: 'Vietnam', type: 'operational', lat: 16.7556, lng: 106.6706, description: 'Quảng Trị province — Arabica coffee cooperatives', commodity: 'Coffee (Arabica)', countryCode: 'vietnam', hubRoute: ROUTES.VIETNAM_HUB },
  { id: 'bali', name: 'Bali', country: 'Indonesia', type: 'operational', lat: -8.3405, lng: 115.092, description: 'Slow Forest Indonesia — Cacao operations', commodity: 'Cacao', countryCode: 'indonesia', hubRoute: ROUTES.INDONESIA_HUB },
  { id: 'lampung', name: 'Lampung Barat', country: 'Indonesia', type: 'operational', lat: -5.0526, lng: 104.1653, description: 'West Lampung — Robusta coffee', commodity: 'Coffee (Robusta)', countryCode: 'indonesia', hubRoute: ROUTES.INDONESIA_HUB },
  // Partner / Network
  { id: 'singapore', name: 'Singapore', country: 'Singapore', type: 'partner', lat: 1.3521, lng: 103.8198, description: 'Trading & Business Development partner' },
  { id: 'kenya', name: 'Kenya', country: 'Kenya', type: 'partner', lat: -1.2921, lng: 36.8219, description: 'Coffee sourcing network partner' },
  { id: 'ethiopia', name: 'Ethiopia', country: 'Ethiopia', type: 'partner', lat: 9.025, lng: 38.7469, description: 'Coffee origin network partner' },
  { id: 'denmark', name: 'Denmark', country: 'Denmark', type: 'partner', lat: 55.6761, lng: 12.5683, description: 'European HQ & market access' },
];

const COUNTRY_CODE_MAP: Record<string, string> = {
  laos: 'LA',
  vietnam: 'VN',
  indonesia: 'ID',
};

/* ─── Component ─── */

export default function GlobalMapPage() {
  const { t } = useTranslation(['common', 'nav']);
  const navigate = useNavigate();

  // Custom Slow Forest logo marker
  const logoIcon = useMemo(() => new L.Icon({
    iconUrl: '/icons/icon-192x192.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    className: 'slow-logo',
  }), []);

  // Partner marker (slightly smaller, with blue tint border)
  const partnerIcon = useMemo(() => new L.Icon({
    iconUrl: '/icons/icon-192x192.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: 'slow-logo partner-marker',
  }), []);

  // Fetch live stats for operational countries
  const { data: countryStats } = useQuery({
    queryKey: ['map-country-stats'],
    queryFn: async () => {
      const countries = ['laos', 'vietnam', 'indonesia'];
      const stats: Record<string, { farmers: number; farms: number; cooperatives: number; plots: number }> = {};

      await Promise.all(countries.map(async (c) => {
        const code = COUNTRY_CODE_MAP[c];
        const [farmers, farms, coops, plots] = await Promise.all([
          pb.collection('farmers').getList(1, 1, { filter: `country = "${code}"` }).catch(() => ({ totalItems: 0 })),
          pb.collection('farms').getList(1, 1, { filter: `country = "${code}"` }).catch(() => ({ totalItems: 0 })),
          pb.collection('cooperatives').getList(1, 1, { filter: `country = "${c}"` }).catch(() => ({ totalItems: 0 })),
          pb.collection('eudr_plots').getList(1, 1, { filter: `country = "${c}"` }).catch(() => ({ totalItems: 0 })),
        ]);
        stats[c] = {
          farmers: farmers.totalItems,
          farms: farms.totalItems,
          cooperatives: coops.totalItems,
          plots: plots.totalItems,
        };
      }));

      return stats;
    },
    staleTime: 120_000,
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary-600" />
            {t('nav:map', 'Global Map')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Slow Forest Global Network</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-600 border-2 border-white shadow" />
            {t('common:operational', 'Operational')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow" />
            {t('common:partner_network', 'Partner / Network')}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
        <MapContainer
          center={[15, 60]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street Map">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={18}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {LOCATIONS.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={loc.type === 'operational' ? logoIcon : partnerIcon}
            >
              <Popup maxWidth={320} minWidth={220}>
                <div className="text-sm">
                  {/* Header */}
                  <div className="flex items-start gap-2 mb-2">
                    <img src="/icons/icon-192x192.png" alt="Slow Forest" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-bold text-gray-900 text-base">{loc.name}</div>
                      <div className="text-xs text-gray-500">{loc.country}</div>
                    </div>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      loc.type === 'operational'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {loc.type === 'operational' ? 'Operational' : 'Partner'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-2">{loc.description}</p>

                  {/* Commodity */}
                  {loc.commodity && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <TreePine className="h-3 w-3" />
                      <span className="font-medium">{loc.commodity}</span>
                    </div>
                  )}

                  {/* Live stats for operational locations */}
                  {loc.type === 'operational' && loc.countryCode && countryStats?.[loc.countryCode] && (
                    <div className="grid grid-cols-2 gap-1.5 mb-2 bg-gray-50 rounded-lg p-2">
                      <StatItem icon={Users} label={t('common:cooperatives_tab', 'Cooperatives')} value={countryStats[loc.countryCode].cooperatives} />
                      <StatItem icon={Users} label={t('common:farmers_tab', 'Farmers')} value={countryStats[loc.countryCode].farmers} />
                      <StatItem icon={Sprout} label={t('common:farms_tab', 'Farms')} value={countryStats[loc.countryCode].farms} />
                      <StatItem icon={MapPin} label="EUDR Plots" value={countryStats[loc.countryCode].plots} />
                    </div>
                  )}

                  {/* View Hub button for operational */}
                  {loc.type === 'operational' && loc.hubRoute && (
                    <button
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg py-1.5 transition-colors"
                      onClick={() => navigate(loc.hubRoute!)}
                    >
                      View Hub <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

/* ─── Stat item helper ─── */

function StatItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-gray-400" />
      <div>
        <div className="font-bold text-gray-800 text-xs">{value}</div>
        <div className="text-[10px] text-gray-500 leading-tight">{label}</div>
      </div>
    </div>
  );
}
