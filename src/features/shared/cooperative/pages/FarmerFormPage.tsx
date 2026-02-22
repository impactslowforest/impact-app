import { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateFarmer, useUpdateFarmer, useCooperativesList } from '../hooks/useCooperativeData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

const FARMER_FIELD_GROUPS: FieldGroup[] = [
  {
    title: 'Identity & Contact',
    fields: [
      { name: 'farmer_code', label: 'Farmer Code', type: 'text', required: true, readonlyOnEdit: true },
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: [
        { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' },
      ]},
      { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
      { name: 'id_card_number', label: 'ID Card Number', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'village', label: 'Village', type: 'text' },
      { name: 'commune', label: 'Commune', type: 'text' },
      { name: 'district', label: 'District', type: 'text' },
      { name: 'province', label: 'Province', type: 'text' },
      { name: 'address', label: 'Address', type: 'text', colSpan: 2 },
      { name: 'farmer_group_name', label: 'Farmer Group', type: 'text' },
      { name: 'ethnicity', label: 'Ethnicity', type: 'text' },
    ],
  },
  {
    title: 'Household & Demographics',
    fields: [
      { name: 'household_size', label: 'Household Size', type: 'number' },
      { name: 'household_type', label: 'Household Type', type: 'select', options: [
        { value: 'nuclear', label: 'Nuclear' }, { value: 'extended', label: 'Extended' }, { value: 'single', label: 'Single' },
      ]},
      { name: 'female_members', label: 'Female Members', type: 'number' },
      { name: 'income_earners', label: 'Income Earners', type: 'number' },
      { name: 'members_under_16', label: 'Members Under 16', type: 'number' },
      { name: 'residence_status', label: 'Residence Status', type: 'select', options: [
        { value: 'permanent', label: 'Permanent' }, { value: 'temporary', label: 'Temporary' }, { value: 'migrant', label: 'Migrant' },
      ]},
      { name: 'socioeconomic_status', label: 'Socioeconomic Status', type: 'select', options: [
        { value: 'poor', label: 'Poor' }, { value: 'near_poor', label: 'Near Poor' },
        { value: 'average', label: 'Average' }, { value: 'above_average', label: 'Above Average' },
      ]},
      { name: 'household_circumstances', label: 'Household Circumstances', type: 'text' },
      { name: 'education_level', label: 'Education Level', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' }, { value: 'high_school', label: 'High School' },
        { value: 'vocational', label: 'Vocational' }, { value: 'university', label: 'University' },
      ]},
    ],
  },
  {
    title: 'Coffee Area & Land',
    fields: [
      { name: 'farm_size_ha', label: 'Farm Size (ha)', type: 'number', step: '0.01' },
      { name: 'total_coffee_area_ha', label: 'Total Coffee Area (ha)', type: 'number', step: '0.01' },
      { name: 'number_of_plots', label: 'Number of Plots', type: 'number' },
      { name: 'mature_coffee_area_ha', label: 'Mature Coffee (ha)', type: 'number', step: '0.01' },
      { name: 'immature_coffee_area_ha', label: 'Immature Coffee (ha)', type: 'number', step: '0.01' },
      { name: 'organic_area_ha', label: 'Organic Area (ha)', type: 'number', step: '0.01' },
      { name: 'organic_conversion_date', label: 'Organic Conversion Date', type: 'date' },
      { name: 'land_certificate_status', label: 'Land Certificate Status', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'applied', label: 'Applied' },
        { value: 'received', label: 'Received' }, { value: 'red_book', label: 'Red Book' },
      ]},
      { name: 'type_of_area', label: 'Type of Area', type: 'text' },
    ],
  },
  {
    title: 'Certification & Compliance',
    fields: [
      { name: 'certification_status', label: 'Certification Status', type: 'select', options: [
        { value: 'none', label: 'None' }, { value: 'organic', label: 'Organic' },
        { value: 'transitional', label: 'Transitional' }, { value: 'fair_trade', label: 'Fair Trade' },
        { value: 'multiple', label: 'Multiple' },
      ]},
      { name: 'existing_certifications_detail', label: 'Certifications Detail', type: 'text' },
      { name: 'converted_after_dec2020', label: 'Converted After Dec 2020', type: 'boolean' },
      { name: 'deforestation_conversion_date', label: 'Deforestation Conversion Date', type: 'date' },
      { name: 'land_legal_origin_docs', label: 'Land Legal Origin Docs', type: 'text' },
      { name: 'forbidden_chemical_used', label: 'Forbidden Chemical Used', type: 'boolean' },
    ],
  },
  {
    title: 'Production & Financial',
    fields: [
      { name: 'avg_cherry_price', label: 'Avg Cherry Price', type: 'number', step: '0.01' },
      { name: 'total_cash_income', label: 'Total Cash Income', type: 'number', step: '0.01' },
      { name: 'production_cost', label: 'Production Cost', type: 'number', step: '0.01' },
      { name: 'other_income', label: 'Other Income', type: 'number', step: '0.01' },
      { name: 'income_sources', label: 'Income Sources', type: 'text' },
      { name: 'input_debt', label: 'Input Debt', type: 'number', step: '0.01' },
      { name: 'interest_rate_per_month', label: 'Interest Rate/Month (%)', type: 'number', step: '0.01' },
      { name: 'cherry_sales_committed_kg', label: 'Cherry Sales Committed (kg)', type: 'number', step: '0.01' },
      { name: 'cherry_sales_actual_kg', label: 'Cherry Sales Actual (kg)', type: 'number', step: '0.01' },
      { name: 'revenue_from_slow', label: 'Revenue From Slow', type: 'number', step: '0.01' },
      { name: 'processor_channel', label: 'Processor Channel', type: 'text' },
    ],
  },
  {
    title: 'Inputs & Inventory',
    fields: [
      { name: 'seed_source', label: 'Seed Source', type: 'text' },
      { name: 'seed_quantity_kg', label: 'Seed Quantity (kg)', type: 'number', step: '0.01' },
      { name: 'organic_fertilizer_kg', label: 'Organic Fertilizer (kg)', type: 'number', step: '0.01' },
      { name: 'chemical_fertilizer_kg', label: 'Chemical Fertilizer (kg)', type: 'number', step: '0.01' },
      { name: 'microbial_fertilizer_kg', label: 'Microbial Fertilizer (kg)', type: 'number', step: '0.01' },
      { name: 'biological_pesticide_kg', label: 'Biological Pesticide (kg)', type: 'number', step: '0.01' },
      { name: 'chemical_pesticide_kg', label: 'Chemical Pesticide (kg)', type: 'number', step: '0.01' },
      { name: 'shared_sprayer_used', label: 'Shared Sprayer Used', type: 'boolean' },
    ],
  },
  {
    title: 'Ecosystem & Biodiversity',
    fields: [
      { name: 'shade_tree_density_per_ha', label: 'Shade Tree Density/ha', type: 'number' },
      { name: 'shade_tree_species', label: 'Shade Tree Species', type: 'text' },
      { name: 'vegetation_cover_pct', label: 'Vegetation Cover (%)', type: 'number', step: '0.1' },
      { name: 'natural_forest_area_ha', label: 'Natural Forest (ha)', type: 'number', step: '0.01' },
      { name: 'soil_conservation', label: 'Soil Conservation', type: 'text' },
      { name: 'water_conservation', label: 'Water Conservation', type: 'text' },
      { name: 'waste_management', label: 'Waste Management', type: 'text' },
      { name: 'poultry_count', label: 'Poultry Count', type: 'number' },
      { name: 'pig_count', label: 'Pig Count', type: 'number' },
      { name: 'cattle_count', label: 'Cattle Count', type: 'number' },
      { name: 'buffalo_count', label: 'Buffalo Count', type: 'number' },
    ],
  },
  {
    title: 'Project Support',
    fields: [
      { name: 'supported_by', label: 'Supported By', type: 'text' },
      { name: 'farm_registered_for_support', label: 'Farm Registered for Support', type: 'boolean' },
      { name: 'training_attendance', label: 'Training Attendance', type: 'text' },
      { name: 'op6_activities', label: 'OP6 Activities', type: 'text' },
    ],
  },
  {
    title: 'Location & GPS',
    fields: [
      { name: 'latitude', label: 'Latitude', type: 'number', step: 'any' },
      { name: 'longitude', label: 'Longitude', type: 'number', step: 'any' },
      { name: 'distance_to_home_km', label: 'Distance to Home (km)', type: 'number', step: '0.1' },
      { name: 'observation_stations', label: 'Observation Stations', type: 'text' },
    ],
  },
  {
    title: 'System',
    fields: [
      { name: 'registration_date', label: 'Registration Date', type: 'date' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
      { name: 'qr_code', label: 'QR Code', type: 'text' },
    ],
  },
];

