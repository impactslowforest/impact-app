import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, MapPin, FileCheck, AlertTriangle, FileText, ClipboardList, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import pb from '@/config/pocketbase';
import { EudrDocuments } from './EudrDocuments';
import { EudrPlots } from './EudrPlots';
import EudrLibrary from './EudrLibrary';

type CountryValue = 'indonesia' | 'vietnam' | 'laos';

interface EudrDashboardProps {
  country?: CountryValue;
}

export default function EudrDashboard({ country: propCountry }: EudrDashboardProps) {
  const { t } = useTranslation(['common', 'nav']);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Country from URL param or prop
  const urlCountry = searchParams.get('country') as CountryValue | null;
  const initialCountry = urlCountry || propCountry || 'all';
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);

  // Sync selectedCountry when URL param changes (e.g. navigating from one country EUDR to another)
  useEffect(() => {
    const newCountry = searchParams.get('country') as CountryValue | null;
    if (newCountry && newCountry !== selectedCountry) {
      setSelectedCountry(newCountry);
    }
  }, [searchParams]);

  const effectiveCountry = selectedCountry === 'all' ? undefined : (selectedCountry as CountryValue);
  const countryFilter = effectiveCountry ? `country = "${effectiveCountry}"` : '';

  const { data: plotStats, isLoading } = useQuery({
    queryKey: ['eudr-stats', effectiveCountry],
    queryFn: async () => {
      const filter = countryFilter || undefined;
      const all = await pb.collection('eudr_plots').getList(1, 1, { filter });
      const compliant = await pb.collection('eudr_plots').getList(1, 1, {
        filter: filter ? `${filter} && status = "compliant"` : 'status = "compliant"',
      });
      const nonCompliant = await pb.collection('eudr_plots').getList(1, 1, {
        filter: filter ? `${filter} && status = "non_compliant"` : 'status = "non_compliant"',
      });
      const assessed = await pb.collection('eudr_plots').getList(1, 1, {
        filter: filter ? `${filter} && status = "assessed"` : 'status = "assessed"',
      });
      return {
        total: all.totalItems,
        compliant: compliant.totalItems,
        nonCompliant: nonCompliant.totalItems,
        assessed: assessed.totalItems,
        pending: all.totalItems - compliant.totalItems - nonCompliant.totalItems - assessed.totalItems,
      };
    },
  });

  const stats = [
    {
      label: t('common:total_plots'),
      value: plotStats?.total ?? 0,
      icon: MapPin,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: t('common:compliant'),
      value: plotStats?.compliant ?? 0,
      icon: FileCheck,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: t('common:non_compliant'),
      value: plotStats?.nonCompliant ?? 0,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50',
    },
    {
      label: t('common:pending_review'),
      value: plotStats?.pending ?? 0,
      icon: ClipboardList,
      color: 'text-yellow-600 bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Country Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary-600" />
            {t('nav:eudr_compliance')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            EU Deforestation Regulation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common:all_countries', 'All Countries')}</SelectItem>
              <SelectItem value="indonesia">Indonesia</SelectItem>
              <SelectItem value="vietnam">Vietnam</SelectItem>
              <SelectItem value="laos">Laos</SelectItem>
            </SelectContent>
          </Select>
          {effectiveCountry && (
            <Badge variant="outline" className="capitalize">
              {effectiveCountry}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="cursor-pointer hover:shadow-md transition-all hover:bg-white/50 active:scale-95"
            onClick={() => {
              const tab = 'plots';
              let status = 'all';
              if (stat.label === t('common:compliant')) status = 'compliant';
              if (stat.label === t('common:non_compliant')) status = 'non_compliant';
              if (stat.label === t('common:pending_review')) status = 'pending_review';

              setSearchParams({
                tab,
                ...(selectedCountry !== 'all' ? { country: selectedCountry } : {}),
                ...(status !== 'all' ? { status } : {})
              });
            }}
          >
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v, ...(selectedCountry !== 'all' ? { country: selectedCountry } : {}) })}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common:overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="plots" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common:plots')}</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common:documents')}</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common:eudr_library')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('common:eudr_overview')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary-50 border border-primary-200 p-4">
                <h3 className="font-semibold text-primary-800 mb-2">EU Deforestation Regulation (EUDR)</h3>
                <p className="text-sm text-primary-700 leading-relaxed">
                  Regulation (EU) 2023/1115 requires that commodities (including coffee and cacao)
                  placed on the EU market are deforestation-free, legally produced, and covered by a
                  due diligence statement. Key requirements include:
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-primary-700">
                  <li className="flex gap-2"><FileCheck className="h-4 w-4 mt-0.5 shrink-0" /> No deforestation after December 31, 2020</li>
                  <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> GPS geolocation of all plots ({'>'}4ha requires polygon)</li>
                  <li className="flex gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" /> Compliance with local laws (land tenure, labor, environment)</li>
                  <li className="flex gap-2"><ClipboardList className="h-4 w-4 mt-0.5 shrink-0" /> Documented due diligence and risk assessment</li>
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm">Indonesia</h4>
                    <p className="text-xs text-muted-foreground mt-1">Cacao — High benchmark risk</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm">Vietnam</h4>
                    <p className="text-xs text-muted-foreground mt-1">Coffee — Standard risk</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm">Laos</h4>
                    <p className="text-xs text-muted-foreground mt-1">Coffee — Standard risk</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setSearchParams({ tab: 'plots' })}>
                  <MapPin className="mr-2 h-4 w-4" /> {effectiveCountry ? t('common:manage_plots') : t('common:view_plots', 'View Plots')}
                </Button>
                <Button variant="outline" onClick={() => setSearchParams({ tab: 'documents' })}>
                  <FileText className="mr-2 h-4 w-4" /> {t('common:view_documents')}
                </Button>
                <Button variant="outline" onClick={() => setSearchParams({ tab: 'library' })}>
                  <BookOpen className="mr-2 h-4 w-4" /> {t('common:eudr_library')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plots" className="mt-4">
          <EudrPlots country={effectiveCountry} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <EudrDocuments country={effectiveCountry} />
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <EudrLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
