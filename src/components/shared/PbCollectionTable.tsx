import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Loader2, FileText, ChevronLeft, ChevronRight,
  Plus, Pencil, Trash2, Eye, Lock,
} from 'lucide-react';
import pb from '@/config/pocketbase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import DataExportBar from '@/components/shared/DataExportBar';
import { toast } from 'sonner';

export interface ColumnDef {
  key: string;
  label: string;
  /** PocketBase field name (defaults to key) */
  field?: string;
  /** Format function */
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
  /** Search this column */
  searchable?: boolean;
  /** Width class */
  width?: string;
  /** Hide from create/edit form (auto-generated / aggregated fields) */
  readonly?: boolean;
  /** Hide from table display but show in form (e.g. relation fields) */
  hideInTable?: boolean;
  /** Input type for form: text, number, date, select, boolean */
  inputType?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  /** Options for select inputType */
  selectOptions?: { value: string; label: string }[];
}

export interface FilterDef {
  /** Unique key */
  key: string;
  /** Display label */
  label: string;
  /** Filter type */
  type: 'select' | 'date_range' | 'text';
  /** PB field name to filter on */
  field: string;
  /** For select type: static options (value/label pairs) */
  options?: { value: string; label: string }[];
  /** Width class */
  width?: string;
}

interface PbCollectionTableProps {
  title: string;
  collection: string;
  columns: ColumnDef[];
  /** PB sort expression, defaults to '-created' */
  sort?: string;
  /** Additional PB filter */
  baseFilter?: string;
  /** Records per page */
  perPage?: number;
  /** PB expand */
  expand?: string;
  /** Enable CRUD operations (default: true) */
  editable?: boolean;
  /** Custom row click handler — overrides default detail dialog */
  onRowClick?: (id: string, record: Record<string, unknown>) => void;
  /** Optional filter definitions for advanced filtering */
  filterDefs?: FilterDef[];
  /** Pre-fill values for create form (parent relations, country, etc.) */
  defaultValues?: Record<string, unknown>;
  /** Show the built-in Back button (default: true). Set false inside drill-down tabs. */
  showBack?: boolean;
  /** Whether the edit action button is shown (default: follows editable) */
  canEdit?: boolean;
  /** Whether the delete action button is shown (default: follows editable) */
  canDelete?: boolean;
  /** Human-readable display values for readonly fields (e.g. parent codes/names from drill state) */
  readonlyDisplay?: Record<string, string>;
  /** Custom handler for "Add new" button — opens external dialog instead of built-in form */
  onCreateClick?: () => void;
}

