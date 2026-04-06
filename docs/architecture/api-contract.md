# API Contract
## Affy's AI Ordering System

## Purpose

This document defines the backend contract for Affy's AI Ordering System.

It explains:
- what order-related requests the frontend can send
- what the backend validates
- what the backend returns
- how standard checkout differs from inquiry routing
- how manual review is represented
- how checkout readiness is determined

This contract is written for V1 and assumes:
- full-stack Next.js backend
- AI-assisted ordering plus quick order form
- backend validation before checkout
- Stripe checkout later in the flow

# 1. Core contract philosophy

The backend should never trust the frontend blindly.

The frontend may collect customer input.  
The AI may produce a structured draft.  
But the backend is the final gatekeeper for:

- item validity
- quantity validity
- pricing readiness
- inquiry routing
- scheduling validity
- checkout readiness

The backend should return structured outcomes, not vague success/failure messages.

# 2. Main backend flow

The backend contract should support this flow:

1. customer input is collected
2. frontend submits an order draft
3. backend validates the draft
4. backend returns one of these outcomes:
   - needs more information
   - valid but needs manual review
   - inquiry-only
   - ready for checkout
5. frontend responds appropriately
6. checkout is only created when the backend confirms readiness

# 3. Main endpoints

V1 should support these backend endpoints:

- `POST /api/order-draft/validate`
- `POST /api/order-draft/from-ai`
- `POST /api/checkout/create`
- `POST /api/inquiry/create`
- `GET /api/availability/slots`
- `GET /api/menu/search`

Not all of them need full implementation immediately, but this is the contract shape we are designing toward.

# 4. Shared response envelope

All order-related endpoints should return a consistent response envelope.

```json
{
  "success": true,
  "message": "Human-readable summary",
  "data": {},
  "errors": [],
  "warnings": []
}
```

## Notes

- `success` means the request was processed successfully, not necessarily that checkout is ready
- `message` is for readable feedback
- `data` contains the structured payload
- `errors` contains blocking issues
- `warnings` contains non-blocking issues

# 5. Order draft input model

This is the shape the frontend should send for validation.

It may come from:
- AI ordering flow
- quick order form
- merged review screen state

## Request: `POST /api/order-draft/validate`

### Request body

```json
{
  "source": "ai",
  "customer": {
    "full_name": "Affy Example",
    "whatsapp_number": "+351900000000",
    "email": "example@email.com"
  },
  "fulfillment": {
    "type": "delivery",
    "requested_date": "2026-04-10",
    "requested_time": "15:00",
    "timezone": "Europe/Lisbon",
    "pickup_location_name": null,
    "delivery_address": {
      "line_1": "Rua Example 10",
      "line_2": null,
      "city": "Lisbon",
      "postal_code": "1000-100",
      "instructions": "Call on arrival"
    }
  },
  "items": [
    {
      "menu_item_slug": "meatpie",
      "requested_quantity_value": 7,
      "requested_quantity_unit": "piece",
      "selected_customizations": [],
      "item_notes": null
    }
  ],
  "customer_notes": "Please make it fresh"
}
```

# 6. Validation responsibilities of `/api/order-draft/validate`

This endpoint should validate all core ordering rules.

## It should validate:

### Customer details
- full name present
- WhatsApp number present

### Fulfillment
- fulfillment type present
- delivery address present if delivery is selected

### Item resolution
- item exists
- item is active
- item ordering mode is known

### Quantity rules
- quantity is present
- quantity is not below minimum
- quantity increment is valid
- decimal quantities are allowed or rejected correctly
- preset priced quantity vs non-preset valid quantity is identified correctly

### Customizations
- selected customizations are allowed for the item

### Scheduling
- requested date and time are present
- slot is checked against availability rules
- blackout periods are applied
- required notice period is met

### Business rules
- minimum order value is met
- inquiry-only requests are routed correctly

### Pricing readiness
- if quantity matches a preset priced option, pricing may be resolved directly
- if quantity is valid but non-preset, backend decides whether:
  - automatic pricing is available
  - manual review is required

# 7. Response states for `/api/order-draft/validate`

The endpoint should return one of these validation outcomes:

