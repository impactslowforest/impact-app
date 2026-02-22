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
          {/* Coop Code + Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('coop_code')} *</Label>
              <Input
                name="coop_code"
                required
                defaultValue={(editingItem?.coop_code as string) ?? ''}
                placeholder="e.g. COOP-001"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('name')} *</Label>
              <Input
                name="name"
                required
                defaultValue={(editingItem?.name as string) ?? ''}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Leader Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('leader_name')}</Label>
              <Input
                name="leader_name"
                defaultValue={(editingItem?.leader_name as string) ?? ''}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('leader_phone')}</Label>
              <Input
                name="leader_phone"
                defaultValue={(editingItem?.leader_phone as string) ?? ''}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Member Count */}
          <div className="space-y-1.5">
            <Label>{t('member_count')}</Label>
            <Input
              name="member_count"
              type="number"
              defaultValue={(editingItem?.member_count as number) ?? ''}
              className="rounded-lg"
            />
          </div>

          {/* Province, District, Village */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>{t('province')}</Label>
              <Input
                name="province"
                defaultValue={(editingItem?.province as string) ?? ''}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('district')}</Label>
              <Input
                name="district"
                defaultValue={(editingItem?.district as string) ?? ''}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('village')}</Label>
              <Input
                name="village"
                defaultValue={(editingItem?.village as string) ?? ''}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Commodity + Certification Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('commodity')}</Label>
              <select
                name="commodity"
                defaultValue={(editingItem?.commodity as string) ?? 'coffee'}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="coffee">{t('coffee')}</option>
                <option value="cacao">{t('cacao')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('certification_status')}</Label>
              <select
                name="certification_status"
                defaultValue={(editingItem?.certification_status as string) ?? 'none'}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="none">{t('none')}</option>
                <option value="organic">{t('organic')}</option>
                <option value="fair_trade">{t('fair_trade')}</option>
                <option value="rainforest">{t('rainforest')}</option>
                <option value="multiple">{t('multiple')}</option>
              </select>
            </div>
          </div>

          {/* Latitude + Longitude */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('latitude')}</Label>
              <Input
                name="latitude"
                type="number"
                step="any"
                defaultValue={(editingItem?.latitude as number) ?? ''}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('longitude')}</Label>
              <Input
                name="longitude"
                type="number"
                step="any"
                defaultValue={(editingItem?.longitude as number) ?? ''}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>{t('notes')}</Label>
            <textarea
              name="notes"
              defaultValue={(editingItem?.notes as string) ?? ''}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              defaultChecked={editingItem ? !!(editingItem.is_active) : true}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              {t('is_active')}
            </Label>
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
