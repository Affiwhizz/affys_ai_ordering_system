# Data Model: Affy's AI Ordering System

## Purpose

This document defines the MVP data model for Affy's AI Ordering System.

It is the reference point for:
- database tables
- frontend forms and types
- backend request and response shapes
- AI order extraction output
- payment flow
- future customer history and analytics

This is a design document only. No database tables are being created yet.


## Business context

Affy's main menu is not a flat one-price-per-item menu.

The real menu includes:
- category-based sections such as Rice Dishes, Stews and Sauces, Soups, Peppersoups, Traditional Dishes, Specials, Sides and Protein, Swallows, Pastries and Small Chops, and Other Catering Services
- litre-based pricing for many main dishes
- piece-based pricing for proteins, pastries, and swallows
- optional customizations for some items
- order rules such as advance notice requirements and minimum order value
- delivery and pickup realities that affect how checkout should work

Because of that, the data model needs to support:
- categories
- menu items
- purchasable variants
- scheduling
- payment verification
- order progress states
- inquiry-only services for catering-style items

Important note:
The Portimao bowls are separate from this main menu and should not be mixed into the core website menu structure.


## Design principles

### 1. The model should match the real business
If the business sells one item in multiple sizes or piece counts, the system should model that directly.

### 2. Orders should preserve history
If names, prices, or menu options change later, old orders must still show what the customer actually bought at that time.

### 3. Payment and preparation are separate steps
An order must be paid and verified before it is prepared or sent for delivery.

### 4. Availability must be controlled
Customers should only be able to choose valid dates and times based on your open hours and any blocked periods.

### 5. MVP first
The model should be strong enough for real implementation now without becoming too heavy.


## Entity overview

The MVP data model includes:

- `customers`
- `menu_categories`
- `menu_items`
- `menu_item_variants`
- `availability_rules`
- `blackout_periods`
- `orders`
- `order_items`
- `payments`

### Relationship summary

- one customer can place many orders
- one menu category can contain many menu items
- one menu item can have many purchasable variants
- one order can contain many order items
- one order item points to one chosen variant
- one order can have one or more payment records
- availability rules define allowed order slots
- blackout periods override normal availability


## customers

Represents a person who places an order.

### Fields

- `id` (uuid, pk)
- `full_name` (text)
- `whatsapp_number` (text)
- `email` (text, nullable)
- `birthday` (date, nullable)
- `preferred_contact_method` (text, nullable)
- `marketing_opt_in` (boolean, default false)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)
- `last_seen_at` (timestamp with time zone, nullable)

### Business rules

- `whatsapp_number` is required for MVP
- `email` is optional
- the frontend should label this field clearly as `WhatsApp number`
- this number may later be used for order updates, delivery coordination, or courier contact
- repeat customer matching can later use WhatsApp number and email


## menu_categories

Represents the top-level sections used in the menu.

### Fields

- `id` (uuid, pk)
- `name` (text)
- `slug` (text, unique)
- `description` (text, nullable)
- `sort_order` (integer, default 0)
- `is_active` (boolean, default true)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Initial category values

- `rice-dishes`
- `stews-and-sauces`
- `soups`
- `peppersoups`
- `traditional-dishes`
- `specials`
- `sides-and-protein`
- `swallows`
- `pastries-and-small-chops`
- `other-catering-services`


## menu_items

Represents the product a customer recognizes on the menu.

Examples:
- Jollof Rice
- Chicken Stew
- Egusi Soup
- Meatpie
- Eba
- Puff Puff
- Buffet / Party Packs

### Fields

- `id` (uuid, pk)
- `category_id` (uuid, fk -> menu_categories.id)
- `name` (text)
- `slug` (text, unique)
- `description` (text, nullable)
- `currency` (text, default `EUR`)
- `image_url` (text, nullable)
- `is_active` (boolean, default `true`)
- `is_featured` (boolean, default `false`)
- `sort_order` (integer, default `0`)
- `ordering_mode` (text enum: `standard`, `inquiry_only`)
- `minimum_notice_hours` (integer, nullable)
- `tags` (text[], nullable)
- `allergen_tags` (text[], nullable)
- `search_aliases` (text[], nullable)
- `localized_names` (jsonb, nullable)
- `customization_schema` (jsonb, nullable)
- `quantity_rule_type` (text enum: `preset_only`, `minimum_integer`, `inquiry_only`)
- `minimum_quantity_value` (numeric(10,2), nullable)
- `quantity_unit_type` (text enum: `litre`, `piece`, `bundle`, `service`, nullable)
- `quantity_increment` (numeric(10,2), nullable)
- `allow_decimal_quantities` (boolean, default `false`)
- `non_preset_quantity_policy` (text enum: `manual_review`, `disallowed`, nullable)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Notes