export default function PbCollectionTable({
  title,
  collection,
  columns,
  sort = '-created',
  baseFilter = '',
  perPage = 50,
  expand,
  editable = true,
  onRowClick,
  filterDefs = [],
  defaultValues,
  showBack = true,
  canEdit,
  canDelete,
  readonlyDisplay,
  onCreateClick,
}: PbCollectionTableProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // CRUD state
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailRecord, setDetailRecord] = useState<Record<string, unknown> | null>(null);

  // Permission flags
  const showEditBtn = editable && canEdit !== false;
  const showDeleteBtn = editable && canDelete !== false;
  const showActions = showEditBtn || showDeleteBtn;
  const showAddNew = editable;

  // Visible columns for table display (exclude hideInTable)
  const visibleColumns = columns.filter(c => !c.hideInTable);

  const searchableFields = visibleColumns.filter(c => c.searchable !== false).map(c => c.field || c.key);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const buildFilter = () => {
    const parts: string[] = [];
    if (baseFilter) parts.push(baseFilter);
    if (search && searchableFields.length > 0) {
      const searchTerms = searchableFields
        .filter(f => !f.includes('.') && !['latitude', 'longitude', 'created', 'updated'].includes(f))
        .map(f => `${f} ~ "${search}"`)
        .join(' || ');
      if (searchTerms) parts.push(`(${searchTerms})`);
    }
    // Build filter expressions from filterDefs
    for (const def of filterDefs) {
      if (def.type === 'select') {
        const val = filterValues[def.key];
        if (val && val !== 'all') {
          parts.push(`${def.field} = "${val}"`);
        }
      } else if (def.type === 'text') {
        const val = filterValues[def.key];
        if (val && val.trim()) {
          parts.push(`${def.field} ~ "${val.trim()}"`);
        }
      } else if (def.type === 'date_range') {
        const from = filterValues[`${def.key}_from`];
        const to = filterValues[`${def.key}_to`];
        if (from) {
          parts.push(`${def.field} >= "${from} 00:00:00"`);
        }
        if (to) {
          parts.push(`${def.field} <= "${to} 23:59:59"`);
        }
      }
    }
    return parts.join(' && ');
  };

  const filterString = buildFilter();
  const queryKey = ['pb-collection', collection, page, search, baseFilter, filterString];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => pb.collection(collection).getList(page, perPage, {
      filter: filterString,
      sort,
      expand: expand || undefined,
    }),
  });

  const records = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  const getValue = (record: Record<string, unknown>, key: string): unknown => {
    if (key.includes('.')) {
      const parts = key.split('.');
      let val: unknown = record;
      for (const p of parts) {
        if (val && typeof val === 'object') val = (val as Record<string, unknown>)[p];
        else return '';
      }
      return val;
    }
    return record[key];
  };

  // --- CRUD mutations ---
  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (editingRecord) {
        return pb.collection(collection).update(editingRecord.id as string, data);
      }
      return pb.collection(collection).create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pb-collection', collection] });
      toast.success(editingRecord ? t('updated', 'Updated successfully') : t('created', 'Created successfully'));
      closeForm();
    },
    onError: (err: unknown) => {
      const pbErr = err as { response?: { data?: Record<string, { message: string }> }; message?: string };
      if (pbErr?.response?.data) {
        const fieldErrors = Object.entries(pbErr.response.data)
          .map(([field, detail]) => `${field}: ${detail.message}`)
          .join(', ');
        toast.error(fieldErrors);
      } else {
        toast.error(pbErr?.message || t('error', 'Error'));
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pb.collection(collection).delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pb-collection', collection] });
      toast.success(t('deleted', 'Deleted successfully'));
      setDeleteId(null);
    },
    onError: () => {
      toast.error(t('error', 'Error deleting record'));
      setDeleteId(null);
    },
  });

  // Readonly columns — PK/FK/aggregated fields shown as info banner in form
  const readonlyColumns = columns.filter(c => c.readonly);

  // Form helpers — include hideInTable columns (form-only fields) but exclude readonly
  const formColumns = columns.filter(c => {
    const field = c.field || c.key;
    return !c.readonly && !['id', 'created', 'updated', 'collectionId', 'collectionName'].includes(field);
  });

  const openCreateForm = () => {
    setEditingRecord(null);
    const initial: Record<string, unknown> = { ...defaultValues };
    formColumns.forEach(col => { initial[col.field || col.key] ??= ''; });
    setFormData(initial);
    setFormOpen(true);
  };

  const openEditForm = (record: Record<string, unknown>) => {
    setEditingRecord(record);
    const data: Record<string, unknown> = {};
    formColumns.forEach(col => {
      const field = col.field || col.key;
      data[field] = record[field] ?? '';
    });
    setFormData(data);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleFormSubmit = () => {
    // Merge defaultValues into submission (ensures parent relations are included)
    const submitData = { ...defaultValues, ...formData };
    saveMutation.mutate(submitData);
  };

  const exportData = records.map(r => {
    const row: Record<string, unknown> = {};
    for (const col of visibleColumns) {
      const field = col.field || col.key;
      row[col.key] = getValue(r as Record<string, unknown>, field);
    }
    return row;
  });

  const colCount = visibleColumns.length + (showActions ? 1 : 0);

  return (
    <div className="space-y-4 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          {showBack && (
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Button variant="ghost" size="sm" className="h-8 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('back', 'Back')}
              </Button>
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <p className="text-[13px] text-gray-400">{totalItems} {t('records', 'records')}</p>
        </div>
        <div className="flex items-center gap-2">
          {showAddNew && (
            <Button onClick={onCreateClick || openCreateForm} className="gap-2 bg-primary-700 hover:bg-primary-800 text-white">
              <Plus className="h-4 w-4" />
              {t('add_new', 'Add new')}
            </Button>
          )}
          <DataExportBar
            data={exportData as Record<string, unknown>[]}
            columns={visibleColumns.map(c => ({ key: c.key, label: c.label }))}
            filename={collection}
            sheetName={title}
            totalLabel={`${totalItems} records`}
          />
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search', 'Search...')}
              className="pl-9 border-gray-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          {filterDefs.map(def => {
            if (def.type === 'select') {
              return (
                <select
                  key={def.key}
                  value={filterValues[def.key] || 'all'}
                  onChange={e => handleFilterChange(def.key, e.target.value)}
                  className={`rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white ${def.width || 'w-[160px]'}`}
                >
                  <option value="all">{def.label}: {t('all', 'All')}</option>
                  {def.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              );
            }
            if (def.type === 'text') {
              return (
                <Input
                  key={def.key}
                  placeholder={def.label}
                  value={filterValues[def.key] || ''}
                  onChange={e => handleFilterChange(def.key, e.target.value)}
                  className={`border-gray-200 ${def.width || 'w-[160px]'}`}
                />
              );
            }
            if (def.type === 'date_range') {
              return (
                <div key={def.key} className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 whitespace-nowrap">{def.label}:</span>
                  <Input
                    type="date"
                    value={filterValues[`${def.key}_from`] || ''}
                    onChange={e => handleFilterChange(`${def.key}_from`, e.target.value)}
                    className="border-gray-200 w-[140px] text-xs"
                  />
                  <span className="text-xs text-gray-400">—</span>
                  <Input
                    type="date"
                    value={filterValues[`${def.key}_to`] || ''}
                    onChange={e => handleFilterChange(`${def.key}_to`, e.target.value)}
                    className="border-gray-200 w-[140px] text-xs"
                  />
                </div>
              );
            }
            return null;
          })}
          {filterDefs.length > 0 && Object.values(filterValues).some(v => v && v !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setFilterValues({}); setPage(1); }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {t('clear_filters', 'Clear filters')}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[65vh]">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="border-b border-primary-800 hover:bg-transparent">
                {visibleColumns.map(col => (
                  <TableHead
                    key={col.key}
                    className={`font-semibold text-white text-[12px] uppercase tracking-wider whitespace-nowrap bg-primary-700 px-4 py-2.5 ${col.width || ''}`}
                  >
                    {col.label}
                  </TableHead>
                ))}
                {showActions && (
                  <TableHead className="font-semibold text-white text-[12px] uppercase tracking-wider whitespace-nowrap bg-primary-700 px-4 py-2.5 w-[100px]">
                    {t('actions', 'Actions')}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={colCount} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                      <p className="text-sm text-gray-500">{t('loading', 'Loading...')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colCount} className="h-48 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 opacity-10" />
                      <p>{t('no_records', 'No records found.')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record: Record<string, unknown>) => (
                  <TableRow
                    key={record.id as string}
                    className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => onRowClick ? onRowClick(record.id as string, record as Record<string, unknown>) : setDetailRecord(record)}
                  >
                    {visibleColumns.map(col => {
                      const field = col.field || col.key;
                      const val = getValue(record, field);
                      return (
                        <TableCell key={col.key} className="text-[13px] text-gray-700 whitespace-nowrap max-w-[250px] truncate px-4 py-3">
                          {col.render ? col.render(val, record) : String(val ?? '')}
                        </TableCell>
                      );
                    })}
                    {showActions && (
                      <TableCell className="px-4 py-2" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {showEditBtn && (
                            <button
                              type="button"
                              onClick={() => openEditForm(record)}
                              className="p-1.5 rounded-md text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                              title={t('edit', 'Edit')}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {showDeleteBtn && (
                            <button
                              type="button"
                              onClick={() => setDeleteId(record.id as string)}
                              className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title={t('delete', 'Delete')}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {t('page', 'Page')} {page} / {totalPages} ({totalItems} {t('total', 'total')})
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {editable && (
        <Dialog open={formOpen} onOpenChange={(open) => { if (!open) closeForm(); }}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? t('edit_record', 'Edit record') : t('add_new_record', 'Add new record')}
              </DialogTitle>
              <DialogDescription>
                {collection}
              </DialogDescription>
            </DialogHeader>

            {/* Readonly info banner — PK, FK, parent reference */}
            {readonlyColumns.length > 0 && (() => {
              // Build display items — skip FK-only columns (hideInTable) that have no human-readable display
              const infoItems = readonlyColumns
                .map(col => {
                  const field = col.field || col.key;
                  const rawValue = editingRecord
                    ? editingRecord[field]
                    : (defaultValues?.[field] ?? null);
                  const hasReadableDisplay = !!readonlyDisplay?.[field];
                  const displayValue = readonlyDisplay?.[field]
                    || (rawValue ? String(rawValue) : null);
                  // FK columns (hideInTable) without readable display → skip (shows raw PB ID)
                  if (col.hideInTable && !hasReadableDisplay) return null;
                  return { field, label: col.label, displayValue };
                })
                .filter((item): item is NonNullable<typeof item> => !!item && !!item.displayValue);

              if (infoItems.length === 0 && !editingRecord) return null;

              return (
                <div className="rounded-lg border border-primary-200 bg-primary-50/50 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
                    <Lock className="h-3 w-3" />
                    {t('auto_filled_fields', 'Auto-filled fields')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {infoItems.map(item => (
                      <div key={item.field} className="flex items-center gap-2 py-0.5">
                        <span className="text-[11px] font-medium text-gray-500 shrink-0">{item.label}:</span>
                        <span className="text-[12px] font-mono text-primary-800 truncate">
                          {item.displayValue || (editingRecord ? '—' : t('auto_generated', 'Auto'))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {formColumns.map(col => {
                const field = col.field || col.key;
                const value = formData[field];
                const inputType = col.inputType || 'text';

                return (
                  <div key={field} className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-700">{col.label}</Label>
                    {inputType === 'boolean' ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!value}
                          onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{col.label}</span>
                      </label>
                    ) : inputType === 'select' && col.selectOptions ? (
                      <select
                        value={String(value || '')}
                        onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      >
                        <option value="">--</option>
                        {col.selectOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={inputType === 'number' ? 'number' : inputType === 'date' ? 'date' : 'text'}
                        value={String(value ?? '')}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          [field]: inputType === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value,
                        }))}
                        className="border-gray-200"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeForm}>
                {t('cancel', 'Cancel')}
              </Button>
              <Button
                onClick={handleFormSubmit}
                disabled={saveMutation.isPending}
                className="bg-primary-700 hover:bg-primary-800 text-white"
              >
                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingRecord ? t('update', 'Update') : t('create', 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {editable && (
        <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-700">{t('confirm_delete', 'Confirm delete')}</DialogTitle>
              <DialogDescription>
                {t('delete_warning', 'This action cannot be undone. Are you sure you want to delete this record?')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                {t('cancel', 'Cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('delete', 'Delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Record Detail Dialog */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => { if (!open) setDetailRecord(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Eye className="h-5 w-5 text-primary-600" />
              {t('record_detail', 'Record Detail')}
            </DialogTitle>
            <DialogDescription className="text-[13px]">{title}</DialogDescription>
          </DialogHeader>

          {/* Action buttons — top */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            {showEditBtn && (
              <Button variant="outline" size="sm" onClick={() => {
                if (detailRecord) {
                  setDetailRecord(null);
                  openEditForm(detailRecord);
                }
              }} className="gap-1.5 rounded-lg text-[13px]">
                <Pencil className="h-3.5 w-3.5" />
                {t('edit', 'Edit')}
              </Button>
            )}
            <Button size="sm" onClick={() => setDetailRecord(null)} className="ml-auto rounded-lg text-[13px]">
              {t('close', 'Close')}
            </Button>
          </div>

          {detailRecord && (
            <div className="divide-y divide-gray-50">
              {visibleColumns.map(col => {
                const field = col.field || col.key;
                const val = getValue(detailRecord, field);
                const displayVal = col.render ? col.render(val, detailRecord) : String(val ?? '—');
                return (
                  <div key={col.key} className="flex py-2.5 gap-4 hover:bg-gray-50/50 -mx-2 px-2 rounded-md transition-colors">
                    <span className="text-[13px] font-medium text-gray-400 w-1/3 shrink-0">{col.label}</span>
                    <span className="text-[13px] text-gray-800 break-words">{displayVal}</span>
                  </div>
                );
              })}
              {/* System fields */}
              <div className="pt-3 mt-2 space-y-2">
                <div className="flex gap-4 -mx-2 px-2">
                  <span className="text-[13px] font-medium text-gray-400 w-1/3 shrink-0">ID</span>
                  <span className="text-xs text-gray-400 font-mono">{String(detailRecord.id ?? '')}</span>
                </div>
                <div className="flex gap-4 -mx-2 px-2">
                  <span className="text-[13px] font-medium text-gray-400 w-1/3 shrink-0">{t('created', 'Created')}</span>
                  <span className="text-[13px] text-gray-600">{String(detailRecord.created ?? '')}</span>
                </div>
                <div className="flex gap-4 -mx-2 px-2">
                  <span className="text-[13px] font-medium text-gray-400 w-1/3 shrink-0">{t('updated_at', 'Updated')}</span>
                  <span className="text-[13px] text-gray-600">{String(detailRecord.updated ?? '')}</span>
                </div>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
}
