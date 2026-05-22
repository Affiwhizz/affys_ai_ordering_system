-- =============================================================================
-- Affy's — Availability settings + blocked dates (run once)
-- =============================================================================
-- Lets staff set how much notice an order needs (lead days), which weekdays
-- the kitchen is open, and block specific dates (holidays/time off). The
-- customer date picker reads these so people can only choose valid dates.
--
-- Additive + idempotent. Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

-- Single-row store settings.
create table if not exists store_settings (
  id boolean primary key default true,
  daily_lead_days integer not null default 1,            -- minimum days' notice
  open_weekdays integer[] not null default '{1,2,3,4,5,6}', -- 0=Sun .. 6=Sat
  updated_at timestamptz not null default now(),
  constraint store_settings_singleton check (id = true)
);
insert into store_settings (id) values (true) on conflict (id) do nothing;

-- Specific dates the kitchen is closed.
create table if not exists blocked_dates (
  slot_date date primary key,
  note text,
  created_at timestamptz not null default now()
);

-- RLS: availability is public info (read by the date picker); only staff edit.
alter table store_settings enable row level security;
alter table blocked_dates  enable row level security;

drop policy if exists store_settings_public_read on store_settings;
create policy store_settings_public_read on store_settings for select using (true);
drop policy if exists store_settings_staff_write on store_settings;
create policy store_settings_staff_write on store_settings for all using (is_staff()) with check (is_staff());

drop policy if exists blocked_dates_public_read on blocked_dates;
create policy blocked_dates_public_read on blocked_dates for select using (true);
drop policy if exists blocked_dates_staff_write on blocked_dates;
create policy blocked_dates_staff_write on blocked_dates for all using (is_staff()) with check (is_staff());
