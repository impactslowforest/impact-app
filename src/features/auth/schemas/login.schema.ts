import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string().min(8, 'Confirm your password'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  department: z.string().optional(),
  designation: z.string().optional(),
  language_pref: z.string().optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
