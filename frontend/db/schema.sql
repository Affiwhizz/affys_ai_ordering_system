-- =============================================================================
-- Affy's database schema (Supabase / PostgreSQL)
--
-- Run this once on a fresh Supabase project (SQL Editor → New query →
-- paste this file → Run).
--
-- After this, run db/seed.sql to populate the menu, delivery zones,
-- and default content blocks.
-- =============================================================================

-- Extensions ------------------------------------------------------------------
create extension if not exists "pgcrypto";  -- gen_random_uuid()
create extension if not exists "citext";    -- case-insensitive text for emails

-- =============================================================================
-- Shared helper: updated_at trigger function
-- =============================================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- Enums
-- =============================================================================

do $$ begin
  create type order_channel as enum ('udia', 'form', 'portimao');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'new', 'confirmed', 'paid', 'preparing', 'ready', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type fulfilment_kind as enum ('pickup', 'delivery');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('bank', 'stripe');
exception when duplicate_object then null; end $$;

do $$ begin
  create type catering_status as enum (
    'new', 'reviewing', 'quoted', 'confirmed', 'declined'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type slot_scope as enum ('daily', 'portimao');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_type as enum ('text', 'image', 'video', 'url', 'toggle');
exception when duplicate_object then null; end $$;

do $$ begin
  create type blog_status as enum ('draft', 'scheduled', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type staff_role as enum ('owner', 'admin', 'kitchen');
exception when duplicate_object then null; end $$;

do $$ begin
  create type promo_kind as enum ('percent', 'fixed', 'free_delivery');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_channel as enum ('email', 'whatsapp', 'sms');
exception when duplicate_object then null; end $$;

-- =============================================================================
-- Order short code sequence (AFF-1042 style)
-- =============================================================================

create sequence if not exists order_short_code_seq start 1042;

create or replace function next_order_short_code()
returns text language sql as $$
  select 'AFF-' || nextval('order_short_code_seq');
$$;

-- =============================================================================
-- staff_users (admin / owner / kitchen — linked to Supabase Auth)
-- =============================================================================

create table if not exists staff_users (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  phone_e164 text,
  role staff_role not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_staff_users_updated on staff_users;
create trigger trg_staff_users_updated before update on staff_users
  for each row execute function set_updated_at();

-- Helper function used in RLS policies
create or replace function is_staff()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from staff_users
    where id = auth.uid() and is_active = true
  );
$$;

create or replace function is_owner()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from staff_users
    where id = auth.uid() and is_active = true and role = 'owner'
  );
$$;

-- =============================================================================
-- customers
-- =============================================================================

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_e164 text unique not null,
  email citext unique,
  preferred_region text,
  preferred_municipality_key text,
  notes text,                            -- admin-only notes about this customer
  tags text[] not null default '{}',     -- e.g. {VIP, allergy-nuts}
  orders_count integer not null default 0,
  total_spend numeric(10, 2) not null default 0,
  last_order_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customers_phone on customers(phone_e164);
create index if not exists idx_customers_email on customers(email);

drop trigger if exists trg_customers_updated on customers;
create trigger trg_customers_updated before update on customers
  for each row execute function set_updated_at();

-- =============================================================================
-- menu_items + menu_variants (full daily ordering menu)
-- =============================================================================

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  name_pt text,
  description text,
  category text not null,
  monogram text,
  gradient text,
  allergens text[] not null default '{}',
  is_available boolean not null default true,
  sort_order integer not null default 0,
  image_url text,
  channel order_channel not null default 'form',  -- which checkout channel does this belong to
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_menu_items_category on menu_items(category);
create index if not exists idx_menu_items_channel on menu_items(channel);
create index if not exists idx_menu_items_available on menu_items(is_available);

drop trigger if exists trg_menu_items_updated on menu_items;
create trigger trg_menu_items_updated before update on menu_items
  for each row execute function set_updated_at();

create table if not exists menu_variants (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  size_label text not null,
  serves_label text,
  price numeric(10, 2) not null check (price >= 0),
  sort_order integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_menu_variants_item on menu_variants(menu_item_id);

-- =============================================================================
-- delivery_zones
-- =============================================================================

create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  region text not null,                  -- e.g. "Lisbon Metropolitan Area"
  municipality_key text unique not null, -- e.g. "lisboa", "amadora"
  municipality_name text not null,
  base_fee numeric(10, 2) not null check (base_fee >= 0),
  lead_time_days integer not null default 1,
  note text,
  is_available boolean not null default true,
  parishes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_delivery_zones_key on delivery_zones(municipality_key);

drop trigger if exists trg_delivery_zones_updated on delivery_zones;
create trigger trg_delivery_zones_updated before update on delivery_zones
  for each row execute function set_updated_at();

-- =============================================================================
-- availability_slots (calendar — toggle days/times per channel)
-- =============================================================================

create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  scope slot_scope not null,             -- 'daily' or 'portimao'
  slot_date date not null,
  time_slot text not null,               -- e.g. "13:00" or "afternoon"
  capacity integer not null default 80,
  booked integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scope, slot_date, time_slot)
);

