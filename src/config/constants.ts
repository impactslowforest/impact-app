export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Impact - Slow Forest';

export const LOGO_URL = 'https://raw.githubusercontent.com/impactslowforest/Logo/refs/heads/main/Slow_logo_C1.png';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'lo', name: 'ພາສາລາວ', flag: '🇱🇦' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
] as const;

export const COUNTRIES = [
  { code: 'global', name: 'Global', color: 'bg-blue-500' },
  { code: 'indonesia', name: 'Indonesia', color: 'bg-red-500' },
  { code: 'vietnam', name: 'Vietnam', color: 'bg-yellow-500' },
  { code: 'laos', name: 'Laos', color: 'bg-green-500' },
] as const;

export type CountryCode = typeof COUNTRIES[number]['code'];
export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const FEATURE_FLAGS = {
  SHOW_MAP: true,
} as const;

export const DEPARTMENTS = [
  'impact_team',
  'manager',
  'operation',
  'daycare_center',
  'manager_up',
] as const;

export const POSITIONS = [
  'manager',
  'country_director',
  'accountant',
  'technical_staff',
  'field_officer',
  'farm_manager',
  'teacher',
  'warehouse_manager',
  'impact_manager',
  'supervision_manager',
] as const;