- `needs_more_information`
- `invalid`
- `inquiry_only`
- `manual_review_required`
- `ready_for_checkout`

These should appear in `data.validation_status`.

# 8. Example response: needs more information

```json
{
  "success": true,
  "message": "More information is required before checkout.",
  "data": {
    "validation_status": "needs_more_information",
    "missing_fields": [
      "customer.whatsapp_number",
      "fulfillment.requested_time"
    ],
    "validation_flags": [],
    "resolved_items": [],
    "pricing_summary": null,
    "next_action": "ask_follow_up_question"
  },
  "errors": [],
  "warnings": []
}
```

# 9. Example response: invalid

```json
{
  "success": true,
  "message": "The requested quantity is not valid for this item.",
  "data": {
    "validation_status": "invalid",
    "missing_fields": [],
    "validation_flags": [
      "quantity_below_minimum"
    ],
    "resolved_items": [],
    "pricing_summary": null,
    "next_action": "ask_follow_up_question"
  },
  "errors": [
    {
      "code": "quantity_below_minimum",
      "field": "items[0].requested_quantity_value",
      "message": "Meatpie starts from 5 pieces."
    }
  ],
  "warnings": []
}
```

# 10. Example response: inquiry only

```json
{
  "success": true,
  "message": "This request should be handled as an inquiry.",
  "data": {
    "validation_status": "inquiry_only",
    "missing_fields": [],
    "validation_flags": [
      "contains_inquiry_only_item"
    ],
    "resolved_items": [],
    "pricing_summary": null,
    "next_action": "route_to_inquiry_flow"
  },
  "errors": [],
  "warnings": []
}
```

# 11. Example response: manual review required

```json
{
  "success": true,
  "message": "The order is valid, but pricing requires manual review.",
  "data": {
    "validation_status": "manual_review_required",
    "missing_fields": [],
    "validation_flags": [
      "non_preset_quantity_requires_manual_review"
    ],
    "resolved_items": [
      {
        "menu_item_slug": "meatpie",
        "canonical_name": "Meatpie",
        "requested_quantity_value": 7,
        "requested_quantity_unit": "piece",
        "pricing_resolution_mode": "manual_review"
      }
    ],
    "pricing_summary": null,
    "next_action": "handoff_to_human"
  },
  "errors": [],
  "warnings": [
    {
      "code": "manual_pricing_required",
      "message": "This quantity is valid but not covered by preset menu pricing."
    }
  ]
}
```

# 12. Example response: ready for checkout

```json
{
  "success": true,
  "message": "The order is valid and ready for checkout.",
  "data": {
    "validation_status": "ready_for_checkout",
    "missing_fields": [],
    "validation_flags": [],
    "resolved_items": [
      {
        "menu_item_slug": "jollof-rice",
        "canonical_name": "Jollof Rice",
        "requested_quantity_value": 3,
        "requested_quantity_unit": "litre",
        "matched_variant_label": "3 Litres",
        "pricing_resolution_mode": "preset_variant",
        "unit_price": 45.5,
        "line_total": 45.5
      }
    ],
    "pricing_summary": {
      "subtotal_amount": 45.5,
      "delivery_fee_amount": 0,
      "discount_amount": 0,
      "total_amount": 45.5,
      "currency": "EUR"
    },
    "next_action": "proceed_to_checkout"
  },
  "errors": [],
  "warnings": []
}
```

# 13. `POST /api/order-draft/from-ai`

## Purpose

This endpoint accepts:
- conversation history or current user message
- AI structured extraction output

It should not create checkout directly.

Its job is to:
1. normalize AI output
2. map it into the order-draft format
3. pass it through the same validation logic as the quick order form

## Rule

AI-assisted orders and form-based orders should converge into the same validation pipeline.

That is important.

# 14. `GET /api/menu/search`

## Purpose

This endpoint helps the assistant or frontend resolve menu items from:
- aliases
- localized names
- partial matches
- multilingual input

## Example query
`/api/menu/search?q=arroz%20jollof`

## Example response

