import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Building2, Pencil, Trash2, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCooperatives, useDeleteCooperative } from '../hooks/useCooperativeData';
import { CooperativeFormDialog } from './CooperativeFormDialog';

interface CooperativeTabProps {
  country: string;
  onSelectCooperative: (coopId: string, coopName: string) => void;
}

const certificationColors: Record<string, string> = {
  none: 'bg-gray-100 text-gray-600',
  organic: 'bg-green-100 text-green-700',
  fair_trade: 'bg-teal-100 text-teal-700',
  rainforest: 'bg-emerald-100 text-emerald-700',
  multiple: 'bg-purple-100 text-purple-700',
};

const commodityColors: Record<string, string> = {
  coffee: 'bg-amber-100 text-amber-700',
  cacao: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-600',
};

const PER_PAGE = 50;

export function CooperativeTab({ country, onSelectCooperative }: CooperativeTabProps) {
  const { t } = useTranslation('common');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

  const { data, isLoading, error } = useCooperatives(country, search, {}, page);
  const deleteMutation = useDeleteCooperative();

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: Record<string, unknown>, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('confirm_delete', { name }))) {
      deleteMutation.mutate(id);
    }
  };

  const handleRowClick = (item: Record<string, unknown>) => {
    onSelectCooperative(item.id as string, item.name as string);
  };

  const handleViewFarmers = (item: Record<string, unknown>, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCooperative(item.id as string, item.name as string);
  };

  // Pagination helpers
  const totalItems = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const from = totalItems === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, totalItems);

  return (
    <>
      <Card className="rounded-xl overflow-hidden">
        <div className="p-4 pb-3">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold">{t('cooperatives')}</h3>
              {data && <Badge variant="secondary" className="ml-1">{totalItems}</Badge>}
            </div>
            <Button size="sm" className="btn-3d-primary text-white rounded-lg" onClick={handleAdd}>
              <Plus className="mr-1.5 h-4 w-4" />{t('add_cooperative')}
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_cooperatives')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 rounded-lg"
            />
          </div>
        </div>

        <CardContent className="pt-0">
          {/* Error state */}
          {error ? (
            <div className="text-center py-8 text-red-500">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">{t('error_loading')}</p>
              <p className="text-xs mt-1">{(error as Error).message}</p>
            </div>
          ) : isLoading ? (
            /* Loading state */
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
            </div>
          ) : !data?.items.length ? (
            /* Empty state */
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{t('no_cooperatives')}</p>
              <Button
                size="sm"
                className="mt-3 btn-3d-primary text-white rounded-lg"
                onClick={handleAdd}
              >
                <Plus className="mr-2 h-4 w-4" />{t('add_first_cooperative')}
              </Button>
            </div>
          ) : (
            /* Data list */
            <div className="space-y-2">
              {data.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="rounded-lg border border-gray-200 p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {/* Row 1: Code + Name */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-primary-700">
                          {item.coop_code}
                        </span>
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {item.name}
                        </span>
                      </div>

                      {/* Row 2: Details */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                        {item.leader_name && (
                          <span>{t('leader')}: {item.leader_name}</span>
                        )}
                        {item.member_count != null && Number(item.member_count) > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Users className="h-3 w-3" />
                            {item.member_count} {t('members')}
                          </span>
                        )}
                        {item.village && <span>{item.village}</span>}
                      </div>

                      {/* Row 3: Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.commodity && (
                          <Badge
                            className={`text-xs border-0 ${commodityColors[item.commodity as string] || commodityColors.other}`}
                          >
                            {item.commodity}
                          </Badge>
                        )}
                        {item.certification_status && (
                          <Badge
                            className={`text-xs border-0 ${certificationColors[item.certification_status as string] || certificationColors.none}`}
                          >
                            {(item.certification_status as string).replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 rounded-lg"
                        onClick={(e) => handleViewFarmers(item, e)}
                      >
                        <Users className="h-3 w-3" />
                        <span className="hidden sm:inline">{t('view_farmers')}</span>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg"
                        onClick={(e) => handleEdit(item, e)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => handleDelete(item.id as string, item.name as string, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    {from}-{to} {t('of')} {totalItems}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      {t('previous')}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      {t('next')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <CooperativeFormDialog
        country={country}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingItem={editingItem}
      />
    </>
  );
}
