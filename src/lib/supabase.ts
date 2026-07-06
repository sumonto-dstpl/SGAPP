import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Row types returned by Supabase ─────────────────────────────────────────
export interface MarketRow {
  id: string;
  name: string;
  phone_number: string;
  monthly_rent: number;
  address: string | null;
  created_at: string;
}

export interface ShopRow {
  id: string;
  market_id: string;
  shop_name: string;
  tenant_name: string;
  phone_number: string;
  monthly_rent: number;
  paid_rent: number;
  current_due: number;
  due_date: string;
  payment_status: 'Paid' | 'Due';
  shop_type: 'Rented' | 'Leased';
  start_date: string;
  end_date: string;
}

export interface GarageRow {
  id: string;
  garage_no: string;
  owner_name: string;
  mobile_number: string;
  vehicle_number: string;
  vehicle_type: 'Car' | 'Bike' | 'Truck' | 'Other';
  monthly_rent: number;
  payment_status: 'Paid' | 'Due';
  current_due: number;
  lease_end_date: string;
  lease_type: 'Monthly' | 'Yearly' | 'Long-term';
  address: string | null;
  start_date: string;
}

export interface PaymentRow {
  id: string;
  payment_date: string;
  name: string;
  payment_type: 'Shop' | 'Garage';
  amount: number;
  reference: string;
  created_at: string;
}

export interface BackupRow {
  id: string;
  name: string;
  description: string;
  backup_type: 'Full Backup' | 'Incremental';
  created_at_label: string;
  size_label: string;
  created_by: string;
  created_at: string;
}
