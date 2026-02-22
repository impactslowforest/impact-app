import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExport, type ExportFormat } from '@/hooks/useExport';

interface ColumnDef {
  key: string;
  label: string;
}

interface DataExportBarProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef[];
  filename: string;
  sheetName?: string;
  /** Total count label e.g. "156 records" */
  totalLabel?: string;
}

export default function DataExportBar<T extends Record<string, unknown>>({
  data,
  columns,
  filename,
  sheetName,
  totalLabel,
}: DataExportBarProps<T>) {
  const { t } = useTranslation('common');
  const { exportData } = useExport();
  const [open, setOpen] = useState(false);

  const handleExport = (format: ExportFormat) => {
    exportData(data, columns, { filename, sheetName }, format);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      {totalLabel && (
        <span className="text-xs text-gray-500">{totalLabel}</span>
      )}

      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(!open)}
          className="h-8 gap-1.5 text-xs border-gray-200"
        >
          <Download className="h-3.5 w-3.5" />
          {t('export', 'Export')}
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 py-1 min-w-[140px]">
              <button
                type="button"
                onClick={() => handleExport('xlsx')}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Excel (.xlsx)
              </button>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                CSV (.csv)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
