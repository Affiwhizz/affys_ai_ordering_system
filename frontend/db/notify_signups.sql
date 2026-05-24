-- =============================================================================
-- Affy's — Notify-me / waitlist sign-ups (run once)
-- =============================================================================
-- One table that captures "let me know" sign-ups from: the Portimão off-season
-- page, the Portimão sold-out waitlist, and the regular daily-ordering pause
-- notice. The `source` column tells you which one it came from.
--
-- Additive + idempotent. Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

create table if not exists notify_signups (
  id uuid primary key default gen_random_uuid(),
  email citext,
  phone text,
  source text not null default 'general',  -- portimao-offseason | portimao-waitlist | daily-pause
  created_at timestamptz not null default now()
);

create index if not exists idx_notify_signups_source on notify_signups(source);
create index if not exists idx_notify_signups_created on notify_signups(created_at desc);

alter table notify_signups enable row level security;

-- Public can add themselves; staff can read/manage in the admin.
drop policy if exists notify_signups_anon_insert on notify_signups;
create policy notify_signups_anon_insert on notify_signups for insert with check (true);
drop policy if exists notify_signups_staff_all on notify_signups;
create policy notify_signups_staff_all on notify_signups
  for all using (is_staff()) with check (is_staff());
