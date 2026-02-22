import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to generate PocketBase country filters based on the current user's country.
 *
 * Server-side API rules (migration 015) are the true enforcement layer.
 * This hook is a frontend convenience to avoid unnecessary requests
 * that would return empty results for country-mismatched data.
 */
export function useCountryFilter() {
  const { user } = useAuth();

  /** Returns a PB filter string for the user's country, or empty for global/superadmin */
  const getCountryFilter = (): string => {
    if (!user) return '';
    if (user.country === 'global') return '';
    return `country = "${user.country}"`;
  };

  /** Appends country filter to an existing PB filter string */
  const appendCountryFilter = (existingFilter: string): string => {
    const countryFilter = getCountryFilter();
    if (!countryFilter) return existingFilter;
    if (!existingFilter) return countryFilter;
    return `(${existingFilter}) && ${countryFilter}`;
  };

  return {
    getCountryFilter,
    appendCountryFilter,
    userCountry: user?.country ?? null,
    isGlobalUser: user?.country === 'global',
  };
}
