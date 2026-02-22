import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export type ExportFormat = 'csv' | 'xlsx';

interface ExportOptions {
  /** File name without extension */
  filename: string;
  /** Sheet name for XLSX */
  sheetName?: string;
}

/**
 * Hook for exporting data to CSV or XLSX.
 *
 * Usage:
 * ```ts
 * const { exportData } = useExport();
 * exportData(rows, columns, { filename: 'farmers' }, 'xlsx');
 * ```
 */
export function useExport() {
  const { t } = useTranslation('common');

  const exportData = useCallback(
    <T extends Record<string, unknown>>(
      data: T[],
      columns: { key: string; label: string }[],
      options: ExportOptions,
      format: ExportFormat = 'xlsx'
    ) => {
      if (data.length === 0) {
        toast.error(t('no_data', 'No data to export'));
        return;
      }

      try {
        // Build rows with column headers
        const headers = columns.map((c) => c.label);
        const rows = data.map((row) =>
          columns.map((c) => {
            const val = row[c.key];
            if (val === null || val === undefined) return '';
            if (val instanceof Date) return val.toISOString().split('T')[0];
            return String(val);
          })
        );

        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        // Auto-width columns
        ws['!cols'] = columns.map((_, i) => {
          const maxLen = Math.max(
            headers[i].length,
            ...rows.map((r) => String(r[i]).length)
          );
          return { wch: Math.min(maxLen + 2, 50) };
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Data');

        if (format === 'csv') {
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
          saveAs(blob, `${options.filename}.csv`);
        } else {
          const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          saveAs(blob, `${options.filename}.xlsx`);
        }

        toast.success(t('export_success', 'Exported successfully'));
      } catch (err) {
        console.error('Export error:', err);
        toast.error(t('export_error', 'Export failed'));
      }
    },
    [t]
  );

  return { exportData };
}
