import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pb from '@/config/pocketbase';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// ── Farm Inputs ──

export function useFarmInputs(country: string, search: string, filters: Record<string, string>, page: number) {
    return useQuery({
        queryKey: ['farm-inputs', country, search, filters, page],
        queryFn: () => {
            const parts: string[] = [`country = "${country}"`];
            if (search) parts.push(`(input_name ~ "${search}" || input_type ~ "${search}")`);
            if (filters.input_type && filters.input_type !== 'all') parts.push(`input_type = "${filters.input_type}"`);
            if (filters.farm && filters.farm !== 'all') parts.push(`farm = "${filters.farm}"`);
            return pb.collection('farm_inputs').getList(page, 50, {
                filter: parts.join(' && '),
                sort: '-created',
                expand: 'farm',
            });
        },
        staleTime: 0,
        refetchOnMount: 'always' as const,
    });
}

export function useCreateFarmInput() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => pb.collection('farm_inputs').create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['farm-inputs'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useUpdateFarmInput() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('farm_inputs').update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['farm-inputs'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useDeleteFarmInput() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (id: string) => pb.collection('farm_inputs').delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['farm-inputs'] });
            toast.success(t('deleted'));
        },
        onError: () => toast.error(t('error')),
    });
}

// ── Environment Assessments ──

export function useEnvironmentAssessments(country: string, search: string, filters: Record<string, string>, page: number) {
    return useQuery({
        queryKey: ['environment-assessments', country, search, filters, page],
        queryFn: () => {
            const parts: string[] = [`country = "${country}"`];
            if (search) parts.push(`(protection_method ~ "${search}" || non_conformity_history ~ "${search}")`);
            if (filters.water_pollution_risk && filters.water_pollution_risk !== 'all') parts.push(`water_pollution_risk = "${filters.water_pollution_risk}"`);
            if (filters.farm && filters.farm !== 'all') parts.push(`farm = "${filters.farm}"`);
            return pb.collection('farm_environment_assessments').getList(page, 50, {
                filter: parts.join(' && '),
                sort: '-assessment_date',
                expand: 'farm',
            });
        },
        staleTime: 0,
        refetchOnMount: 'always' as const,
    });
}

export function useCreateEnvironmentAssessment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => pb.collection('farm_environment_assessments').create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['environment-assessments'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useUpdateEnvironmentAssessment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('farm_environment_assessments').update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['environment-assessments'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useDeleteEnvironmentAssessment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (id: string) => pb.collection('farm_environment_assessments').delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['environment-assessments'] });
            toast.success(t('deleted'));
        },
        onError: () => toast.error(t('error')),
    });
}

// ── Production Records (Farmer Annual Data) ──

export function useProductionRecords(country: string, search: string, filters: Record<string, string>, page: number) {
    return useQuery({
        queryKey: ['production-records', country, search, filters, page],
        queryFn: () => {
            const parts: string[] = [`country = "${country}"`];
            if (search) parts.push(`(notes ~ "${search}")`);
            if (filters.year && filters.year !== 'all') parts.push(`year = ${filters.year}`);
            if (filters.farmer && filters.farmer !== 'all') parts.push(`farmer = "${filters.farmer}"`);
            return pb.collection('farmer_annual_data').getList(page, 50, {
                filter: parts.join(' && '),
                sort: '-year',
                expand: 'farmer',
            });
        },
        staleTime: 0,
        refetchOnMount: 'always' as const,
    });
}

export function useCreateProductionRecord() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => pb.collection('farmer_annual_data').create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['production-records'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useUpdateProductionRecord() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('farmer_annual_data').update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['production-records'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useDeleteProductionRecord() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (id: string) => pb.collection('farmer_annual_data').delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['production-records'] });
            toast.success(t('deleted'));
        },
        onError: () => toast.error(t('error')),
    });
}

// ── Farm Operations Stats ──

export function useFarmOpsStats(country: string) {
    return useQuery({
        queryKey: ['farm-ops-stats', country],
        queryFn: async () => {
            const filter = `country = "${country}"`;
            const [inputs, envAssess, annual] = await Promise.all([
                pb.collection('farm_inputs').getList(1, 1, { filter }),
                pb.collection('farm_environment_assessments').getList(1, 1, { filter }),
                pb.collection('farmer_annual_data').getList(1, 1, { filter }),
            ]);
            return {
                farmInputs: inputs.totalItems,
                envAssessments: envAssess.totalItems,
                productionRecords: annual.totalItems,
            };
        },
        staleTime: 30000,
    });
}

// ── Ecosystem Assessments ──

export function useEcosystemAssessments(country: string, search: string, filters: Record<string, string>, page: number) {
    return useQuery({
        queryKey: ['ecosystem-assessments', country, search, filters, page],
        queryFn: () => {
            const parts: string[] = [`country = "${country}"`];
            if (search) parts.push(`(tree_species_list ~ "${search}" || wildlife_observed ~ "${search}")`);
            if (filters.biodiversity_rating && filters.biodiversity_rating !== 'all') parts.push(`biodiversity_rating = "${filters.biodiversity_rating}"`);
            if (filters.farm && filters.farm !== 'all') parts.push(`farm = "${filters.farm}"`);
            return pb.collection('ecosystem_assessments').getList(page, 50, {
                filter: parts.join(' && '),
                sort: '-assessment_date',
                expand: 'farm',
            });
        },
        staleTime: 0,
        refetchOnMount: 'always' as const,
    });
}

