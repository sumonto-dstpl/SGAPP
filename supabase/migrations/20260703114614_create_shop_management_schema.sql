/*
# Property & Garage Management System — Full Schema

## Overview
Creates all tables required for the Property & Garage Management System:
markets, shops, garages, payments, and backups. This is a single-tenant
desktop application with no user authentication, so all policies grant
access to both anon and authenticated roles.

## Tables

### 1. markets
Represents individual market complexes/buildings that contain shops.
- id: UUID primary key
- name: Market display name (e.g. "Market A")
- phone_number: Contact phone number
- monthly_rent: Base monthly rent in INR
- address: Physical address (optional)
- created_at: Record creation timestamp

### 2. shops
Represents individual shop units within a market.
- id: UUID primary key
- market_id: Foreign key → markets.id (cascade delete)
- shop_name: Shop identifier (e.g. "Shop A-01")
- tenant_name: Name of the tenant/renter
- phone_number: Tenant phone number
- monthly_rent: Monthly rent amount in INR
- paid_rent: Amount paid this cycle
- current_due: Outstanding amount due
- due_date: Date by which rent is due
- payment_status: 'Paid' or 'Due'
- shop_type: 'Rented' or 'Leased'
- start_date: Lease/rental start date
- end_date: Lease/rental end date

### 3. garages
Represents individual garage units for vehicle parking.
- id: UUID primary key
- garage_no: Garage identifier (e.g. "G-01")
- owner_name: Name of the garage occupant
- mobile_number: Contact mobile number
- vehicle_number: Vehicle registration number
- vehicle_type: 'Car', 'Bike', 'Truck', or 'Other'
- monthly_rent: Monthly rent amount in INR
- payment_status: 'Paid' or 'Due'
- current_due: Outstanding amount due
- lease_end_date: When the lease expires
- lease_type: 'Monthly', 'Yearly', or 'Long-term'
- address: Optional address field
- start_date: Lease start date

### 4. payments
Records of rent payments collected from shops and garages.
- id: UUID primary key
- payment_date: Date payment was received
- name: Payer name with reference (e.g. "Mr. Roy (S-01)")
- payment_type: 'Shop' or 'Garage'
- amount: Payment amount in INR
- reference: Internal payment reference code

### 5. backups
Records of database backups (manual and automated).
- id: UUID primary key
- name: Backup file name
- description: Human-readable description
- backup_type: 'Full Backup' or 'Incremental'
- created_at_label: Display-friendly timestamp string
- size_label: Display-friendly size string (e.g. "25.4 MB")
- created_by: Who triggered the backup ('Admin' or 'System')
- created_at: Actual DB timestamp

## Security
- RLS enabled on all 5 tables.
- All policies grant TO anon, authenticated (single-tenant, no sign-in).
- USING (true) is intentional — this is a shared desktop app with no user isolation.

## Notes
1. All policies are dropped before recreating (idempotent).
2. Deleting a market cascades to delete all its shops.
3. Indexes added on market_id (shops) and payment_date (payments) for query performance.
*/

-- ────────────────────────────────────────────
-- MARKETS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS markets (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  phone_number text NOT NULL,
  monthly_rent integer NOT NULL DEFAULT 0,
  address      text,
  created_at   date NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE markets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_markets" ON markets;
CREATE POLICY "anon_select_markets" ON markets FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_markets" ON markets;
CREATE POLICY "anon_insert_markets" ON markets FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_markets" ON markets;
CREATE POLICY "anon_update_markets" ON markets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_markets" ON markets;
CREATE POLICY "anon_delete_markets" ON markets FOR DELETE TO anon, authenticated USING (true);

-- ────────────────────────────────────────────
-- SHOPS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shops (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id      uuid NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  shop_name      text NOT NULL,
  tenant_name    text NOT NULL,
  phone_number   text NOT NULL,
  monthly_rent   integer NOT NULL DEFAULT 0,
  paid_rent      integer NOT NULL DEFAULT 0,
  current_due    integer NOT NULL DEFAULT 0,
  due_date       text NOT NULL DEFAULT '',
  payment_status text NOT NULL DEFAULT 'Due' CHECK (payment_status IN ('Paid', 'Due')),
  shop_type      text NOT NULL DEFAULT 'Rented' CHECK (shop_type IN ('Rented', 'Leased')),
  start_date     text NOT NULL DEFAULT '',
  end_date       text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS shops_market_id_idx ON shops(market_id);
CREATE INDEX IF NOT EXISTS shops_payment_status_idx ON shops(payment_status);

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_shops" ON shops;
CREATE POLICY "anon_select_shops" ON shops FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_shops" ON shops;
CREATE POLICY "anon_insert_shops" ON shops FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_shops" ON shops;
CREATE POLICY "anon_update_shops" ON shops FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_shops" ON shops;
CREATE POLICY "anon_delete_shops" ON shops FOR DELETE TO anon, authenticated USING (true);

-- ────────────────────────────────────────────
-- GARAGES
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS garages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  garage_no      text NOT NULL UNIQUE,
  owner_name     text NOT NULL,
  mobile_number  text NOT NULL,
  vehicle_number text NOT NULL,
  vehicle_type   text NOT NULL DEFAULT 'Car' CHECK (vehicle_type IN ('Car', 'Bike', 'Truck', 'Other')),
  monthly_rent   integer NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Due' CHECK (payment_status IN ('Paid', 'Due')),
  current_due    integer NOT NULL DEFAULT 0,
  lease_end_date text NOT NULL DEFAULT '',
  lease_type     text NOT NULL DEFAULT 'Monthly' CHECK (lease_type IN ('Monthly', 'Yearly', 'Long-term')),
  address        text,
  start_date     text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS garages_payment_status_idx ON garages(payment_status);

ALTER TABLE garages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_garages" ON garages;
CREATE POLICY "anon_select_garages" ON garages FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_garages" ON garages;
CREATE POLICY "anon_insert_garages" ON garages FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_garages" ON garages;
CREATE POLICY "anon_update_garages" ON garages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_garages" ON garages;
CREATE POLICY "anon_delete_garages" ON garages FOR DELETE TO anon, authenticated USING (true);

-- ────────────────────────────────────────────
-- PAYMENTS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_date text NOT NULL,
  name         text NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('Shop', 'Garage')),
  amount       integer NOT NULL DEFAULT 0,
  reference    text NOT NULL DEFAULT '',
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_date_idx ON payments(payment_date DESC);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_payments" ON payments;
CREATE POLICY "anon_select_payments" ON payments FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_payments" ON payments;
CREATE POLICY "anon_insert_payments" ON payments FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_payments" ON payments;
CREATE POLICY "anon_update_payments" ON payments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_payments" ON payments;
CREATE POLICY "anon_delete_payments" ON payments FOR DELETE TO anon, authenticated USING (true);

-- ────────────────────────────────────────────
-- BACKUPS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS backups (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  description      text NOT NULL DEFAULT '',
  backup_type      text NOT NULL DEFAULT 'Full Backup' CHECK (backup_type IN ('Full Backup', 'Incremental')),
  created_at_label text NOT NULL DEFAULT '',
  size_label       text NOT NULL DEFAULT '',
  created_by       text NOT NULL DEFAULT 'Admin',
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_backups" ON backups;
CREATE POLICY "anon_select_backups" ON backups FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_backups" ON backups;
CREATE POLICY "anon_insert_backups" ON backups FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_backups" ON backups;
CREATE POLICY "anon_update_backups" ON backups FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_backups" ON backups;
CREATE POLICY "anon_delete_backups" ON backups FOR DELETE TO anon, authenticated USING (true);
