-- =============================================================================
-- Affy's — Storage permissions for menu photos & videos (run once)
-- =============================================================================
-- Lets signed-in staff upload/manage files in the public "menu-images" bucket,
-- so the admin can add dish photos and videos. Everyone can read (the bucket
-- is public). Uses the is_staff() function created in the main schema.
--
-- Safe and idempotent. HOW TO RUN: Supabase → SQL Editor → New query →
-- paste → Run. ("Success. No rows returned.")
--
-- NOTE: the "menu-images" bucket must already exist (you created it during
-- setup). If you also want to store video there, that's fine — same bucket.
-- =============================================================================

-- Public read for files in the bucket.
drop policy if exists "menu_images_public_read" on storage.objects;
create policy "menu_images_public_read" on storage.objects
  for select
  using (bucket_id = 'menu-images');

-- Staff can upload.
drop policy if exists "menu_images_staff_insert" on storage.objects;
create policy "menu_images_staff_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'menu-images' and is_staff());

-- Staff can replace/update.
drop policy if exists "menu_images_staff_update" on storage.objects;
create policy "menu_images_staff_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'menu-images' and is_staff());

-- Staff can delete.
drop policy if exists "menu_images_staff_delete" on storage.objects;
create policy "menu_images_staff_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'menu-images' and is_staff());
