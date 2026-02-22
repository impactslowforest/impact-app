import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCreateHarvest, useUpdateHarvest,
} from '../hooks/useCooperativeData';

interface HarvestFormDialogProps {
  country: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: Record<string, unknown> | null;
  preselectedFarm?: string;
  preselectedFarmer?: string;
}

export function HarvestFormDialog({
  country,
  open,
  onOpenChange,
  editingItem,
  preselectedFarm,
  preselectedFarmer,
}: HarvestFormDialogProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const createMutation = useCreateHarvest();
  const updateMutation = useUpdateHarvest();

  // Simple farms list for the country
  const { data: farms } = useQuery({
    queryKey: ['farms-list', country],
    queryFn: () => pb.collection('farms').getFullList({
      filter: `country = "${country}"`,
      sort: 'farm_name',
      fields: 'id,farm_name,farm_code,farmer',
    }),
  });

  const isEditing = !!editingItem;

  // Reset form when dialog opens / editingItem changes
  useEffect(() => {
    if (open && formRef.current) {
      formRef.current.reset();
    }
  }, [open, editingItem]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    form.forEach((val, key) => { data[key] = val; });

    // Parse numeric fields
    if (data.quantity_kg) data.quantity_kg = parseFloat(data.quantity_kg as string) || 0;
    if (data.moisture_pct) data.moisture_pct = parseFloat(data.moisture_pct as string) || 0;
    if (data.price_per_kg) data.price_per_kg = parseFloat(data.price_per_kg as string) || 0;

    // Set farmer from farm relationship or preselected
    const selectedFarmId = data.farm as string;
    if (!data.farmer || !(data.farmer as string)) {
      const selectedFarm = farms?.find(f => f.id === selectedFarmId);
      data.farmer = selectedFarm?.farmer || preselectedFarmer || '';
    }

    // Always set country and recorded_by
    data.country = country;
    if (!isEditing) {
      data.recorded_by = user?.id;
    }

    if (isEditing) {
      updateMutation.mutate(
        { id: editingItem.id as string, data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('edit_harvest') : t('add_harvest')}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden farmer field */}
          <input
            type="hidden"
            name="farmer"
            defaultValue={(editingItem?.farmer as string) ?? preselectedFarmer ?? ''}
          />

          {/* Farm & Date */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-primary-700 px-4 py-2">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('harvest_info', 'Harvest Info')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('farm')} *</span>
                <select name="farm" required defaultValue={(editingItem?.farm as string) ?? preselectedFarm ?? ''}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none">
                  <option value="">{t('select_farm')}</option>
                  {farms?.map((f) => (
                    <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('harvest_date')} *</span>
                <Input name="harvest_date" type="date" required defaultValue={(editingItem?.harvest_date as string)?.split('T')[0] ?? ''}
                  className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('crop_type')}</span>
                <select name="crop_type" defaultValue={(editingItem?.crop_type as string) ?? 'coffee_cherry'}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none">
                  <option value="coffee_cherry">{t('coffee_cherry')}</option>
                  <option value="coffee_parchment">{t('coffee_parchment')}</option>
                  <option value="cacao_wet">{t('cacao_wet')}</option>
                  <option value="cacao_dry">{t('cacao_dry')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('variety')}</span>
                <Input name="variety" defaultValue={(editingItem?.variety as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('season')}</span>
                <Input name="season" defaultValue={(editingItem?.season as string) ?? ''} placeholder="e.g. 2024/2025" className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('lot_number')}</span>
                <Input name="lot_number" defaultValue={(editingItem?.lot_number as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
            </div>
          </div>

          {/* Quantity & Quality */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-primary-700 px-4 py-2">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('quantity_quality', 'Quantity & Quality')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('quantity_kg')}</span>
                <Input name="quantity_kg" type="number" step="0.1" defaultValue={(editingItem?.quantity_kg as number) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('moisture_pct')}</span>
                <Input name="moisture_pct" type="number" step="0.1" defaultValue={(editingItem?.moisture_pct as number) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('quality_grade')}</span>
                <select name="quality_grade" defaultValue={(editingItem?.quality_grade as string) ?? 'A'}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="reject">{t('reject')}</option>
                </select>
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('processing_method')}</span>
                <select name="processing_method" defaultValue={(editingItem?.processing_method as string) ?? 'washed'}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none">
                  <option value="wet">{t('wet')}</option>
                  <option value="dry">{t('dry')}</option>
                  <option value="honey">{t('honey')}</option>
                  <option value="natural">{t('natural')}</option>
                  <option value="washed">{t('washed')}</option>
                  <option value="semi_washed">{t('semi_washed')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price & Sale */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-primary-700 px-4 py-2">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('price_sale', 'Price & Sale')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('price_per_kg')}</span>
                <Input name="price_per_kg" type="number" step="0.01" defaultValue={(editingItem?.price_per_kg as number) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('currency')}</span>
                <Input name="currency" defaultValue={(editingItem?.currency as string) ?? 'USD'} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('buyer')}</span>
                <Input name="buyer" defaultValue={(editingItem?.buyer as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('notes')}</span>
                <Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full btn-3d-primary text-white rounded-lg"
            disabled={isPending}
          >
            {isEditing ? t('save_changes') : t('add_harvest')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
