import type { RecordModel } from 'pocketbase';

export interface User extends RecordModel {
  name: string;
  email: string;
  avatar: string;
  phone: string;
  country: 'laos' | 'indonesia' | 'vietnam' | 'global';
  department: string;
  designation: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  approved_by: string;
  approved_at: string;
  role: string;
  language_pref: 'en' | 'vi' | 'lo' | 'id';
  last_login: string;
  permissions?: string[];
}

export interface Role extends RecordModel {
  name: string;
  display_name: Record<string, string>;
  description: string;
  country: 'laos' | 'indonesia' | 'vietnam' | 'global' | 'all';
  is_system: boolean;
  permissions: string[];
}

export interface Permission extends RecordModel {
  name: string;
  module: string;
  action: string;
  description: string;
  country_scope: 'laos' | 'indonesia' | 'vietnam' | 'global' | 'all';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone?: string;
  country: string;
  department?: string;
  designation?: string;
  language_pref?: string;
}
