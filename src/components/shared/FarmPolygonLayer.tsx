import { useEffect, useState, useCallback, useMemo } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

interface FarmProperties {
  farm_id: string;
  farmer_id: string;
  farmer_name: string;
  farm_name: string;
  area_ha: number;
  species: string;
  village: string;
  district: string;
  province: string;
  country: string;
  certificate: string;
  source: string;
}

type GeoJSONData = GeoJSON.FeatureCollection<GeoJSON.Geometry, FarmProperties>;

// Red-brick border, no fill
const polygonStyle: L.PathOptions = {
  color: '#B74C3A',       // đỏ gạch (red-brick)
  weight: 1.5,
  opacity: 0.9,
  fillColor: 'transparent',
  fillOpacity: 0,
};

interface FarmPolygonLayerProps {
  country?: 'all' | 'laos' | 'indonesia' | 'vietnam';
}

/**
 * Toggleable farm polygon overlay layer.
 * Loads /data/farm-polygons.geojson and renders polygons
 * filtered by country, with red-brick border, no fill, and 3-line labels.
 */
export default function FarmPolygonLayer({ country = 'all' }: FarmPolygonLayerProps) {
  const [data, setData] = useState<GeoJSONData | null>(null);
  const [labelZoom, setLabelZoom] = useState(false);
  const map = useMap();

  // Filter features by country
  const filteredData = useMemo(() => {
    if (!data) return null;
    if (country === 'all') return data;
    return {
      ...data,
      features: data.features.filter(f => f.properties.country === country),
    };
  }, [data, country]);

  // Load GEOJSON
  useEffect(() => {
    fetch('/data/farm-polygons.geojson')
      .then((r) => r.json())
      .then((json: GeoJSONData) => setData(json))
      .catch(console.error);
  }, []);

  // Track zoom for label visibility
  useEffect(() => {
    const onZoom = () => {
      setLabelZoom(map.getZoom() >= 15);
    };
    map.on('zoomend', onZoom);
    onZoom();
    return () => { map.off('zoomend', onZoom); };
  }, [map]);

  // Bind tooltip to each feature
  const onEachFeature = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Geometry, FarmProperties>, layer: L.Layer) => {
      const p = feature.properties;
      const farmLabel = p.farm_id || p.farm_name || '—';
      const farmerLabel = p.farmer_name || '—';
      const speciesArea = [p.species, p.area_ha ? `${p.area_ha} ha` : ''].filter(Boolean).join(' · ') || '—';

      // Permanent label (3 lines) — shown at high zoom
      const tooltipContent = `<div class="farm-label">
        <div class="farm-label-id">${farmLabel}</div>
        <div class="farm-label-farmer">${farmerLabel}</div>
        <div class="farm-label-species">${speciesArea}</div>
      </div>`;

      (layer as L.Path).bindTooltip(tooltipContent, {
        permanent: labelZoom,
        direction: 'center',
        className: 'farm-tooltip',
      });

      // Click popup with full details + navigation buttons
      const popupContent = `<div class="text-xs space-y-1">
        <div class="font-bold text-sm">${farmLabel}</div>
        <div><b>Farmer:</b> ${farmerLabel}</div>
        ${p.farm_name ? `<div><b>Farm:</b> ${p.farm_name}</div>` : ''}
        <div><b>Species:</b> ${p.species || '—'}</div>
        <div><b>Area:</b> ${p.area_ha ? p.area_ha + ' ha' : '—'}</div>
        ${p.village ? `<div><b>Village:</b> ${p.village}</div>` : ''}
        ${p.district ? `<div><b>District:</b> ${p.district}</div>` : ''}
        ${p.province ? `<div><b>Province:</b> ${p.province}</div>` : ''}
        <div><b>Certificate:</b> ${p.certificate || '—'}</div>
        <div class="text-[10px] text-gray-400 pt-1">${p.country.toUpperCase()} · ${p.source}</div>
        <div style="display:flex;gap:4px;padding-top:6px;border-top:1px solid #e5e7eb;margin-top:6px">
          ${p.farmer_id ? `<button data-farmer-code="${p.farmer_id}" class="farm-nav-btn" style="flex:1;padding:4px 8px;font-size:11px;font-weight:600;color:#fff;background:#16a34a;border:none;border-radius:6px;cursor:pointer">👤 Farmer</button>` : ''}
          <button data-farm-code="${p.farm_id}" class="farm-nav-btn" style="flex:1;padding:4px 8px;font-size:11px;font-weight:600;color:#fff;background:#2563eb;border:none;border-radius:6px;cursor:pointer">🌿 Farm</button>
        </div>
      </div>`;
      (layer as L.Path).bindPopup(popupContent, { maxWidth: 280 });
    },
    [labelZoom],
  );

  if (!filteredData || filteredData.features.length === 0) return null;

  return (
    <GeoJSON
      key={`${country}-${labelZoom ? 'on' : 'off'}`}
      data={filteredData}
      style={polygonStyle}
      onEachFeature={onEachFeature}
    />
  );
}
