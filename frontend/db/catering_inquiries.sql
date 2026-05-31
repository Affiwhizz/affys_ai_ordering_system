-- =============================================================================
-- Affy's — Catering inquiries (run once)
-- =============================================================================
-- Captures catering quote requests from the public Catering form. Staff
-- triage them in /admin/catering and update status as they progress.
--
-- Additive + idempotent. Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

create table if not exists catering_inquiries (
  id uuid primary key default gen_random_uuid(),

  -- Customer
  name text not null,
  email citext,
  phone text not null,

  -- Event
  event_type text,            -- Wedding | Birthday | Corporate | Pop-up | Other (free text)
  event_date date,            -- when the event is (may be null if undecided)
  guest_count int,            -- estimated headcount
  location text,              -- venue / area / municipality
  budget text,                -- free-text budget hint, e.g. "around €1500"

  -- Brief
  notes text,                 -- "tell us about your event"

  -- Pipeline
  status text not null default 'new',  -- new | reviewing | quoted | confirmed | declined
  quote_amount numeric(12,2),           -- staff fills in once quoted
  staff_notes text,                     -- internal-only notes (staff write)

  -- Lifecycle stamps
  created_at  timestamptz not null default now(),
  contacted_at timestamptz,
  quoted_at    timestamptz,
  confirmed_at timestamptz,
  declined_at  timestamptz
);

create index if not exists idx_catering_status  on catering_inquiries(status);
create index if not exists idx_catering_created on catering_inquiries(created_at desc);
create index if not exists idx_catering_date    on catering_inquiries(event_date);

alter table catering_inquiries enable row level security;

-- Public can submit; staff can read/manage in admin.
drop policy if exists catering_anon_insert on catering_inquiries;
create policy catering_anon_insert on catering_inquiries
  for insert with check (true);

drop policy if exists catering_staff_all on catering_inquiries;
create policy catering_staff_all on catering_inquiries
  for all using (is_staff()) with check (is_staff());
