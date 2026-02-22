import { z } from 'zod/v4';

export const harvestSchema = z.object({
  farm: z.string().min(1, 'Farm is required'),
  farmer: z.string().min(1, 'Farmer is required'),
  country: z.enum(['laos', 'indonesia', 'vietnam']),
  crop_type: z.enum(['coffee_cherry', 'coffee_parchment', 'cacao_wet', 'cacao_dry', 'other']).optional().default('coffee_cherry'),
  variety: z.string().optional().default(''),
  season: z.string().optional().default(''),
  harvest_date: z.string().min(1, 'Harvest date is required'),
  quantity_kg: z.number().min(0).optional().default(0),
  moisture_pct: z.number().min(0).max(100).optional().default(0),
  quality_grade: z.enum(['A', 'B', 'C', 'reject']).optional().default('A'),
  processing_method: z.enum(['wet', 'dry', 'honey', 'natural', 'washed', 'semi_washed', 'other']).optional().default('washed'),
  price_per_kg: z.number().min(0).optional().default(0),
  currency: z.string().optional().default('USD'),
  buyer: z.string().optional().default(''),
  lot_number: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

export type HarvestFormData = z.infer<typeof harvestSchema>;
