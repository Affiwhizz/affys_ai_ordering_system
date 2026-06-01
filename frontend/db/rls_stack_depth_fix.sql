-- =============================================================================
-- Affy's — Fix Postgres "stack depth limit exceeded" on /menu (run once)
-- =============================================================================
-- Symptom (seen in Vercel logs):
--   [menu] DB query failed, falling back to bundled menu:
--   stack depth limit exceeded
-- → Public /menu intermittently fell back to the bundled static menu
--   (no images, no spice, no pairings) for some users (notably mobile).
--
-- Root cause:
--   is_staff() and is_owner() each query staff_users.
--   staff_users has its own RLS policy that calls is_staff() / is_owner().
--   Result: every call recurses, eventually Postgres' max_stack_depth (2MB
--   default in Supabase) trips and the whole query aborts.
--
-- Fix:
--   Re-create both functions with SECURITY DEFINER so the SELECT inside
--   them runs with the function owner's privileges, bypassing RLS — which
--   breaks the recursion loop entirely. Both functions remain STABLE so
--   Postgres can still cache results per statement.
--
-- Safe to run multiple times (uses CREATE OR REPLACE).
-- =============================================================================

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
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
security definer
set search_path = public
as $$
  select exists (
    select 1 from staff_users
    where id = auth.uid() and is_active = true and role = 'owner'
  );
$$;

-- Allow the anonymous role (every public page hit on /menu) to call these
-- functions. With SECURITY DEFINER they still only check the current
-- session's auth.uid(), so anon users will simply get FALSE.
grant execute on function is_staff()  to anon, authenticated;
grant execute on function is_owner() to anon, authenticated;