create index if not exists idx_slots_scope_date on availability_slots(scope, slot_date);

drop trigger if exists trg_slots_updated on availability_slots;
create trigger trg_slots_updated before update on availability_slots
  for each row execute function set_updated_at();

-- =============================================================================
-- orders
-- =============================================================================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  short_code text unique not null default next_order_short_code(),
  customer_id uuid references customers(id) on delete set null,

  -- snapshot of customer at order time (in case they update their profile later)
  customer_name text not null,
  customer_phone_e164 text not null,
  customer_email citext,

  -- channel + status
  channel order_channel not null,
  status order_status not null default 'new',
  fulfilment fulfilment_kind not null,

  -- scheduling
  scheduled_for timestamptz,
  slot_id uuid references availability_slots(id) on delete set null,

  -- address (for delivery orders)
  delivery_region text,
  delivery_municipality_key text,
  delivery_parish text,
  delivery_street text,
  delivery_house_number text,
  delivery_floor text,
  delivery_postcode text,

  -- money
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0,
  takeout_bag_fee numeric(10, 2) not null default 0,
  promo_code text,
  promo_discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  currency text not null default 'EUR',

  -- payment
  payment_method payment_method,
  payment_status payment_status not null default 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  receipt_url text,                       -- supabase storage URL for bank transfer receipts
  paid_at timestamptz,
  refunded_at timestamptz,

  -- notes + tracking
  notes text,
  internal_notes text,                    -- admin-only
  allow_notifications boolean not null default true,
  public_token text unique not null default encode(gen_random_bytes(18), 'base64'),

  -- timestamps
  submitted_at timestamptz not null default now(),
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_short_code on orders(short_code);
create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_channel on orders(channel);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_submitted on orders(submitted_at desc);
create index if not exists idx_orders_scheduled on orders(scheduled_for);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_public_token on orders(public_token);

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();

-- =============================================================================
-- order_items
-- =============================================================================

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  menu_variant_id uuid references menu_variants(id) on delete set null,

  -- snapshot (in case the menu changes after the order is placed)
  name text not null,
  variant_label text,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null,
  notes text,

  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_order_items_menu on order_items(menu_item_id);

-- =============================================================================
-- catering_inquiries
-- =============================================================================

create table if not exists catering_inquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,

  -- snapshot
  customer_name text not null,
  customer_phone_e164 text not null,
  customer_email citext not null,

  event_type text not null,
  guest_count integer not null check (guest_count > 0),
  event_date date not null,
  location text not null,
  budget text,
  notes text,
  source text,                         -- e.g. 'instagram', 'word of mouth'

  status catering_status not null default 'new',
  quote_amount numeric(10, 2),
  quote_sent_at timestamptz,
  confirmed_at timestamptz,
  declined_reason text,

  internal_notes text,

  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_catering_status on catering_inquiries(status);
create index if not exists idx_catering_date on catering_inquiries(event_date);
create index if not exists idx_catering_submitted on catering_inquiries(submitted_at desc);

drop trigger if exists trg_catering_updated on catering_inquiries;
create trigger trg_catering_updated before update on catering_inquiries
  for each row execute function set_updated_at();