- `ordering_mode = standard` means the item can go through normal checkout
- `ordering_mode = inquiry_only` means the item should be shown on the website but routed into an enquiry flow instead of normal checkout
- this is useful for categories like `Other Catering Services`
- `minimum_notice_hours` allows item-specific lead-time rules if needed later
- `quantity_rule_type = preset_only` means only predefined menu variants are valid
- `quantity_rule_type = minimum_integer` means the item has a minimum quantity, but larger valid whole-number quantities can also be accepted
- `quantity_rule_type = inquiry_only` means the item should not go through standard checkout
- for Affy's current rules, many litre-based and piece-based items will likely use `minimum_integer`
- `quantity_increment` should usually be `1` for whole-number quantities
- `allow_decimal_quantities` should remain `false` for the cases you described
- `non_preset_quantity_policy = manual_review` means the quantity may be valid operationally, but pricing must be confirmed manually if it does not match a preset priced option
- `search_aliases` helps the assistant match user phrasing such as shorthand, slang, spelling variants, or alternate item names
- `localized_names` helps support multilingual menu matching

### Example `localized_names`

```json
{
  "en": "Jollof Rice",
  "pt": "Arroz Jollof à Nigeriana"
}
```

### Example `customization_schema`

For rice dishes:

```json
{
  "rice_type": {
    "type": "single_select",
    "options": ["long_grain", "basmati"]
  }
}
```

For peppersoups:

```json
{
  "add_on": {
    "type": "multi_select",
    "options": ["plantain", "yam"]
  }
}
```

For other dishes:

```json
{
  "spice_level": {
    "type": "single_select",
    "options": ["mild", "medium", "hot"]
  }
}
```

### Quantity policy

Not every item is limited to only the preset display quantities shown on the menu.

For some items, the displayed quantities act as standard priced reference options, while larger whole-number quantities may still be accepted.

Examples:
- soups or rice dishes may start at `2 Litres`, but `5 Litres` can still be valid
- pastries may start at `5 pcs`, but `7 pcs` can still be valid
- decimal quantities such as `2.5 Litres` are not valid
- quantities below the minimum are not valid

This means the system must support both:
- preset priced display quantities
- validation rules for allowed custom quantities


## menu_item_variants

Represents preset priced menu options for a menu item.

These variants are useful for:
- showing standard purchase options on the website
- storing known menu pricing points
- giving customers quick choices
- supporting direct checkout when the selected quantity matches a priced preset

They are not always the only valid quantities for the item.

If the parent item uses `quantity_rule_type = minimum_integer`, a customer may still request a larger valid whole-number quantity that is not one of the preset display options.

Examples:
- `5 Litres` for a dish that starts at `2 Litres`
- `7 pcs` for pies that start at `5 pcs`

In those cases, the quantity may still be valid, but pricing may require `manual_review` unless the system has a reliable pricing formula.

### Fields

- `id` (uuid, pk)
- `menu_item_id` (uuid, fk -> menu_items.id)
- `variant_label` (text)
- `unit_type` (text enum: `litre`, `piece`, `bundle`, `service`)
- `quantity_value` (numeric(10,2), nullable)
- `quantity_unit_label` (text, nullable)
- `serves_min` (integer, nullable)
- `serves_max` (integer, nullable)
- `price_amount` (numeric(10,2), nullable)
- `currency` (text, default `EUR`)
- `sort_order` (integer, default `0`)
- `is_active` (boolean, default `true`)
- `is_display_default` (boolean, default `true`)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Examples

For Jollof Rice:
- `2 Litres`
- `3 Litres`
- `4 Litres`

For Affy's Special Pasta:
- `1 Litre`
- `2 Litres`
- `3 Litres`

For Meatpie:
- `5 pcs`
- `10 pcs`
- `15 pcs`

For Puff Puff:
- `15 pcs`
- `30 pcs`
- `50 pcs`

