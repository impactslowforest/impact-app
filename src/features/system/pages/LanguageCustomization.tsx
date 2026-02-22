import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Languages, Search, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

const NAMESPACES = ['common', 'nav', 'auth'] as const;
const LANGS = ['en', 'vi', 'lo', 'id'] as const;
const LANG_LABELS: Record<string, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  lo: 'ລາວ',
  id: 'Indonesia',
};

const STORAGE_KEY = 'impact_custom_translations';

function getCustomTranslations(): Record<string, Record<string, Record<string, string>>> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCustomTranslations(data: Record<string, Record<string, Record<string, string>>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function LanguageCustomization() {
  const { t } = useTranslation(['common', 'nav']);
  const [namespace, setNamespace] = useState<string>('nav');
  const [search, setSearch] = useState('');
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({});

  const allKeys = useMemo(() => {
    const bundle = i18n.getResourceBundle('en', namespace);
    if (!bundle) return [];
    return Object.keys(bundle).sort();
  }, [namespace]);

  const filteredKeys = useMemo(() => {
    if (!search) return allKeys;
    const q = search.toLowerCase();
    return allKeys.filter((key) => {
      if (key.toLowerCase().includes(q)) return true;
      for (const lang of LANGS) {
        const val = i18n.t(`${namespace}:${key}`, { lng: lang, defaultValue: '' });
        if (val.toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [allKeys, search, namespace]);

  const getValue = useCallback((key: string, lang: string) => {
    if (edits[key]?.[lang] !== undefined) return edits[key][lang];
    return i18n.t(`${namespace}:${key}`, { lng: lang, defaultValue: key });
  }, [edits, namespace]);

  const handleEdit = (key: string, lang: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [lang]: value },
    }));
  };

  const handleSave = () => {
    const custom = getCustomTranslations();
    if (!custom[namespace]) custom[namespace] = {};

    for (const [key, langs] of Object.entries(edits)) {
      for (const [lang, value] of Object.entries(langs)) {
        if (!custom[namespace][lang]) custom[namespace][lang] = {};
        custom[namespace][lang][key] = value;
        // Apply immediately
        i18n.addResourceBundle(lang, namespace, { [key]: value }, true, true);
      }
    }

    saveCustomTranslations(custom);
    setEdits({});
    toast.success(t('common:saved'));
  };

  const handleReset = () => {
    const custom = getCustomTranslations();
    delete custom[namespace];
    saveCustomTranslations(custom);

    // Reload from original bundles by re-fetching
    for (const lang of LANGS) {
      i18n.reloadResources([lang], [namespace]);
    }
    setEdits({});
    toast.success(t('common:reset_success', 'Translations reset to defaults'));
  };

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Languages className="h-6 w-6 text-primary-600" />
            {t('nav:language')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('common:language_customization_desc', 'Customize translations for menus, toolbars, and views')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-4 w-4" />
            {t('common:reset', 'Reset')}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasEdits} className="gap-1.5 btn-3d-primary text-white">
            <Save className="h-4 w-4" />
            {t('common:save')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={namespace} onValueChange={(v) => { setNamespace(v); setEdits({}); }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NAMESPACES.map((ns) => (
                  <SelectItem key={ns} value={ns}>
                    {ns.charAt(0).toUpperCase() + ns.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common:search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {namespace.toUpperCase()} — {filteredKeys.length} {t('common:keys', 'keys')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] text-xs">Key</TableHead>
                  {LANGS.map((lang) => (
                    <TableHead key={lang} className="min-w-[200px] text-xs">
                      {LANG_LABELS[lang]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key}>
                    <TableCell className="font-mono text-xs text-muted-foreground py-1.5">
                      {key}
                    </TableCell>
                    {LANGS.map((lang) => (
                      <TableCell key={lang} className="py-1.5">
                        <Input
                          value={getValue(key, lang)}
                          onChange={(e) => handleEdit(key, lang, e.target.value)}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {filteredKeys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {t('common:no_results')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
