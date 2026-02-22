import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pb from '@/config/pocketbase';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// ── Cooperatives ──

export function useCooperatives(country: string, search: string, filters: Record<string, string>, page: number) {
  return useQuery({
    queryKey: ['cooperatives', country, search, filters, page],
    queryFn: () => {
      const parts: string[] = [`country = "${country}"`];
      if (search) parts.push(`(coop_code ~ "${search}" || name ~ "${search}" || leader_name ~ "${search}")`);
      if (filters.certification_status && filters.certification_status !== 'all') parts.push(`certification_status = "${filters.certification_status}"`);
      if (filters.commodity && filters.commodity !== 'all') parts.push(`commodity = "${filters.commodity}"`);
      return pb.collection('cooperatives').getList(page, 50, {
        filter: parts.join(' && '),
        sort: '-created',
      });
    },
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });
}

export function useCooperativesList(country: string) {
  return useQuery({
    queryKey: ['cooperatives-list', country],
    queryFn: () => pb.collection('cooperatives').getFullList({
      filter: `country = "${country}"`,
      sort: 'name',
      fields: 'id,name,coop_code',
    }),
    enabled: country === 'laos',
  });
}

export function useCreateCooperative() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => pb.collection('cooperatives').create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useUpdateCooperative() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('cooperatives').update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useDeleteCooperative() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (id: string) => pb.collection('cooperatives').delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
      toast.success(t('deleted'));
    },
    onError: () => toast.error(t('error')),
  });
}

// ── Farmers ──

export function useFarmers(country: string, search: string, filters: Record<string, string>, page: number) {
  return useQuery({
    queryKey: ['farmers', country, search, filters, page],
    queryFn: () => {
      const parts: string[] = [`country = "${country}"`];
      if (search) parts.push(`(farmer_code ~ "${search}" || full_name ~ "${search}" || phone ~ "${search}")`);
      if (filters.cooperative && filters.cooperative !== 'all') parts.push(`cooperative = "${filters.cooperative}"`);
      if (filters.gender && filters.gender !== 'all') parts.push(`gender = "${filters.gender}"`);
      if (filters.certification_status && filters.certification_status !== 'all') parts.push(`certification_status = "${filters.certification_status}"`);
      if (filters.province && filters.province !== 'all') parts.push(`province ~ "${filters.province}"`);
      if (filters.district && filters.district !== 'all') parts.push(`district ~ "${filters.district}"`);
      if (filters.village && filters.village !== 'all') parts.push(`village ~ "${filters.village}"`);
      return pb.collection('farmers').getList(page, 50, {
        filter: parts.join(' && '),
        sort: '-created',
        expand: 'cooperative',
      });
    },
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });
}

export function useFarmersList(country: string) {
  return useQuery({
    queryKey: ['farmers-list', country],
    queryFn: () => pb.collection('farmers').getFullList({
      filter: `country = "${country}"`,
      sort: 'full_name',
      fields: 'id,full_name,farmer_code',
    }),
  });
}

export function useCreateFarmer() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => pb.collection('farmers').create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useUpdateFarmer() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('farmers').update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useDeleteFarmer() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (id: string) => pb.collection('farmers').delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast.success(t('deleted'));
    },
    onError: () => toast.error(t('error')),
  });
}

// ── Farms ──

export function useFarms(country: string, search: string, filters: Record<string, string>, page: number) {
  return useQuery({
    queryKey: ['farms', country, search, filters, page],
    queryFn: () => {
      const parts: string[] = [`country = "${country}"`];
      if (search) parts.push(`(farm_code ~ "${search}" || farm_name ~ "${search}")`);
      if (filters.farmer && filters.farmer !== 'all') parts.push(`farmer = "${filters.farmer}"`);
      if (filters.commodity && filters.commodity !== 'all') parts.push(`commodity = "${filters.commodity}"`);
      if (filters.production_system && filters.production_system !== 'all') parts.push(`production_system = "${filters.production_system}"`);
      if (filters.province && filters.province !== 'all') parts.push(`province ~ "${filters.province}"`);
      if (filters.district && filters.district !== 'all') parts.push(`district ~ "${filters.district}"`);
      if (filters.village && filters.village !== 'all') parts.push(`village ~ "${filters.village}"`);
      return pb.collection('farms').getList(page, 50, {
        filter: parts.join(' && '),
        sort: '-created',
        expand: 'farmer',
      });
    },
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => pb.collection('farms').create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useUpdateFarm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('farms').update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (id: string) => pb.collection('farms').delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success(t('deleted'));
    },
    onError: () => toast.error(t('error')),
  });
}

// ── Harvest Records ──

export function useHarvestRecords(country: string, search: string, filters: Record<string, string>, page: number) {
  return useQuery({
    queryKey: ['harvest-records', country, search, filters, page],
    queryFn: () => {
      const parts: string[] = [`country = "${country}"`];
      if (search) parts.push(`(lot_number ~ "${search}" || variety ~ "${search}" || buyer ~ "${search}")`);
      if (filters.farm && filters.farm !== 'all') parts.push(`farm = "${filters.farm}"`);
      if (filters.crop_type && filters.crop_type !== 'all') parts.push(`crop_type = "${filters.crop_type}"`);
      if (filters.quality_grade && filters.quality_grade !== 'all') parts.push(`quality_grade = "${filters.quality_grade}"`);
      return pb.collection('harvest_records').getList(page, 50, {
        filter: parts.join(' && '),
        sort: '-harvest_date',
        expand: 'farm,farmer',
      });
    },
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });
}

export function useCreateHarvest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => pb.collection('harvest_records').create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['harvest-records'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useUpdateHarvest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('harvest_records').update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['harvest-records'] });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('error')),
  });
}

export function useDeleteHarvest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: (id: string) => pb.collection('harvest_records').delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['harvest-records'] });
      toast.success(t('deleted'));
    },
    onError: () => toast.error(t('error')),
  });
}

// ── Stats ──

export function useCooperativeStats(country: string) {
  return useQuery({
    queryKey: ['cooperative-stats', country],
    queryFn: async () => {
      const filter = `country = "${country}"`;
      const [coops, farmers, farms] = await Promise.all([
        country === 'laos' ? pb.collection('cooperatives').getList(1, 1, { filter }) : Promise.resolve({ totalItems: 0 }),
        pb.collection('farmers').getList(1, 1, { filter }),
        pb.collection('farms').getList(1, 1, { filter }),
      ]);
      // Get total area
      const allFarms = await pb.collection('farms').getFullList({
        filter,
        fields: 'area_ha',
      });
      const totalArea = allFarms.reduce((sum, f) => sum + (f.area_ha || 0), 0);
      return {
        cooperatives: coops.totalItems,
        farmers: farmers.totalItems,
        farms: farms.totalItems,
        totalArea: Math.round(totalArea * 100) / 100,
      };
    },
    staleTime: 30000,
  });
}