For Eba:
- `3 pcs`
- `5 pcs`
- `10 pcs`

### Notes

- `variant_label` is what the customer sees, such as `2 Litres` or `10 pcs`
- `quantity_value` stores the number, such as `2`, `10`, or `50`
- `quantity_unit_label` stores the readable unit, such as `litres` or `pcs`
- `serves_min` and `serves_max` are mainly useful for litre-based dishes
- `is_display_default` marks the standard preset quantities shown in the UI
- for `inquiry_only` items, variants may be optional or unused
- preset variants are priced menu anchors, not always the only operationally valid quantities


## availability_rules

Defines the normal operating windows customers are allowed to book.

This supports the calendar and time-slot selection logic for both pickup and delivery.

### Fields

- `id` (uuid, pk)
- `fulfillment_type` (text enum: `pickup`, `delivery`)
- `weekday` (integer)
- `opens_at` (time)
- `closes_at` (time)
- `slot_interval_minutes` (integer, default `30`)
- `lead_time_hours` (integer, nullable)
- `max_orders_per_slot` (integer, nullable)
- `is_active` (boolean, default `true`)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Notes

- `weekday` can be stored as `0` to `6` or another agreed format, but the project should stay consistent
- pickup and delivery can have different operating hours
- the frontend calendar should only show slots that match these rules
- `lead_time_hours` can help enforce advance ordering windows
- `max_orders_per_slot` can help later if you want to cap slot capacity


## blackout_periods

Defines dates or time ranges when customers should not be allowed to book, even if they fall inside normal availability.

### Fields

- `id` (uuid, pk)
- `starts_at` (timestamp with time zone)
- `ends_at` (timestamp with time zone)
- `applies_to_fulfillment_type` (text enum: `pickup`, `delivery`, nullable)
- `reason` (text, nullable)
- `is_active` (boolean, default `true`)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Example use cases

- fully booked periods
- holidays
- private event days
- temporary unavailability
- kitchen closure
- delivery suspension on a certain day

### Notes

- blackout periods should override availability rules
- the booking calendar should remove any slots that overlap with blackout periods


## orders

Represents one customer order.

### Fields

- `id` (uuid, pk)
- `public_order_code` (text, unique)
- `customer_id` (uuid, fk -> customers.id)
- `customer_name_snapshot` (text)
- `customer_whatsapp_snapshot` (text)
- `source` (text enum: `ai`, `form`)
- `customer_input_language` (text, nullable)
- `fulfillment_type` (text enum: `pickup`, `delivery`)
- `order_status` (text enum: `draft`, `awaiting_payment`, `payment_under_review`, `payment_verified`, `scheduled`, `preparing`, `ready_for_pickup`, `out_for_delivery`, `completed`, `cancelled`)
- `payment_status` (text enum: `unpaid`, `pending`, `paid`, `failed`, `refunded`)
- `scheduled_for` (timestamp with time zone, nullable)
- `pickup_location_name` (text, nullable)
- `delivery_address_line_1` (text, nullable)
- `delivery_address_line_2` (text, nullable)
- `delivery_city` (text, nullable)
- `delivery_postal_code` (text, nullable)
- `delivery_instructions` (text, nullable)
- `customer_notes` (text, nullable)
- `internal_notes` (text, nullable)
- `currency` (text, default `EUR`)
- `subtotal_amount` (numeric(10,2))
- `delivery_fee_amount` (numeric(10,2), default `0.00`)
- `discount_amount` (numeric(10,2), default `0.00`)
- `total_amount` (numeric(10,2))
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)
- `payment_verified_at` (timestamp with time zone, nullable)
- `scheduled_at` (timestamp with time zone, nullable)
- `preparing_at` (timestamp with time zone, nullable)
- `ready_at` (timestamp with time zone, nullable)
- `out_for_delivery_at` (timestamp with time zone, nullable)
- `completed_at` (timestamp with time zone, nullable)
- `cancelled_at` (timestamp with time zone, nullable)

### Notes

- `public_order_code` is the customer-facing reference
- `source` shows whether the order came through the AI flow or the quick form
- `customer_name_snapshot` and `customer_whatsapp_snapshot` preserve the exact contact details used for that order
- `customer_input_language` stores the language the customer used during ordering, which helps later for communication and multilingual support
- a customer-selected date and time must be validated against `availability_rules` and `blackout_periods` before the order is accepted
- payment must be verified before the order moves to `preparing` or `out_for_delivery`
- the `order_status` values and timestamps will later power the customer-facing progress bar or order tracker