export function useCreateEcosystemAssessment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => pb.collection('ecosystem_assessments').create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ecosystem-assessments'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useUpdateEcosystemAssessment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('ecosystem_assessments').update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ecosystem-assessments'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useDeleteEcosystemAssessment() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (id: string) => pb.collection('ecosystem_assessments').delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ecosystem-assessments'] });
            toast.success(t('deleted'));
        },
        onError: () => toast.error(t('error')),
    });
}

// ── Compliance Records ──

export function useComplianceRecords(country: string, search: string, filters: Record<string, string>, page: number) {
    return useQuery({
        queryKey: ['compliance-records', country, search, filters, page],
        queryFn: () => {
            const parts: string[] = [`country = "${country}"`];
            if (search) parts.push(`(non_compliance_record ~ "${search}" || protective_measures ~ "${search}")`);
            if (filters.contamination_risk_level && filters.contamination_risk_level !== 'all') parts.push(`contamination_risk_level = "${filters.contamination_risk_level}"`);
            if (filters.year && filters.year !== 'all') parts.push(`year = ${filters.year}`);
            if (filters.farmer && filters.farmer !== 'all') parts.push(`farmer = "${filters.farmer}"`);
            return pb.collection('compliance_records').getList(page, 50, {
                filter: parts.join(' && '),
                sort: '-year',
                expand: 'farmer,farm',
            });
        },
        staleTime: 0,
        refetchOnMount: 'always' as const,
    });
}

export function useCreateComplianceRecord() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => pb.collection('compliance_records').create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['compliance-records'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useUpdateComplianceRecord() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('compliance_records').update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['compliance-records'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useDeleteComplianceRecord() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (id: string) => pb.collection('compliance_records').delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['compliance-records'] });
            toast.success(t('deleted'));
        },
        onError: () => toast.error(t('error')),
    });
}

// ── GHG Emissions ──

export function useGHGEmissions(country: string, search: string, filters: Record<string, string>, page: number) {
    return useQuery({
        queryKey: ['ghg-emissions', country, search, filters, page],
        queryFn: () => {
            const parts: string[] = [`country = "${country}"`];
            if (search) parts.push(`(notes ~ "${search}")`);
            if (filters.year && filters.year !== 'all') parts.push(`year = ${filters.year}`);
            if (filters.farmer && filters.farmer !== 'all') parts.push(`farmer = "${filters.farmer}"`);
            return pb.collection('ghg_emissions').getList(page, 50, {
                filter: parts.join(' && '),
                sort: '-year',
                expand: 'farmer',
            });
        },
        staleTime: 0,
        refetchOnMount: 'always' as const,
    });
}

export function useCreateGHGEmission() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => pb.collection('ghg_emissions').create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ghg-emissions'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useUpdateGHGEmission() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => pb.collection('ghg_emissions').update(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ghg-emissions'] });
            toast.success(t('saved'));
        },
        onError: () => toast.error(t('error')),
    });
}

export function useDeleteGHGEmission() {
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    return useMutation({
        mutationFn: (id: string) => pb.collection('ghg_emissions').delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ghg-emissions'] });
            toast.success(t('deleted'));
        },
        onError: () => toast.error(t('error')),
    });
}

// ── Do No Harm Stats ──

export function useDoNoHarmStats(country: string) {
    return useQuery({
        queryKey: ['do-no-harm-stats', country],
        queryFn: async () => {
            const filter = `country = "${country}"`;
            const [compliance, ecosystem] = await Promise.all([
                pb.collection('compliance_records').getList(1, 1, { filter }),
                pb.collection('ecosystem_assessments').getList(1, 1, { filter }),
            ]);
            return {
                complianceRecords: compliance.totalItems,
                ecosystemAssessments: ecosystem.totalItems,
            };
        },
        staleTime: 30000,
    });
}

// ── GHG Stats ──

export function useGHGStats(country: string) {
    return useQuery({
        queryKey: ['ghg-stats', country],
        queryFn: async () => {
            const filter = `country = "${country}"`;
            const list = await pb.collection('ghg_emissions').getFullList({ filter, fields: 'total_emissions_tco2e,year' });
            const totalRecords = list.length;
            const totalEmissions = list.reduce((sum, r) => sum + (r.total_emissions_tco2e || 0), 0);
            const years = new Set(list.map(r => r.year));
            return {
                totalRecords,
                totalEmissions: Math.round(totalEmissions * 100) / 100,
                yearsTracked: years.size,
            };
        },
        staleTime: 30000,
    });
}

// ── Helpers ──

export function useFarmsList(country: string) {
    return useQuery({
        queryKey: ['farms-list', country],
        queryFn: () => pb.collection('farms').getFullList({
            filter: `country = "${country}"`,
            sort: 'farm_name',
            fields: 'id,farm_name,farm_code',
        }),
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
