import { useTranslation } from 'react-i18next';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'search';
  options?: FilterOption[];
  placeholder?: string;
}

interface SmartFilterProps {
  filters: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

export default function SmartFilter({ filters, values, onChange, onReset }: SmartFilterProps) {
  const { t } = useTranslation('common');

  const hasActiveFilters = Object.values(values).some((v) => v && v !== 'all');

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white border border-gray-200 px-3 py-2 shadow-sm">
      <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />

      {filters.map((f) => {
        if (f.type === 'search') {
          return (
            <div key={f.key} className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                value={values[f.key] || ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder || t('search', 'Search...')}
                className="h-8 pl-8 pr-3 text-sm border-gray-200 bg-gray-50/50 rounded-lg"
              />
            </div>
          );
        }

        return (
          <select
            key={f.key}
            value={values[f.key] || 'all'}
            onChange={(e) => onChange(f.key, e.target.value)}
            className="h-8 rounded-lg border border-gray-200 bg-gray-50/50 px-2.5 text-sm text-gray-700 focus:border-primary-300 focus:ring-1 focus:ring-primary-200 outline-none"
          >
            <option value="all">{f.label}</option>
            {f.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      })}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          {t('clear', 'Clear')}
        </Button>
      )}
    </div>
  );
}
