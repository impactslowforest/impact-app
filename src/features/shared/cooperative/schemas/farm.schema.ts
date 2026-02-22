import { z } from 'zod/v4';

export const farmSchema = z.object({
  farm_code: z.string().min(1, 'Farm code is required'),
  farmer: z.string().min(1, 'Farmer is required'),
  country: z.enum(['laos', 'indonesia', 'vietnam']),
  farm_name: z.string().min(1, 'Farm name is required'),
  area_ha: z.number().min(0).optional().default(0),
  latitude: z.number().optional().default(0),
  longitude: z.number().optional().default(0),
  elevation_m: z.number().min(0).optional().default(0),
  commodity: z.enum(['coffee', 'cacao', 'other']).optional().default('coffee'),
  production_system: z.enum(['monoculture', 'intercropping', 'agroforestry', 'mixed']).optional().default('agroforestry'),
  certification_status: z.enum(['none', 'organic', 'transitional', 'conventional']).optional().default('none'),
  coffee_trees_count: z.number().int().min(0).optional().default(0),
  shade_trees_count: z.number().int().min(0).optional().default(0),
  soil_type: z.string().optional().default(''),
  village: z.string().optional().default(''),
  district: z.string().optional().default(''),
  province: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  is_active: z.boolean().optional().default(true),
});

export type FarmFormData = z.infer<typeof farmSchema>;