```json
{
  "success": true,
  "message": "Menu search completed.",
  "data": {
    "results": [
      {
        "slug": "jollof-rice",
        "name": "Jollof Rice",
        "category": "Rice Dishes",
        "match_reason": "localized_name"
      }
    ]
  },
  "errors": [],
  "warnings": []
}
```

# 15. `GET /api/availability/slots`

## Purpose

Returns valid slots for:
- pickup
- delivery

based on:
- availability rules
- blackout periods
- lead times
- requested day

## Example query
`/api/availability/slots?fulfillment_type=delivery&date=2026-04-10`

## Example response

```json
{
  "success": true,
  "message": "Available slots retrieved.",
  "data": {
    "date": "2026-04-10",
    "fulfillment_type": "delivery",
    "slots": [
      "13:00",
      "13:30",
      "14:00",
      "15:00"
    ]
  },
  "errors": [],
  "warnings": []
}
```

# 16. `POST /api/checkout/create`

## Purpose

Creates a checkout session only after the order draft has been validated as `ready_for_checkout`.

## Request body

```json
{
  "validated_order_draft_id": "draft_123"
}
```

## Backend rules

This endpoint must reject checkout creation if:
- validation status is not `ready_for_checkout`
- pricing is unresolved
- manual review is still required
- required fields changed after validation
- availability is no longer valid

## Example response

```json
{
  "success": true,
  "message": "Checkout session created.",
  "data": {
    "checkout_url": "https://checkout.stripe.com/...",
    "order_reference": "AFFY-2026-0012"
  },
  "errors": [],
  "warnings": []
}
```

# 17. `POST /api/inquiry/create`

## Purpose

Creates an inquiry record for:
- catering
- buffet
- event requests
- inquiry-only services

## Request body

```json
{
  "customer": {
    "full_name": "Affy Example",
    "whatsapp_number": "+351900000000",
    "email": null
  },
  "inquiry": {
    "service_type": "buffet",
    "event_date": "2026-05-10",
    "guest_count": 80,
    "location": "Lisbon",
    "notes": "Birthday celebration"
  }
}
```

## Response

```json
{
  "success": true,
  "message": "Inquiry submitted successfully.",
  "data": {
    "inquiry_reference": "INQ-2026-0004",
    "next_action": "await_follow_up"
  },
  "errors": [],
  "warnings": []
}
```

# 18. Recommended validation flags

The backend should support structured validation flags like:

- `missing_required_field`
- `quantity_below_minimum`
- `invalid_decimal_quantity`
- `invalid_quantity_increment`
- `non_preset_quantity_requires_manual_review`
- `contains_inquiry_only_item`
- `slot_unavailable`
- `delivery_address_incomplete`
- `minimum_order_not_met`
- `notice_period_not_met`
- `manual_review_required`

These flags are important because they are easier for the frontend and AI layer to work with than raw text alone.

# 19. Recommended error object shape

Use a standard shape for errors:

```json
{
  "code": "quantity_below_minimum",
  "field": "items[0].requested_quantity_value",
  "message": "Meatpie starts from 5 pieces."
}
```

This makes frontend rendering and debugging much easier.

# 20. Recommended warning object shape

Use a standard shape for warnings:

```json
{
  "code": "manual_pricing_required",
  "message": "This quantity is valid but pricing requires manual review."
}
```

Warnings should not block processing unless the next action requires handoff.


# 21. Manual review policy in the contract

Manual review should be treated as a real backend outcome, not a vague note.

Use it when:
- quantity is operationally valid but not preset-priced
- pricing cannot be safely resolved
- the request is custom enough to need human review
- operational rules allow continuation only after manual confirmation

The frontend should know how to display this state clearly.

# 22. Inquiry routing policy in the contract

Inquiry-only flow should be separate from checkout flow.

If an item or request is classified as inquiry-only:
- the backend should return `validation_status = inquiry_only`
- the frontend should not try to create checkout
- the user should be guided into inquiry submission

# 23. Contract design principle

The backend contract should always answer this question clearly:

## What is the next valid system step?

That next step should be explicit in every response:
- ask follow-up question
- show review
- proceed to checkout
- route to inquiry
- handoff to human

That keeps the frontend simple and the system deterministic.