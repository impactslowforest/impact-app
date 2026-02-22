import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCreateFarm, useUpdateFarm, useFarmersList,
} from '../hooks/useCooperativeData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { COUNTRIES } from '@/config/constants';

// ── Field definitions ──

interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'json';
  options?: { value: string; label: string }[];
  required?: boolean;
  readonlyOnEdit?: boolean;
  step?: string;
  colSpan?: number;
}

interface FieldGroup {
  title: string;
  fields: FieldDef[];
}

const FARM_FIELD_GROUPS: FieldGroup[] = [
  {
    title: 'Identity & Location',
    fields: [
      { name: 'farm_code', label: 'Farm Code', type: 'text', required: true, readonlyOnEdit: true },
      { name: 'farm_name', label: 'Farm Name', type: 'text', required: true },
      { name: 'village', label: 'Village', type: 'text' },
      { name: 'district', label: 'District', type: 'text' },
      { name: 'province', label: 'Province', type: 'text' },
      { name: 'latitude', label: 'Latitude', type: 'number', step: 'any' },
      { name: 'longitude', label: 'Longitude', type: 'number', step: 'any' },
      { name: 'elevation_m', label: 'Elevation (m)', type: 'number' },
      { name: 'map_sheet', label: 'Map Sheet', type: 'text' },
      { name: 'polygon_geojson', label: 'Polygon GeoJSON', type: 'text', colSpan: 2 },
    ],
  },
  {
    title: 'Land & Production',
    fields: [
      { name: 'area_ha', label: 'Area (ha)', type: 'number', step: '0.01' },
      { name: 'commodity', label: 'Commodity', type: 'select', options: [
        { value: 'coffee', label: 'Coffee' }, { value: 'cacao', label: 'Cacao' }, { value: 'other', label: 'Other' },
      ]},
      { name: 'production_system', label: 'Production System', type: 'select', options: [
        { value: 'monoculture', label: 'Monoculture' }, { value: 'intercropping', label: 'Intercropping' },
        { value: 'agroforestry', label: 'Agroforestry' }, { value: 'mixed', label: 'Mixed' },
      ]},
      { name: 'land_tenure_status', label: 'Land Tenure', type: 'select', options: [
        { value: 'owned', label: 'Owned' }, { value: 'leased', label: 'Leased' },
        { value: 'communal', label: 'Communal' }, { value: 'disputed', label: 'Disputed' },
      ]},
      { name: 'management_type', label: 'Management Type', type: 'select', options: [
        { value: 'household', label: 'Household' }, { value: 'group', label: 'Group' }, { value: 'company', label: 'Company' },
      ]},
      { name: 'main_crop_species', label: 'Main Crop Species', type: 'text' },
      { name: 'planting_year', label: 'Planting Year', type: 'number' },
      { name: 'entry_date', label: 'Entry Date', type: 'date' },
      { name: 'mature_area_ha', label: 'Mature Area (ha)', type: 'number', step: '0.01' },
      { name: 'immature_area_ha', label: 'Immature Area (ha)', type: 'number', step: '0.01' },
      { name: 'organic_area_ha', label: 'Organic Area (ha)', type: 'number', step: '0.01' },
      { name: 'organic_conversion_date', label: 'Organic Conversion Date', type: 'date' },
      { name: 'registered_agroforestry', label: 'Registered Agroforestry', type: 'text' },
      { name: 'slope', label: 'Slope', type: 'text' },
    ],
  },
  {
    title: 'Trees & Shade',
    fields: [
      { name: 'coffee_trees_count', label: 'Coffee Trees', type: 'number' },
      { name: 'shade_trees_count', label: 'Shade Trees', type: 'number' },
      { name: 'shade_trees_before', label: 'Shade Trees Before', type: 'number' },
      { name: 'shade_trees_past', label: 'Shade Trees Past', type: 'number' },
      { name: 'pffp_shade_trees', label: 'PFFP Shade Trees', type: 'number' },
      { name: 'surviving_pffp_trees', label: 'Surviving PFFP Trees', type: 'number' },
      { name: 'number_of_species', label: 'Number of Species', type: 'number' },
      { name: 'shade_level_pct', label: 'Shade Level (%)', type: 'number', step: '0.1' },
      { name: 'plant_density_spacing', label: 'Plant Density/Spacing', type: 'text' },
      { name: 'intercropped_species', label: 'Intercropped Species', type: 'text' },
    ],
  },
  {
    title: 'Certification & Compliance',
    fields: [
      { name: 'certification_status', label: 'Certification Status', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'organic', label: 'Organic' },
        { value: 'transitional', label: 'Transitional' }, { value: 'conventional', label: 'Conventional' },
      ]},
      { name: 'tree_health_status', label: 'Tree Health', type: 'select', options: [
        { value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' }, { value: 'poor', label: 'Poor' },
      ]},
      { name: 'eudr_status', label: 'EUDR Status', type: 'text' },
      { name: 'forbidden_chem_use', label: 'Forbidden Chemical Use', type: 'boolean' },
      { name: 'contamination_risk_level', label: 'Contamination Risk', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'low', label: 'Low' },
        { value: 'moderate', label: 'Moderate' }, { value: 'high', label: 'High' },
      ]},
      { name: 'non_conformity_history', label: 'Non-Conformity History', type: 'text', colSpan: 2 },
      { name: 'correction_status', label: 'Correction Status', type: 'text' },
      { name: 'corrective_action', label: 'Corrective Action', type: 'text' },
    ],
  },
  {
    title: 'Yield & Harvest',
    fields: [
      { name: 'forecast_yield_arabica_kg', label: 'Forecast Arabica (kg)', type: 'number', step: '0.01' },
      { name: 'forecast_yield_robusta_kg', label: 'Forecast Robusta (kg)', type: 'number', step: '0.01' },
      { name: 'annual_cherry_yield_kg', label: 'Annual Cherry Yield (kg)', type: 'number', step: '0.01' },
      { name: 'volume_to_slow_kg', label: 'Volume to Slow (kg)', type: 'number', step: '0.01' },
    ],
  },
  {
    title: 'Inputs & Disease Management',
    fields: [
      { name: 'fertilizer_mix', label: 'Fertilizer Mix', type: 'text' },
      { name: 'fertilizer_source', label: 'Fertilizer Source', type: 'text' },
      { name: 'fertilizer_apply_date', label: 'Fertilizer Apply Date', type: 'date' },
      { name: 'seedling_quality_note', label: 'Seedling Quality Note', type: 'text' },
      { name: 'replanting_date', label: 'Replanting Date', type: 'date' },
      { name: 'has_disease', label: 'Has Disease', type: 'boolean' },
      { name: 'disease_type', label: 'Disease Type', type: 'text' },
      { name: 'pest_management_method', label: 'Pest Management', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'manual', label: 'Manual' },
        { value: 'biological', label: 'Biological' }, { value: 'herbal', label: 'Herbal' }, { value: 'chemical', label: 'Chemical' },
      ]},
      { name: 'treatment_method', label: 'Treatment Method', type: 'text' },
      { name: 'herbal_agent_used', label: 'Herbal Agent Used', type: 'text' },
      { name: 'banned_chem_name', label: 'Banned Chemical Name', type: 'text' },
      { name: 'shared_sprayer_use', label: 'Shared Sprayer Use', type: 'boolean' },
      { name: 'sprayer_cleaning_log', label: 'Sprayer Cleaning Log', type: 'text', colSpan: 2 },
    ],
  },
  {
    title: 'Environment & Risk',
    fields: [
      { name: 'soil_type', label: 'Soil Type', type: 'text' },
      { name: 'border_natural_forest', label: 'Border Natural Forest', type: 'boolean' },
      { name: 'buffer_zone_details', label: 'Buffer Zone Details', type: 'text' },
      { name: 'water_pollution_risk', label: 'Water Pollution Risk', type: 'text' },
      { name: 'air_pollution_risk', label: 'Air Pollution Risk', type: 'text' },
      { name: 'protection_method', label: 'Protection Method', type: 'text' },
      { name: 'dist_to_chemical_farm_km', label: 'Dist to Chemical Farm (km)', type: 'number', step: '0.1' },
      { name: 'high_risk_detail', label: 'High Risk Detail', type: 'text' },
      { name: 'past_issue_desc', label: 'Past Issue Description', type: 'text', colSpan: 2 },
      { name: 'farm_tools_inventory', label: 'Farm Tools Inventory', type: 'text', colSpan: 2 },
    ],
  },
  {
    title: 'Distance & Access',
    fields: [
      { name: 'distance_to_drymill_km', label: 'Distance to Drymill (km)', type: 'number', step: '0.1' },
      { name: 'distance_to_office_km', label: 'Distance to Office (km)', type: 'number', step: '0.1' },
    ],
  },
  {
    title: 'Land Certificates (Indo)',
    fields: [
      { name: 'land_certificate', label: 'Land Certificate', type: 'text' },
      { name: 'land_ownership_certificate', label: 'Land Ownership Certificate', type: 'text' },
    ],
  },
  {
    title: 'System',
    fields: [
      { name: 'is_active', label: 'Active', type: 'boolean' },
      { name: 'qr_code', label: 'QR Code', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'text', colSpan: 2 },
    ],
  },
];

