-- =============================================================================
-- Affy's — Catering inquiries adaptations (run once, idempotent)
-- =============================================================================
-- The catering_inquiries table itself was created by db/schema.sql back in May.
-- This file only ADAPTS that existing table to match the new public form:
--   1. Loosen NOT NULL on fields that should be optional for casual inquiries
--      (event_type / guest_count / event_date / location / customer_email).
--   2. Add a `contacted_at` lifecycle stamp used by the admin status flow.
--   3. Make sure the policies are in place (they were also defined in
--      schema.sql, but re-declaring is safe).
--
-- Safe to re-run any time. Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

-- 1) Drop NOT NULL on optional-from-public-form columns. Each ALTER is wrapped
-- in a DO block so it never errors if the column is already nullable.
do $$
declare cols text[] := array[
  'customer_email', 'event_type', 'guest_count', 'event_date', 'location'
];
declare c text;
begin
  foreach c in array cols loop
    execute format('alter table catering_inquiries alter column %I drop not null;', c);
  end loop;
exception when undefined_column then
  -- Column missing — nothing to relax. Ignore.
  null;
end $$;

-- 2) Add contacted_at if missing (used when staff moves an inquiry to
-- "reviewing"). idempotent.
alter table catering_inquiries
  add column if not exists contacted_at timestamptz;

-- 3) Index by submitted_at for newest-first listing (already exists in
-- schema.sql, idempotent).
create index if not exists idx_catering_submitted on catering_inquiries(submitted_at desc);

-- 4) RLS + policies — re-declare safely so this file stands alone for
-- a fresh project or for fixing a clobbered policy.
alter table catering_inquiries enable row level security;

drop policy if exists catering_anon_insert on catering_inquiries;
create policy catering_anon_insert on catering_inquiries
  for insert with check (true);

drop policy if exists catering_staff_all on catering_inquiries;
create policy catering_staff_all on catering_inquiries
  for all using (is_staff()) with check (is_staff());
