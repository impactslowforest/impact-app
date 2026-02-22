import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateEcosystemAssessment, useUpdateEcosystemAssessment, useFarmsList } from '../../farm-operations/hooks/useFarmOpsData';

interface EcosystemFormDialogProps {
    country: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: Record<string, unknown> | null;
}

export function EcosystemFormDialog({ country, open, onOpenChange, editingItem }: EcosystemFormDialogProps) {
    const { t } = useTranslation('common');
    const formRef = useRef<HTMLFormElement>(null);
    const createMutation = useCreateEcosystemAssessment();
    const updateMutation = useUpdateEcosystemAssessment();
    const { data: farms } = useFarmsList(country);
    const isEditing = !!editingItem;

    useEffect(() => { if (open && formRef.current) formRef.current.reset(); }, [open, editingItem]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((val, key) => { data[key] = val; });
        if (data.species_count) data.species_count = parseInt(data.species_count as string) || 0;
        if (data.vegetation_cover_pct) data.vegetation_cover_pct = parseFloat(data.vegetation_cover_pct as string) || 0;
        data.wild_beekeeping = form.has('wild_beekeeping');
        data.managed_beekeeping = form.has('managed_beekeeping');
        data.riparian_buffer_check = form.has('riparian_buffer_check');
        data.fire_usage = form.has('fire_usage');
        data.country = country;

        if (isEditing) {
            updateMutation.mutate({ id: editingItem.id as string, data }, { onSuccess: () => onOpenChange(false) });
        } else {
            createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Ecosystem Assessment' : 'Add Ecosystem Assessment'}</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Farm *</Label>
                            <select name="farm" required defaultValue={(editingItem?.farm as string) ?? ''} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="">Select farm...</option>
                                {farms?.map((f) => <option key={f.id} value={f.id}>{f.farm_name} ({f.farm_code})</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Assessment Date *</Label>
                            <Input name="assessment_date" type="date" required defaultValue={(editingItem?.assessment_date as string)?.split('T')[0] ?? ''} className="rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5"><Label>Species Count</Label><Input name="species_count" type="number" min="0" defaultValue={(editingItem?.species_count as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5"><Label>Vegetation Cover %</Label><Input name="vegetation_cover_pct" type="number" min="0" max="100" defaultValue={(editingItem?.vegetation_cover_pct as number) ?? ''} className="rounded-lg" /></div>
                        <div className="space-y-1.5">
                            <Label>Biodiversity Rating</Label>
                            <select name="biodiversity_rating" defaultValue={(editingItem?.biodiversity_rating as string) ?? 'good'} className="w-full rounded-lg border px-3 py-2 text-sm">
                                <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5"><Label>Tree Species</Label><Input name="tree_species_list" defaultValue={(editingItem?.tree_species_list as string) ?? ''} placeholder="e.g. Avocado, Macadamia, Teak" className="rounded-lg" /></div>
                    <div className="space-y-1.5"><Label>Wildlife Observed</Label><Input name="wildlife_observed" defaultValue={(editingItem?.wildlife_observed as string) ?? ''} className="rounded-lg" /></div>
                    <div className="space-y-1.5"><Label>Buffer Zone Details</Label><Input name="buffer_zone_details" defaultValue={(editingItem?.buffer_zone_details as string) ?? ''} className="rounded-lg" /></div>
                    <div className="space-y-1.5"><Label>Waste Management</Label><Input name="waste_management_notes" defaultValue={(editingItem?.waste_management_notes as string) ?? ''} className="rounded-lg" /></div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { name: 'wild_beekeeping', label: '🐝 Wild Beekeeping' },
                            { name: 'managed_beekeeping', label: '🍯 Managed Beekeeping' },
                            { name: 'riparian_buffer_check', label: '💧 Riparian Buffer' },
                            { name: 'fire_usage', label: '🔥 Fire Usage' },
                        ].map(({ name, label }) => (
                            <div key={name} className="flex items-center gap-2">
                                <input type="checkbox" id={`eco_${name}`} name={name} defaultChecked={!!editingItem?.[name]} className="h-4 w-4 rounded border-gray-300" />
                                <Label htmlFor={`eco_${name}`} className="cursor-pointer">{label}</Label>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1.5"><Label>Notes</Label><Input name="notes" defaultValue={(editingItem?.notes as string) ?? ''} className="rounded-lg" /></div>

                    <Button type="submit" className="w-full btn-3d-primary text-white rounded-lg" disabled={createMutation.isPending || updateMutation.isPending}>
                        {isEditing ? t('save_changes', 'Save Changes') : 'Add Assessment'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
