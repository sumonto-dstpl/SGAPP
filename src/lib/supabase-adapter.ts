/**
 * Supabase adapter — active when the app runs in a plain browser (web preview).
 *
 * Provides the same DatabaseAdapter interface as the SQLite adapter so the
 * DataContext has no knowledge of which backend is in use.
 */

import { supabase, MarketRow, ShopRow, GarageRow, PaymentRow, BackupRow } from './supabase';
import { Market, Shop, Garage, Payment, BackupRecord } from '../types';
import { DatabaseAdapter, AllData } from './database';

// ─── Row → Type mappers ───────────────────────────────────────────────────────

function mapMarket(r: MarketRow): Market {
  return { id: r.id, name: r.name, phoneNumber: r.phone_number, monthlyRent: r.monthly_rent, address: r.address ?? undefined, createdAt: r.created_at };
}
function mapShop(r: ShopRow): Shop {
  return { id: r.id, marketId: r.market_id, shopName: r.shop_name, tenantName: r.tenant_name, phoneNumber: r.phone_number, monthlyRent: r.monthly_rent, paidRent: r.paid_rent, currentDue: r.current_due, dueDate: r.due_date, paymentStatus: r.payment_status, shopType: r.shop_type, startDate: r.start_date, endDate: r.end_date };
}
function mapGarage(r: GarageRow): Garage {
  return { id: r.id, garageNo: r.garage_no, ownerName: r.owner_name, mobileNumber: r.mobile_number, vehicleNumber: r.vehicle_number, vehicleType: r.vehicle_type, monthlyRent: r.monthly_rent, paymentStatus: r.payment_status, currentDue: r.current_due, leaseEndDate: r.lease_end_date, leaseType: r.lease_type, address: r.address ?? undefined, startDate: r.start_date };
}
function mapPayment(r: PaymentRow): Payment {
  return { id: r.id, date: r.payment_date, name: r.name, type: r.payment_type, amount: r.amount, reference: r.reference };
}
function mapBackup(r: BackupRow): BackupRecord {
  return { id: r.id, name: r.name, description: r.description, type: r.backup_type, createdAt: r.created_at_label, size: r.size_label, createdBy: r.created_by };
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

export const supabaseAdapter: DatabaseAdapter = {
  async loadAll(): Promise<AllData> {
    const [mRes, sRes, gRes, pRes, bRes] = await Promise.all([
      supabase.from('markets').select('*').order('name'),
      supabase.from('shops').select('*').order('shop_name'),
      supabase.from('garages').select('*').order('garage_no'),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('backups').select('*').order('created_at', { ascending: false }),
    ]);
    if (mRes.error) throw mRes.error;
    if (sRes.error) throw sRes.error;
    if (gRes.error) throw gRes.error;
    if (pRes.error) throw pRes.error;
    if (bRes.error) throw bRes.error;
    return {
      markets: (mRes.data as MarketRow[]).map(mapMarket),
      shops:   (sRes.data as ShopRow[]).map(mapShop),
      garages: (gRes.data as GarageRow[]).map(mapGarage),
      payments: (pRes.data as PaymentRow[]).map(mapPayment),
      backups: (bRes.data as BackupRow[]).map(mapBackup),
    };
  },

  // ── Markets ─────────────────────────────────────────────────────────────────
  async addMarket(data): Promise<Market> {
    const { data: row, error } = await supabase.from('markets').insert({
      name: data.name, phone_number: data.phoneNumber,
      monthly_rent: data.monthlyRent, address: data.address ?? null,
    }).select().single();
    if (error) throw error;
    return mapMarket(row as MarketRow);
  },

  async updateMarket(id, patch): Promise<Market> {
    const p: Partial<MarketRow> = {};
    if (patch.name        !== undefined) p.name          = patch.name;
    if (patch.phoneNumber !== undefined) p.phone_number  = patch.phoneNumber;
    if (patch.monthlyRent !== undefined) p.monthly_rent  = patch.monthlyRent;
    if (patch.address     !== undefined) p.address       = patch.address ?? null;
    const { data: row, error } = await supabase.from('markets').update(p).eq('id', id).select().single();
    if (error) throw error;
    return mapMarket(row as MarketRow);
  },

  async deleteMarket(id): Promise<void> {
    const { error } = await supabase.from('markets').delete().eq('id', id);
    if (error) throw error;
  },

  // ── Shops ───────────────────────────────────────────────────────────────────
  async addShop(data): Promise<Shop> {
    const { data: row, error } = await supabase.from('shops').insert({
      market_id: data.marketId, shop_name: data.shopName, tenant_name: data.tenantName,
      phone_number: data.phoneNumber, monthly_rent: data.monthlyRent, paid_rent: data.paidRent,
      current_due: data.currentDue, due_date: data.dueDate, payment_status: data.paymentStatus,
      shop_type: data.shopType, start_date: data.startDate, end_date: data.endDate,
    }).select().single();
    if (error) throw error;
    return mapShop(row as ShopRow);
  },

  async updateShop(id, patch): Promise<Shop> {
    const p: Record<string, unknown> = {};
    if (patch.shopName      !== undefined) p.shop_name      = patch.shopName;
    if (patch.tenantName    !== undefined) p.tenant_name    = patch.tenantName;
    if (patch.phoneNumber   !== undefined) p.phone_number   = patch.phoneNumber;
    if (patch.monthlyRent   !== undefined) p.monthly_rent   = patch.monthlyRent;
    if (patch.paidRent      !== undefined) p.paid_rent      = patch.paidRent;
    if (patch.currentDue    !== undefined) p.current_due    = patch.currentDue;
    if (patch.dueDate       !== undefined) p.due_date       = patch.dueDate;
    if (patch.paymentStatus !== undefined) p.payment_status = patch.paymentStatus;
    if (patch.shopType      !== undefined) p.shop_type      = patch.shopType;
    if (patch.startDate     !== undefined) p.start_date     = patch.startDate;
    if (patch.endDate       !== undefined) p.end_date       = patch.endDate;
    const { data: row, error } = await supabase.from('shops').update(p).eq('id', id).select().single();
    if (error) throw error;
    return mapShop(row as ShopRow);
  },

  async deleteShop(id): Promise<void> {
    const { error } = await supabase.from('shops').delete().eq('id', id);
    if (error) throw error;
  },

  // ── Garages ─────────────────────────────────────────────────────────────────
  async addGarage(data): Promise<Garage> {
    const { data: row, error } = await supabase.from('garages').insert({
      garage_no: data.garageNo, owner_name: data.ownerName, mobile_number: data.mobileNumber,
      vehicle_number: data.vehicleNumber, vehicle_type: data.vehicleType,
      monthly_rent: data.monthlyRent, payment_status: data.paymentStatus,
      current_due: data.currentDue, lease_end_date: data.leaseEndDate,
      lease_type: data.leaseType, address: data.address ?? null, start_date: data.startDate,
    }).select().single();
    if (error) throw error;
    return mapGarage(row as GarageRow);
  },

  async updateGarage(id, patch): Promise<Garage> {
    const p: Record<string, unknown> = {};
    if (patch.ownerName    !== undefined) p.owner_name     = patch.ownerName;
    if (patch.mobileNumber !== undefined) p.mobile_number  = patch.mobileNumber;
    if (patch.vehicleNumber!== undefined) p.vehicle_number = patch.vehicleNumber;
    if (patch.vehicleType  !== undefined) p.vehicle_type   = patch.vehicleType;
    if (patch.monthlyRent  !== undefined) p.monthly_rent   = patch.monthlyRent;
    if (patch.paymentStatus!== undefined) p.payment_status = patch.paymentStatus;
    if (patch.currentDue   !== undefined) p.current_due    = patch.currentDue;
    if (patch.leaseEndDate !== undefined) p.lease_end_date = patch.leaseEndDate;
    if (patch.leaseType    !== undefined) p.lease_type     = patch.leaseType;
    if (patch.address      !== undefined) p.address        = patch.address ?? null;
    if (patch.startDate    !== undefined) p.start_date     = patch.startDate;
    const { data: row, error } = await supabase.from('garages').update(p).eq('id', id).select().single();
    if (error) throw error;
    return mapGarage(row as GarageRow);
  },

  async deleteGarage(id): Promise<void> {
    const { error } = await supabase.from('garages').delete().eq('id', id);
    if (error) throw error;
  },

  // ── Payments ─────────────────────────────────────────────────────────────────
  async addPayment(data): Promise<Payment> {
    const { data: row, error } = await supabase.from('payments').insert({
      payment_date: data.date, name: data.name, payment_type: data.type,
      amount: data.amount, reference: data.reference,
    }).select().single();
    if (error) throw error;
    return mapPayment(row as PaymentRow);
  },

  // ── Backups ───────────────────────────────────────────────────────────────────
  async addBackup(data): Promise<BackupRecord> {
    const { data: row, error } = await supabase.from('backups').insert({
      name: data.name, description: data.description, backup_type: data.type,
      created_at_label: data.createdAt, size_label: data.size, created_by: data.createdBy,
    }).select().single();
    if (error) throw error;
    return mapBackup(row as BackupRow);
  },

  async deleteBackup(id): Promise<void> {
    const { error } = await supabase.from('backups').delete().eq('id', id);
    if (error) throw error;
  },
};
