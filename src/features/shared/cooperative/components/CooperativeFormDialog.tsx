import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateCooperative, useUpdateCooperative } from '../hooks/useCooperativeData';

interface CooperativeFormDialogProps {
  country: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: Record<string, unknown> | null;
}

export function CooperativeFormDialog({
  country,
  open,
  onOpenChange,
  editingItem,
}: CooperativeFormDialogProps) {
  const { t } = useTranslation('common');
  const formRef = useRef<HTMLFormElement>(null);
  const createMutation = useCreateCooperative();
  const updateMutation = useUpdateCooperative();

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
    if (data.member_count) data.member_count = parseInt(data.member_count as string, 10) || 0;
    if (data.latitude) data.latitude = parseFloat(data.latitude as string);
    if (data.longitude) data.longitude = parseFloat(data.longitude as string);

    // Handle checkbox (unchecked = not in FormData)
    data.is_active = form.has('is_active');

    // Always set country
    data.country = country;

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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('edit_cooperative') : t('add_cooperative')}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Identity */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-primary-700 px-4 py-2">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('identity', 'Identity')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('coop_code')} *</span>
                <Input name="coop_code" required defaultValue={(editingItem?.coop_code as string) ?? ''} placeholder="e.g. COOP-001" className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('name')} *</span>
                <Input name="name" required defaultValue={(editingItem?.name as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('leader_name')}</span>
                <Input name="leader_name" defaultValue={(editingItem?.leader_name as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('leader_phone')}</span>
                <Input name="leader_phone" defaultValue={(editingItem?.leader_phone as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('member_count')}</span>
                <Input name="member_count" type="number" defaultValue={(editingItem?.member_count as number) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-primary-700 px-4 py-2">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('location', 'Location')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('province')}</span>
                <Input name="province" defaultValue={(editingItem?.province as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('district')}</span>
                <Input name="district" defaultValue={(editingItem?.district as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('village')}</span>
                <Input name="village" defaultValue={(editingItem?.village as string) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('latitude')}</span>
                <Input name="latitude" type="number" step="any" defaultValue={(editingItem?.latitude as number) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('longitude')}</span>
                <Input name="longitude" type="number" step="any" defaultValue={(editingItem?.longitude as number) ?? ''} className="flex-1 rounded-lg bg-white" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-primary-700 px-4 py-2">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{t('details', 'Details')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('commodity')}</span>
                <select name="commodity" defaultValue={(editingItem?.commodity as string) ?? 'coffee'}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none">
                  <option value="coffee">{t('coffee')}</option>
                  <option value="cacao">{t('cacao')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('certification_status')}</span>
                <select name="certification_status" defaultValue={(editingItem?.certification_status as string) ?? 'none'}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none">
                  <option value="none">{t('none')}</option>
                  <option value="organic">{t('organic')}</option>
                  <option value="fair_trade">{t('fair_trade')}</option>
                  <option value="rainforest">{t('rainforest')}</option>
                  <option value="multiple">{t('multiple')}</option>
                </select>
              </div>
              <div className="flex items-start gap-4 px-4 py-3 bg-white">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0 pt-2">{t('notes')}</span>
                <textarea name="notes" defaultValue={(editingItem?.notes as string) ?? ''} rows={3}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none" />
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50">
                <span className="text-[13px] font-medium text-primary-700 w-2/5 shrink-0">{t('is_active')}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="is_active" name="is_active" defaultChecked={editingItem ? !!(editingItem.is_active) : true}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm text-gray-600">{editingItem?.is_active !== false ? 'Yes' : 'No'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full btn-3d-primary text-white rounded-lg"
            disabled={isPending}
          >
            {isEditing ? t('save_changes') : t('add_cooperative')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
