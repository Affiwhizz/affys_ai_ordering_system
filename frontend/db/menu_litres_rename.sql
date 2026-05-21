-- =============================================================================
-- Affy's — Rename portion labels: "2L tray" → "2 Litres" (run once)
-- =============================================================================
-- Changes the litre/tray portion labels across the whole menu so they read
-- "2 Litres", "3 Litres", "4 Litres" everywhere (menu, detail popup, cart,
-- checkout, admin). Piece-based sizes (e.g. "5 pcs") are left untouched.
--
-- Safe and idempotent. HOW TO RUN: Supabase → SQL Editor → New query →
-- paste → Run. You should see how many rows were updated.
-- =============================================================================

update menu_variants
set size_label = replace(size_label, 'L tray', ' Litres')
where size_label like '%L tray%';

-- Catch a couple of other phrasings just in case ("2L Tray", "2 L tray").
update menu_variants
set size_label = replace(size_label, 'L Tray', ' Litres')
where size_label like '%L Tray%';

update menu_variants
set size_label = replace(size_label, 'L  Litres', ' Litres')
where size_label like '%L  Litres%';