### Business rules to apply later in implementation

These do not need separate tables yet, but they matter for validation logic:

- minimum daily or biweekly order total is `20 EUR`
- small-scale orders require `24 hours` notice
- large catering or event orders require at least `10 days` notice
- delivery is available across Portugal
- allergy notice should be shown clearly during ordering


## order_items

Represents each line item inside an order.

### Fields

- `id` (uuid, pk)
- `order_id` (uuid, fk -> orders.id)
- `menu_item_id` (uuid, fk -> menu_items.id)
- `menu_item_variant_id` (uuid, fk -> menu_item_variants.id, nullable)
- `item_name_snapshot` (text)
- `variant_label_snapshot` (text, nullable)
- `requested_quantity_value` (numeric(10,2))
- `requested_quantity_unit` (text)
- `unit_price_snapshot` (numeric(10,2), nullable)
- `quantity` (integer, default `1`)
- `line_total_amount` (numeric(10,2), nullable)
- `pricing_resolution_mode` (text enum: `preset_variant`, `manual_review`)
- `selected_customizations` (jsonb, nullable)
- `item_notes` (text, nullable)
- `created_at` (timestamp with time zone)

### Notes

- this table preserves what the customer actually bought at the time of ordering
- `menu_item_variant_id` is nullable because a customer may request a valid non-preset quantity such as `7 pcs` or `5 Litres`
- `requested_quantity_value` stores the actual requested amount, such as `7` or `5`
- `requested_quantity_unit` stores the unit, such as `pcs` or `litres`
- `variant_label_snapshot` is used when the order matched a preset priced option
- `pricing_resolution_mode = preset_variant` means the item matched a known priced menu option
- `pricing_resolution_mode = manual_review` means the quantity is valid operationally but needs manual price confirmation
- snapshots should remain unchanged even if the live menu later changes

### Example `selected_customizations`

```json
{
  "rice_type": "basmati",
  "add_on": ["plantain"]
}
```


## payments

Represents payment attempts and outcomes for an order.

### Fields

- `id` (uuid, pk)
- `order_id` (uuid, fk -> orders.id)
- `provider` (text, example: `stripe`)
- `provider_checkout_session_id` (text, nullable)
- `provider_payment_intent_id` (text, nullable)
- `status` (text enum: `pending`, `paid`, `failed`, `refunded`)
- `amount` (numeric(10,2))
- `currency` (text, default `EUR`)
- `paid_at` (timestamp with time zone, nullable)
- `provider_response_payload` (jsonb, nullable)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Notes

- one order may have more than one payment record if a first attempt fails and the customer retries
- payment verification can use provider identifiers plus backend checks
- provider payload storage is useful for audits, debugging, and webhook reconciliation later


## Enum summary

### order source
- `ai`
- `form`

### ordering mode
- `standard`
- `inquiry_only`

### quantity rule type
- `preset_only`
- `minimum_integer`
- `inquiry_only`

### fulfillment type
- `pickup`
- `delivery`

### order status
- `draft`
- `awaiting_payment`
- `payment_under_review`
- `payment_verified`
- `scheduled`
- `preparing`
- `ready_for_pickup`
- `out_for_delivery`
- `completed`
- `cancelled`

### payment status on orders
- `unpaid`
- `pending`
- `paid`
- `failed`
- `refunded`

### payment record status
- `pending`
- `paid`
- `failed`
- `refunded`

### variant unit type
- `litre`
- `piece`
- `bundle`
- `service`

### non-preset quantity policy
- `manual_review`
- `disallowed`

### pricing resolution mode
- `preset_variant`
- `manual_review`


## Business rules to carry into implementation later

These are not all database fields, but they matter to the product:

- rice dishes may allow a choice between long grain and basmati rice
- peppersoup dishes may allow plantain or yam as add-ons for extra cost
- WhatsApp number is required for communication and delivery coordination
- the frontend should only show valid date and time slots
- blocked periods should be excluded from booking
- customers should see order progress after checkout based on `order_status`
- catering services may use enquiry flows instead of standard checkout
- the allergy notice should be visible during ordering
- the assistant should support customer input in different languages and still map requests to the correct menu items