-- =============================================================================
-- Affy's — Rich Menu Upgrade (run once in Supabase SQL Editor)
-- =============================================================================
-- Adds everything the upgraded menu needs:
--   • multiple photos + a video per dish
--   • ingredients ("what's in it") and a longer description
--   • spice levels (preference only — no price change)
--   • "pairs well with" suggestions
--   • a weekly-specials flag
--   • a categories table so categories can be reordered
--
-- This is ADDITIVE and idempotent: it does not change or remove any existing
-- data, and it's safe to run more than once. Your current site keeps working
-- exactly as-is until the new features are built on top.
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this → Run.
-- You should see "Success. No rows returned."
-- =============================================================================


-- 1) New columns on menu_items ------------------------------------------------
alter table menu_items add column if not exists long_description  text;
alter table menu_items add column if not exists ingredients       text[] not null default '{}';
-- spice_levels: any subset of {'mild','spicy','hot','extra'}. Empty = no spice
-- picker shown for this dish (e.g. drinks, pastries). Preference only.
alter table menu_items add column if not exists spice_levels      text[] not null default '{}';
alter table menu_items add column if not exists video_url         text;
alter table menu_items add column if not exists is_weekly_special boolean not null default false;

create index if not exists idx_menu_items_weekly on menu_items(is_weekly_special);


-- 2) menu_images — multiple photos per dish (carousel in public) --------------
create table if not exists menu_images (
  id           uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  url          text not null,
  alt          text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists idx_menu_images_item on menu_images(menu_item_id);


-- 3) menu_pairings — "pairs well with" nudges (dish -> dish) -------------------
create table if not exists menu_pairings (
  id             uuid primary key default gen_random_uuid(),
  menu_item_id   uuid not null references menu_items(id) on delete cascade,
  paired_item_id uuid not null references menu_items(id) on delete cascade,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  unique (menu_item_id, paired_item_id),
  check (menu_item_id <> paired_item_id)
);
create index if not exists idx_menu_pairings_item on menu_pairings(menu_item_id);


-- 4) menu_categories — lets categories be reordered ---------------------------
create table if not exists menu_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text unique not null,
  name_pt    text,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_menu_categories_sort on menu_categories(sort_order);


-- 5) Row Level Security for the new tables ------------------------------------
alter table menu_images     enable row level security;
alter table menu_pairings   enable row level security;
alter table menu_categories enable row level security;

-- Images / pairings / categories are public, non-sensitive content:
-- anyone can read, only staff can change.
drop policy if exists menu_images_public_read on menu_images;
create policy menu_images_public_read on menu_images for select using (true);
drop policy if exists menu_images_staff_write on menu_images;
create policy menu_images_staff_write on menu_images for all using (is_staff()) with check (is_staff());

drop policy if exists menu_pairings_public_read on menu_pairings;
create policy menu_pairings_public_read on menu_pairings for select using (true);
drop policy if exists menu_pairings_staff_write on menu_pairings;
create policy menu_pairings_staff_write on menu_pairings for all using (is_staff()) with check (is_staff());

drop policy if exists menu_categories_public_read on menu_categories;
create policy menu_categories_public_read on menu_categories for select using (true);
drop policy if exists menu_categories_staff_write on menu_categories;
create policy menu_categories_staff_write on menu_categories for all using (is_staff()) with check (is_staff());


-- 6) Seed menu_categories from your existing menu -----------------------------
-- Canonical order first (matches the current public menu), then catch any
-- other categories that exist in menu_items but aren't listed here.
insert into menu_categories (name, sort_order) values
  ('Rice dishes', 1),
  ('Stews', 2),
  ('Sauces', 3),
  ('Soups', 4),
  ('Peppersoups', 5),
  ('Traditional dishes', 6),
  ('Specials', 7),
  ('Sides', 8),
  ('Protein', 9),
  ('Swallows', 10),
  ('Pastries & small chops', 11)
on conflict (name) do nothing;

insert into menu_categories (name, sort_order)
select distinct category, 100
from menu_items
where category is not null
on conflict (name) do nothing;

-- =============================================================================
-- Done. Reply to Claude once this runs successfully and we'll build the admin
-- editing tools and the public detail modal on top of it.
-- =============================================================================
