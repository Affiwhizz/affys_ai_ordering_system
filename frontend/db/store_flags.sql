-- =============================================================================
-- Affy's — Store flags: daily-ordering pause + Portimão window control (run once)
-- =============================================================================
-- Adds two operator controls to store_settings:
--   1. A "pause daily ordering" switch (for when Affy is away, e.g. at Afro
--      Nation) + a resume date shown to customers.
--   2. The Portimão preorder window: an editable start/end date and a mode that
--      either follows those dates automatically or is forced open/closed/sold-out.
--
-- Additive + idempotent. Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

-- Daily ordering (regular Lisbon menu) pause.
alter table store_settings add column if not exists daily_ordering_paused boolean not null default false;
alter table store_settings add column if not exists daily_resume_date     date;

-- Portimão preorder window.
--   portimao_mode: 'auto'  → follows the start/end dates below
--                  'open'  → force live regardless of dates
--                  'closed'→ force off-season
--                  'sold_out' → show the sold-out / waitlist state
alter table store_settings add column if not exists portimao_mode  text not null default 'auto';
alter table store_settings add column if not exists portimao_start date default '2026-07-02';
alter table store_settings add column if not exists portimao_end   date default '2026-07-06';
