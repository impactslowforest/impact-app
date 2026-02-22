import { z } from 'zod/v4';

export const cooperativeSchema = z.object({
  coop_code: z.string().min(1, 'Cooperative code is required'),
  name: z.string().min(1, 'Name is required'),
  country: z.enum(['laos', 'indonesia', 'vietnam']),
  province: z.string().optional().default(''),
  district: z.string().optional().default(''),
  village: z.string().optional().default(''),
  address: z.string().optional().default(''),
  latitude: z.number().optional().default(0),
  longitude: z.number().optional().default(0),
  leader_name: z.string().optional().default(''),
  leader_phone: z.string().optional().default(''),
  member_count: z.number().int().min(0).optional().default(0),
  commodity: z.enum(['coffee', 'cacao', 'other']).optional().default('coffee'),
  certification_status: z.enum(['none', 'organic', 'fair_trade', 'rainforest', 'multiple']).optional().default('none'),
  notes: z.string().optional().default(''),
  is_active: z.boolean().optional().default(true),
});

export type CooperativeFormData = z.infer<typeof cooperativeSchema>;