const JSON_FIELDS = [
  'species_data', 'tree_index_data',
  'agroforestry_fertilizer_data', 'chemical_fertilizer_data',
  'compost_data', 'pesticide_detail_data', 'ra_compliance_data',
];

// ── Page component ──

export default function FarmFormPage() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const country = searchParams.get('country') || '';
  const id = searchParams.get('id') || '';
  const farmerParam = searchParams.get('farmer') || '';

  const isEditing = !!id;
  const today = new Date().toISOString().slice(0, 10);

  const countryLabel =
    COUNTRIES.find((c) => c.code === country)?.name || country;

  // Fetch existing record for edit mode
  const { data: existingRecord, isLoading: isLoadingRecord } = useQuery({
    queryKey: ['farm', id],
    queryFn: () => pb.collection('farms').getOne(id!),
    enabled: !!id,
  });

  // Farmer list for dropdown
  const { data: farmers } = useFarmersList(country);

  // Mutations
  const createMutation = useCreateFarm();
  const updateMutation = useUpdateFarm();

  // Reset form when record loads
  useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [existingRecord]);

  // ── Value helpers ──

  const val = (field: string): string | number => {
    if (!isEditing || !existingRecord) {
      if (field === 'entry_date') return today;
      return '';
    }
    return (existingRecord[field] as string | number) ?? '';
  };

  const boolVal = (field: string): boolean => {
    if (!isEditing || !existingRecord) return field === 'is_active';
    return !!(existingRecord[field]);
  };

  const jsonVal = (field: string): string => {
    if (!isEditing || !existingRecord) return '';
    const v = existingRecord[field];
    if (!v || typeof v !== 'object') return '';
    return JSON.stringify(v, null, 2);
  };

  // ── Submit handler ──

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    form.forEach((val, key) => { data[key] = val; });

    // Parse typed fields
    for (const group of FARM_FIELD_GROUPS) {
      for (const f of group.fields) {
        if (f.type === 'number' && data[f.name] !== undefined) {
          data[f.name] = data[f.name] === '' ? null : Number(data[f.name]);
        }
        if (f.type === 'boolean') {
          data[f.name] = form.has(f.name);
        }
      }
    }

    // Parse JSON fields
    for (const jf of JSON_FIELDS) {
      const raw = form.get(`__json_${jf}`) as string;
      if (raw) {
        try { data[jf] = JSON.parse(raw); } catch { data[jf] = {}; }
      }
      delete data[`__json_${jf}`];
    }

    data.country = country;

    if (isEditing) {
      updateMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            toast.success(t('saved', 'Farm saved successfully'));
            navigate(-1);
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(t('saved', 'Farm created successfully'));
          navigate(-1);
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ── Loading state for edit mode ──

  if (isEditing && isLoadingRecord) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // ── Render ──

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Farm' : 'Add New Farm'}</h1>
          <p className="text-sm text-muted-foreground">
            {countryLabel} &gt; Cooperative &gt; {isEditing ? 'Edit' : 'Add'} Farm
          </p>
        </div>
      </div>

      {/* White card form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Farmer selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">{t('farmer', 'Farmer')} *</Label>
            <select
              name="farmer"
              required
              defaultValue={
                (isEditing && existingRecord?.farmer as string)
                || farmerParam
                || ''
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="">{t('select_farmer', 'Select farmer')}</option>
              {farmers?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.full_name} ({f.farmer_code})
                </option>
              ))}
            </select>
          </div>

          {/* Data-driven field groups */}
          {FARM_FIELD_GROUPS.map((group) => (
            <fieldset key={group.title} className="space-y-3">
              <legend className="text-sm font-semibold text-primary-800 border-b border-primary-100 pb-1 mb-2 w-full">
                {group.title}
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.fields.map((field) => {
                  const isReadonly = isEditing && field.readonlyOnEdit;
                  const span = field.colSpan === 2 ? 'sm:col-span-2' : '';

                  if (field.type === 'boolean') {
                    return (
                      <div key={field.name} className={`flex items-center gap-2 ${span}`}>
                        <input
                          type="checkbox"
                          id={`farm-${field.name}`}
                          name={field.name}
                          defaultChecked={boolVal(field.name)}
                          className="h-4 w-4 rounded border-gray-300"
                          disabled={isReadonly}
                        />
                        <Label htmlFor={`farm-${field.name}`} className="text-xs cursor-pointer">
                          {field.label}
                        </Label>
                      </div>
                    );
                  }

                  if (field.type === 'select' && field.options) {
                    return (
                      <div key={field.name} className={`space-y-1.5 ${span}`}>
                        <Label className="text-xs font-medium text-gray-700">
                          {field.label}{field.required ? ' *' : ''}
                        </Label>
                        <select
                          name={field.name}
                          defaultValue={String(val(field.name) || field.options[0]?.value || '')}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
                          disabled={isReadonly}
                          required={field.required}
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  return (
                    <div key={field.name} className={`space-y-1.5 ${span}`}>
                      <Label className="text-xs font-medium text-gray-700">
                        {field.label}{field.required ? ' *' : ''}
                      </Label>
                      <Input
                        name={field.name}
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                        step={field.step}
                        min={field.type === 'number' ? 0 : undefined}
                        required={field.required}
                        defaultValue={val(field.name)}
                        readOnly={isReadonly}
                        tabIndex={isReadonly ? -1 : undefined}
                        className={`rounded-lg text-sm ${isReadonly ? 'bg-gray-50 text-gray-500' : ''}`}
                      />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {/* JSON fields */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-primary-800 border-b border-primary-100 pb-1 mb-2 w-full">
              Advanced Data (JSON)
            </legend>
            <div className="grid grid-cols-1 gap-3">
              {JSON_FIELDS.map((jf) => (
                <div key={jf} className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-700">
                    {jf.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Label>
                  <textarea
                    name={`__json_${jf}`}
                    defaultValue={jsonVal(jf)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono resize-y"
                    placeholder="{}"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* Data entry info */}
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
            <p>
              <strong>Data entry by:</strong>{' '}
              {pb.authStore.record?.name || pb.authStore.record?.email || user?.name || '--'}
            </p>
            <p>
              <strong>Date:</strong> {today}
            </p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full btn-3d-primary text-white rounded-lg"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? t('save_changes', 'Save Changes') : t('add_farm', 'Add Farm')}
          </Button>
        </form>
      </div>
    </div>
  );
}
