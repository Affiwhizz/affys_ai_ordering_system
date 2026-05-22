-- =============================================================================
-- Affy's — Add "featured on homepage" flag (run once)
-- =============================================================================
-- Adds menu_items.is_featured so staff can choose which dishes appear in the
-- homepage "Plates that tell stories" showcase. Additive, idempotent.
-- Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

alter table menu_items add column if not exists is_featured boolean not null default false;
create index if not exists idx_menu_items_featured on menu_items(is_featured);