const JSON_FIELDS = [
  'fertilizer_data', 'pesticide_data', 'biodiversity_data', 'energy_data',
  'child_labor_data', 'financial_data', 'family_data', 'eudr_compliance_data', 'herbicide_data',
];

// ── Page Component ──

export default function FarmerFormPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const country = searchParams.get('country') || '';
  const id = searchParams.get('id') || '';
  const isEditing = !!id;
  const today = new Date().toISOString().slice(0, 10);

  const createFarmer = useCreateFarmer();
  const updateFarmer = useUpdateFarmer();
  const { data: cooperatives } = useCooperativesList(country);

  // Fetch existing record in edit mode
  const { data: existingRecord, isLoading: isLoadingRecord } = useQuery({
    queryKey: ['farmer', id],
    queryFn: () => pb.collection('farmers').getOne(id),
    enabled: !!id,
  });

  const editingItem = isEditing ? (existingRecord as Record<string, unknown> | undefined) : undefined;

  // ── Value helpers ──

  const val = (field: string): string | number => {
    if (!isEditing || !editingItem) {
      if (field === 'registration_date') return today;
      return '';
    }
    return (editingItem[field] as string | number) ?? '';
  };

  const boolVal = (field: string): boolean => {
    if (!isEditing || !editingItem) return field === 'is_active';
    return !!(editingItem[field]);
  };

  const jsonVal = (field: string): string => {
    if (!isEditing || !editingItem) return '';
    const v = editingItem[field];
    if (!v || typeof v !== 'object') return '';
    return JSON.stringify(v, null, 2);
  };

  // ── Submit handler ──

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    form.forEach((val, key) => { data[key] = val; });

    for (const group of FARMER_FIELD_GROUPS) {
      for (const f of group.fields) {
        if (f.type === 'number' && data[f.name] !== undefined) {
          data[f.name] = data[f.name] === '' ? null : Number(data[f.name]);
        }
        if (f.type === 'boolean') {
          data[f.name] = form.has(f.name);
        }
      }
    }

    for (const jf of JSON_FIELDS) {
      const raw = form.get(`__json_${jf}`) as string;
      if (raw) {
        try { data[jf] = JSON.parse(raw); } catch { data[jf] = {}; }
      }
      delete data[`__json_${jf}`];
    }

    if (data.cooperative === '__none__') data.cooperative = '';
    data.country = country;

    const currentUser = pb.authStore.record;
    if (!isEditing) {
      data.registered_by = currentUser?.id || user?.id || '';
    }

    if (isEditing && editingItem) {
      updateFarmer.mutate(
        { id: editingItem.id as string, data },
        {
          onSuccess: () => {
            toast.success(t('saved'));
            navigate(-1);
          },
        },
      );
    } else {
      createFarmer.mutate(data, {
        onSuccess: () => {
          toast.success(t('saved'));
          navigate(-1);
        },
      });
    }
  };

  // ── Loading state ──

  if (isEditing && isLoadingRecord) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Breadcrumb label ──

  const countryLabel = country ? country.charAt(0).toUpperCase() + country.slice(1) : 'Unknown';
  const pageTitle = isEditing
    ? `${t('edit_farmer', 'Edit Farmer')}`
    : `${t('add_farmer', 'Add Farmer')}`;

  // ── Render ──

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {countryLabel} &gt; Cooperative &gt; {pageTitle}
          </p>
        </div>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Cooperative selector (Laos only) */}
        {country === 'laos' && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">{t('cooperative')}</Label>
            <Select
              name="cooperative"
              defaultValue={(editingItem?.cooperative as string) || '__none__'}
            >
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder={t('select_cooperative')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">{t('none')}</SelectItem>
                {cooperatives?.map((coop) => (
                  <SelectItem key={coop.id} value={coop.id}>
                    {coop.name} ({coop.coop_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Field groups */}
        {FARMER_FIELD_GROUPS.map((group) => (
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
                        id={`farmer-${field.name}`}
                        name={field.name}
                        defaultChecked={boolVal(field.name)}
                        className="h-4 w-4 rounded border-gray-300"
                        disabled={isReadonly}
                      />
                      <Label htmlFor={`farmer-${field.name}`} className="text-xs cursor-pointer">{field.label}</Label>
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
                  {jf.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
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
          <p><strong>Data entry by:</strong> {pb.authStore.record?.name || pb.authStore.record?.email || user?.name || '---'}</p>
          <p><strong>Date:</strong> {today}</p>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full btn-3d-primary text-white rounded-lg"
          disabled={createFarmer.isPending || updateFarmer.isPending}
        >
          {(createFarmer.isPending || updateFarmer.isPending) ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isEditing ? t('save_changes', 'Save Changes') : t('add_farmer', 'Add Farmer')}
        </Button>
      </form>
    </div>
  );
}
