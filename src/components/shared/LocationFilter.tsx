import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import pb from '@/config/pocketbase';

interface LocationFilterProps {
  country: string;
  onFilterChange: (filters: { province: string; district: string; village: string }) => void;
}

interface LocationRecord {
  province: string;
  district: string;
  village: string;
}

export default function LocationFilter({ country, onFilterChange }: LocationFilterProps) {
  const { t } = useTranslation('common');
  const [province, setProvince] = useState('all');
  const [district, setDistrict] = useState('all');
  const [village, setVillage] = useState('all');

  // Map country name to country_code used in admin_locations
  const countryCode = country === 'laos' ? 'LA' : country === 'vietnam' ? 'VN' : country === 'indonesia' ? 'ID' : country.toUpperCase().slice(0, 2);

  const { data: locations } = useQuery({
    queryKey: ['admin-locations', countryCode],
    queryFn: () => pb.collection('admin_locations').getFullList<LocationRecord>({
      filter: `country_code = "${countryCode}"`,
      fields: 'province,district,village',
      sort: 'province,district,village',
    }),
    staleTime: 5 * 60 * 1000,
  });

  const provinces = useMemo(() => {
    if (!locations) return [];
    return [...new Set(locations.map(l => l.province).filter(Boolean))].sort();
  }, [locations]);

  const districts = useMemo(() => {
    if (!locations || province === 'all') return [];
    return [...new Set(locations.filter(l => l.province === province).map(l => l.district).filter(Boolean))].sort();
  }, [locations, province]);

  const villages = useMemo(() => {
    if (!locations || district === 'all') return [];
    return [...new Set(locations.filter(l => l.province === province && l.district === district).map(l => l.village).filter(Boolean))].sort();
  }, [locations, province, district]);

  useEffect(() => {
    onFilterChange({ province, district, village });
  }, [province, district, village]);

  const handleProvince = (v: string) => {
    setProvince(v);
    setDistrict('all');
    setVillage('all');
  };

  const handleDistrict = (v: string) => {
    setDistrict(v);
    setVillage('all');
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Select value={province} onValueChange={handleProvince}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder={t('province', 'Province')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all')}</SelectItem>
          {provinces.map(p => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {province !== 'all' && districts.length > 0 && (
        <Select value={district} onValueChange={handleDistrict}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t('district', 'District')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {districts.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {district !== 'all' && villages.length > 0 && (
        <Select value={village} onValueChange={setVillage}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t('village', 'Village')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {villages.map(v => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
