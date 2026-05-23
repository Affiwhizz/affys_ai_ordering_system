-- =============================================================================
-- Affy's — Promo code manager upgrade (run once)
-- =============================================================================
-- Adds per-customer abuse controls to promo_codes and a promo_redemptions table
-- that remembers who redeemed each code (phone + email + device), so "single-use
-- per customer" codes can be enforced now — before the full orders table exists.
--
-- Additive + idempotent. Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

-- ---- promo_codes: new abuse-control columns -------------------------------
-- per_customer_limit: how many times ONE customer (phone/email/device) may use
--   this code. NULL = unlimited per customer. 1 = classic single-use.
alter table promo_codes add column if not exists per_customer_limit integer;
-- first_order_only: code only valid for customers with no prior redemption here.
alter table promo_codes add column if not exists first_order_only boolean not null default false;

-- ---- promo_redemptions: the redemption ledger -----------------------------
create table if not exists promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  code citext not null,
  promo_id uuid references promo_codes(id) on delete set null,
  phone text,
  email citext,
  device_id text,
  order_subtotal numeric(10, 2),
  discount numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_promo_redemptions_code   on promo_redemptions(code);
create index if not exists idx_promo_redemptions_phone  on promo_redemptions(phone);
create index if not exists idx_promo_redemptions_email  on promo_redemptions(email);
create index if not exists idx_promo_redemptions_device on promo_redemptions(device_id);

-- ---- RLS ------------------------------------------------------------------
alter table promo_redemptions enable row level security;

-- Staff can read/manage redemptions in the admin. Validation + inserts during
-- checkout happen server-side via the service-role client (bypasses RLS), so no
-- anon insert policy is needed (and we don't want to expose one publicly).
drop policy if exists promo_redemptions_staff_all on promo_redemptions;
create policy promo_redemptions_staff_all on promo_redemptions
  for all using (is_staff()) with check (is_staff());