-- =============================================================================
-- content_blocks (homepage hero, this-week dishes, announcement banner,
-- Udia toggle, normal-ordering lock, etc.)
-- =============================================================================

create table if not exists content_blocks (
  key text primary key,
  label text not null,
  type content_type not null,
  value jsonb not null,
  description text,
  updated_by uuid references staff_users(id),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_content_updated on content_blocks;
create trigger trg_content_updated before update on content_blocks
  for each row execute function set_updated_at();

-- =============================================================================
-- blog_posts
-- =============================================================================

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body_markdown text,
  cover_image_url text,
  category text,
  read_minutes integer not null default 3,
  status blog_status not null default 'draft',
  author_id uuid references staff_users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_status on blog_posts(status);
create index if not exists idx_blog_published on blog_posts(published_at desc);
create index if not exists idx_blog_slug on blog_posts(slug);

drop trigger if exists trg_blog_updated on blog_posts;
create trigger trg_blog_updated before update on blog_posts
  for each row execute function set_updated_at();

-- =============================================================================
-- promo_codes
-- =============================================================================

create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  code citext unique not null,
  kind promo_kind not null,
  value numeric(10, 2) not null,         -- percent (e.g. 10), fixed EUR (e.g. 5), or 0 for free delivery
  description text,
  min_order numeric(10, 2),
  max_uses integer,
  used_count integer not null default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_promo_code on promo_codes(code);
create index if not exists idx_promo_active on promo_codes(is_active);

drop trigger if exists trg_promo_updated on promo_codes;
create trigger trg_promo_updated before update on promo_codes
  for each row execute function set_updated_at();

-- =============================================================================
-- cookie_consents (GDPR — store the user's choice)
-- =============================================================================

create table if not exists cookie_consents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  session_id text,
  essential boolean not null default true,
  analytics boolean not null default false,
  marketing boolean not null default false,
  version integer not null,
  user_agent text,
  ip_hash text,                          -- hashed IP (don't store raw IPs)
  decided_at timestamptz not null default now()
);

create index if not exists idx_consent_customer on cookie_consents(customer_id);
create index if not exists idx_consent_session on cookie_consents(session_id);

-- =============================================================================
-- notification_log (every email/WhatsApp/SMS we send)
-- =============================================================================

create table if not exists notification_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  catering_inquiry_id uuid references catering_inquiries(id) on delete cascade,
  channel notification_channel not null,
  event text not null,                   -- e.g. 'order_confirmed', 'order_ready'
  recipient text not null,               -- email or phone
  sent_at timestamptz not null default now(),
  status text not null default 'queued', -- queued, sent, delivered, failed
  error text
);

create index if not exists idx_notify_order on notification_log(order_id);
create index if not exists idx_notify_event on notification_log(event);

-- =============================================================================
-- admin_actions (audit log — who did what)
-- =============================================================================

create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid references staff_users(id),
  action text not null,                  -- e.g. 'order.refunded', 'menu_item.created'
  entity_type text,
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_actions_user on admin_actions(staff_user_id);
create index if not exists idx_actions_entity on admin_actions(entity_type, entity_id);
create index if not exists idx_actions_created on admin_actions(created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on every table
alter table staff_users        enable row level security;
alter table customers          enable row level security;
alter table menu_items         enable row level security;
alter table menu_variants      enable row level security;
alter table delivery_zones     enable row level security;
alter table availability_slots enable row level security;
alter table orders             enable row level security;
alter table order_items        enable row level security;
alter table catering_inquiries enable row level security;
alter table content_blocks     enable row level security;
alter table blog_posts         enable row level security;
alter table promo_codes        enable row level security;
alter table cookie_consents    enable row level security;
alter table notification_log   enable row level security;
alter table admin_actions      enable row level security;

-- staff_users: only owners can manage; everyone can read their own row
drop policy if exists staff_self_read on staff_users;
create policy staff_self_read on staff_users for select
  using (id = auth.uid() or is_owner());

drop policy if exists staff_owner_all on staff_users;
create policy staff_owner_all on staff_users for all
  using (is_owner()) with check (is_owner());

-- customers: staff only
drop policy if exists customers_staff_read on customers;
create policy customers_staff_read on customers for select using (is_staff());
drop policy if exists customers_staff_write on customers;
create policy customers_staff_write on customers for all using (is_staff()) with check (is_staff());

-- menu_items / variants: public read for available; staff full
drop policy if exists menu_public_read on menu_items;
create policy menu_public_read on menu_items for select using (is_available or is_staff());
drop policy if exists menu_staff_write on menu_items;
create policy menu_staff_write on menu_items for all using (is_staff()) with check (is_staff());

drop policy if exists menu_variants_public_read on menu_variants;
create policy menu_variants_public_read on menu_variants for select using (is_available or is_staff());
drop policy if exists menu_variants_staff_write on menu_variants;
create policy menu_variants_staff_write on menu_variants for all using (is_staff()) with check (is_staff());

-- delivery_zones: public read; staff write
drop policy if exists zones_public_read on delivery_zones;
create policy zones_public_read on delivery_zones for select using (true);
drop policy if exists zones_staff_write on delivery_zones;
create policy zones_staff_write on delivery_zones for all using (is_staff()) with check (is_staff());

-- availability_slots: public read for available; staff write
drop policy if exists slots_public_read on availability_slots;
create policy slots_public_read on availability_slots for select using (is_available or is_staff());
drop policy if exists slots_staff_write on availability_slots;
create policy slots_staff_write on availability_slots for all using (is_staff()) with check (is_staff());

-- orders:
--   - Anonymous can INSERT (a new order). The receipt route writes via service role.
--   - Customer can read via their public_token (handled server-side, not via RLS).
--   - Staff can read + write all.
drop policy if exists orders_anon_insert on orders;
create policy orders_anon_insert on orders for insert with check (true);
drop policy if exists orders_staff_all on orders;
create policy orders_staff_all on orders for all using (is_staff()) with check (is_staff());

-- order_items: anonymous insert (during checkout); staff read/write
drop policy if exists items_anon_insert on order_items;
create policy items_anon_insert on order_items for insert with check (true);
drop policy if exists items_staff_all on order_items;
create policy items_staff_all on order_items for all using (is_staff()) with check (is_staff());

-- catering_inquiries: anon insert; staff manage
drop policy if exists catering_anon_insert on catering_inquiries;
create policy catering_anon_insert on catering_inquiries for insert with check (true);
drop policy if exists catering_staff_all on catering_inquiries;
create policy catering_staff_all on catering_inquiries for all using (is_staff()) with check (is_staff());

-- content_blocks: public read; staff write
drop policy if exists content_public_read on content_blocks;
create policy content_public_read on content_blocks for select using (true);
drop policy if exists content_staff_write on content_blocks;
create policy content_staff_write on content_blocks for all using (is_staff()) with check (is_staff());

-- blog_posts: public read for published; staff full
drop policy if exists blog_public_read on blog_posts;
create policy blog_public_read on blog_posts for select using (status = 'published' or is_staff());
drop policy if exists blog_staff_write on blog_posts;
create policy blog_staff_write on blog_posts for all using (is_staff()) with check (is_staff());

-- promo_codes: staff only (validation happens server-side via service role)
drop policy if exists promo_staff_all on promo_codes;
create policy promo_staff_all on promo_codes for all using (is_staff()) with check (is_staff());

-- cookie_consents: anon insert; staff read
drop policy if exists consents_anon_insert on cookie_consents;
create policy consents_anon_insert on cookie_consents for insert with check (true);
drop policy if exists consents_staff_read on cookie_consents;
create policy consents_staff_read on cookie_consents for select using (is_staff());

-- notification_log: staff only
drop policy if exists notify_staff_all on notification_log;
create policy notify_staff_all on notification_log for all using (is_staff()) with check (is_staff());

-- admin_actions: staff read; system writes via service role
drop policy if exists actions_staff_read on admin_actions;
create policy actions_staff_read on admin_actions for select using (is_staff());

-- =============================================================================
-- Done.
-- Next: run db/seed.sql to populate menu, delivery zones, and content blocks.
-- Then: create storage buckets in Supabase Studio (see SETUP.md).
-- =============================================================================
