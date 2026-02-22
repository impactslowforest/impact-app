import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, Users, TreePine, Building2, ShieldCheck,
  FileCheck, Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import pb from '@/config/pocketbase';
import { ROUTES } from '@/config/routes';

interface SearchResult {
  id: string;
  collection: string;
  title: string;
  subtitle: string;
  path: string;
}

const COLLECTION_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  fields: string[];
  titleField: string;
  subtitleField: string;
  path: string;
}> = {
  users: {
    label: 'Users',
    icon: Users,
    fields: ['name', 'email'],
    titleField: 'name',
    subtitleField: 'email',
    path: ROUTES.IMPACT_USERS,
  },
  cooperatives: {
    label: 'Cooperatives',
    icon: Building2,
    fields: ['name', 'code'],
    titleField: 'name',
    subtitleField: 'code',
    path: ROUTES.DASHBOARD,
  },
  farmers: {
    label: 'Farmers',
    icon: Users,
    fields: ['full_name', 'phone'],
    titleField: 'full_name',
    subtitleField: 'phone',
    path: ROUTES.DASHBOARD,
  },
  farms: {
    label: 'Farms',
    icon: TreePine,
    fields: ['farm_name', 'location'],
    titleField: 'farm_name',
    subtitleField: 'location',
    path: ROUTES.DASHBOARD,
  },
  eudr_plots: {
    label: 'EUDR Plots',
    icon: ShieldCheck,
    fields: ['plot_name', 'plot_code'],
    titleField: 'plot_name',
    subtitleField: 'plot_code',
    path: ROUTES.IMPACT_EUDR,
  },
  ra_audits: {
    label: 'RA Audits',
    icon: FileCheck,
    fields: ['audit_location'],
    titleField: 'audit_location',
    subtitleField: 'overall_result',
    path: ROUTES.IMPACT_CERTIFICATION,
  },
};

export default function GlobalSearch() {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const allResults: SearchResult[] = [];

    const searchPromises = Object.entries(COLLECTION_CONFIG).map(
      async ([collection, config]) => {
        try {
          const filterParts = config.fields
            .map((f) => `${f} ~ "${searchQuery}"`)
            .join(' || ');

          const response = await pb.collection(collection).getList(1, 5, {
            filter: filterParts,
            fields: `id,${config.fields.join(',')}`,
          });

          for (const record of response.items) {
            allResults.push({
              id: record.id,
              collection,
              title: (record as Record<string, string>)[config.titleField] || '—',
              subtitle: (record as Record<string, string>)[config.subtitleField] || '',
              path: config.path,
            });
          }
        } catch {
          // Collection may not exist yet, skip
        }
      }
    );

    await Promise.allSettled(searchPromises);
    setResults(allResults);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => performSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Group results by collection
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.collection]) acc[r.collection] = [];
    acc[r.collection].push(r);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder={t('common:search')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-12 pr-10 h-12 rounded-xl border-gray-200 text-base bg-white shadow-sm focus:border-primary-300 focus:ring-primary-200"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {t('common:loading')}...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('common:no_data')}
            </div>
          ) : (
            Object.entries(grouped).map(([collection, items]) => {
              const config = COLLECTION_CONFIG[collection];
              if (!config) return null;
              const Icon = config.icon;

              return (
                <div key={collection}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 flex items-center gap-2 border-b border-gray-100">
                    <Icon className="h-3.5 w-3.5" />
                    {config.label}
                    <span className="ml-auto text-gray-400">{items.length}</span>
                  </div>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
