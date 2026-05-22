-- =============================================================================
-- Affy's — Editable delivery + payment settings (run once)
-- =============================================================================
-- Adds delivery globals and payment details to store_settings so you can change
-- fees, thresholds, the weight surcharge, and your bank/MB Way details from the
-- admin "Delivery & Payments" page — no code changes. Per-municipality fees
-- already live in the delivery_zones table (editable on the same page).
--
-- Additive + idempotent. Supabase → SQL Editor → New query → paste → Run.
-- =============================================================================

alter table store_settings add column if not exists free_delivery_threshold numeric(10,2) not null default 200;
alter table store_settings add column if not exists tier1_threshold          numeric(10,2) not null default 200;
alter table store_settings add column if not exists tier1_fee                numeric(10,2) not null default 30;
alter table store_settings add column if not exists tier2_threshold          numeric(10,2) not null default 400;
alter table store_settings add column if not exists tier2_fee                numeric(10,2) not null default 50;
alter table store_settings add column if not exists whatsapp_threshold       numeric(10,2) not null default 500;
alter table store_settings add column if not exists outside_aml_fee          numeric(10,2) not null default 25;
-- Weight surcharge for out-of-Lisbon orders that get heavy.
alter table store_settings add column if not exists weight_threshold         numeric(10,2) not null default 160;
alter table store_settings add column if not exists weight_surcharge         numeric(10,2) not null default 15;

-- Payment details shown at checkout.
alter table store_settings add column if not exists pay_account_name text default 'Affy''s · Unipessoal LDA';
alter table store_settings add column if not exists pay_iban         text;
alter table store_settings add column if not exists pay_mbway        text default '+351 914 145 519';
alter table store_settings add column if not exists pay_note         text default 'Please send payment before confirmation and share the receipt via WhatsApp.';
