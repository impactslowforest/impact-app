import { z } from 'zod/v4';

export const farmerSchema = z.object({
  farmer_code: z.string().min(1, 'Farmer code is required'),
  cooperative: z.string().optional().default(''),
  country: z.enum(['laos', 'indonesia', 'vietnam']),
  full_name: z.string().min(1, 'Full name is required'),
  gender: z.enum(['male', 'female', 'other']).optional().default('male'),
  date_of_birth: z.string().optional().default(''),
  id_card_number: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  village: z.string().optional().default(''),
  district: z.string().optional().default(''),
  province: z.string().optional().default(''),
  address: z.string().optional().default(''),
  household_size: z.number().int().min(0).optional().default(0),
  education_level: z.enum(['none', 'primary', 'secondary', 'high_school', 'vocational', 'university']).optional().default('none'),
  farm_size_ha: z.number().min(0).optional().default(0),
  latitude: z.number().optional().default(0),
  longitude: z.number().optional().default(0),
  certification_status: z.enum(['none', 'organic', 'transitional', 'fair_trade', 'multiple']).optional().default('none'),
  registration_date: z.string().optional().default(''),
  is_active: z.boolean().optional().default(true),
});

export type FarmerFormData = z.infer<typeof farmerSchema>;
