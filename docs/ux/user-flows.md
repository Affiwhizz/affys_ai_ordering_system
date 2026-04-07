# Affy's AI Ordering System
## User Flows

### Status
Working user-flow definition for V1

# 1. Purpose

This document defines the major user flows inside Affy's AI Ordering System.

It is used to:
- map how customers move through the ordering experience
- map how inquiry-only requests are handled
- map how internal admin users interact with the system
- identify validation points and branching logic
- ensure the product reflects real business operations

This is a behavior and experience document.  
It focuses on flow, not visual design.


# 2. Flow Design Principles

The flows should reflect the real operating logic of the business.

That means:

- customers should not be allowed to move from intent to payment without validation
- inquiry-only services should not be forced into normal checkout
- local delivery and intercity transfer should not be treated as the same thing
- AI and quick-form ordering should converge into the same backend validation system
- manual review should exist as a real product state, not hidden confusion
- the system should always guide the user to the next valid step


# 3. Primary User Flows

The product includes three primary external flows and one internal flow group:

## External flows
1. standard customer ordering through AI
2. standard customer ordering through quick form
3. inquiry-only or mixed-request flow

## Internal flows
4. admin and operator workflows


# 4. Flow 1 — Standard Ordering Through AI

## Goal
Allow a customer to place a valid order using natural language guidance.

## Entry points
- `/order`
- `/order/ai`
- future possible direct CTA from `/menu`

## Flow

### Step 1 — Customer enters AI ordering
The customer opens the AI ordering interface.

### Step 2 — Customer expresses request
The customer types what they want in natural language.

Examples:
- “I want jollof rice for tomorrow”
- “Quero arroz jollof para amanhã”
- “I need meatpies for Friday”
- “Can you deliver soup to Lisbon?”

### Step 3 — AI interprets request
The assistant:
- resolves menu intent
- checks if the request is a standard order, inquiry, or mixed request
- maps multilingual phrasing where possible
- preserves the raw request meaning

### Step 4 — AI resolves item
The assistant checks whether the item is clear enough.

#### If item is clear
Continue.

#### If item is ambiguous
Ask a focused clarification question.

Example:
“Which peppersoup would you like?”

### Step 5 — AI resolves quantity
The assistant asks for or validates quantity.

Possible cases:
- preset priced quantity
- valid non-preset quantity
- invalid below-minimum quantity
- invalid decimal quantity

#### If valid preset quantity
Continue normally.

#### If valid non-preset quantity
Continue, but flag possible manual review for pricing if needed.

#### If invalid quantity
Explain simply and ask for a valid quantity.

### Step 6 — AI captures customizations
Where relevant, the assistant captures:
- rice type
- spice level
- add-ons such as plantain or yam

### Step 7 — AI captures fulfillment type
The assistant asks:
- pickup
- local delivery
- intercity pickup transfer

The assistant must not assume one.

### Step 8 — AI captures schedule
The assistant collects:
- requested date
- requested time

### Step 9 — AI captures delivery details if required
If fulfillment is local delivery or intercity transfer, collect the necessary delivery or destination information.

### Step 10 — AI captures customer details
Collect:
- full name
- WhatsApp number
- optional email

### Step 11 — AI sends structured draft to backend validation
The AI ordering flow hands off to the backend validation layer.

### Step 12 — Backend returns result
Possible results:
- needs more information
- invalid
- inquiry-only
- manual review required
- ready for checkout

### Step 13 — System branches based on backend result

#### If more information is needed
AI asks the next focused question.

#### If invalid
AI explains what is invalid and asks for correction.

#### If inquiry-only
Route the request to inquiry flow.

#### If manual review is required
Explain that the request is valid but needs manual review before final pricing or confirmation.

#### If ready for checkout
Move to review screen.

### Step 14 — Customer reviews order
Customer sees:
- items
- quantity
- customizations
- fulfillment type
- requested date/time
- customer details
- price estimate or manual-review note

### Step 15 — Customer confirms
If checkout-ready, continue to payment handoff.

### Step 16 — Customer is redirected to checkout
Stripe checkout begins only if the order is truly ready.

### Step 17 — Post-payment flow
After payment:
- payment state updates
- order state updates
- success page appears
- order tracking/status becomes available


# 5. Flow 2 — Standard Ordering Through Quick Form

## Goal
Allow a customer to place a valid order without using AI chat.

## Entry points
- `/order`
- `/order/quick`
- future CTA from `/menu`

## Flow

### Step 1 — Customer enters quick order form
Customer chooses the quick order path.

### Step 2 — Customer selects item(s)
Customer selects menu item(s) from structured UI.

### Step 3 — Customer selects quantity
The form must support:
- preset priced quantities
- valid custom whole-number quantities where allowed

The form must reject:
- below-minimum quantities
- invalid decimals

### Step 4 — Customer selects customizations
Where relevant:
- rice type
- spice level
- add-ons

### Step 5 — Customer selects fulfillment type
Customer chooses:
- pickup
- local delivery
- intercity pickup transfer

### Step 6 — Customer selects requested date and time
The system should show only valid choices where possible.

### Step 7 — Customer enters contact details
Collect:
- full name
- WhatsApp number
- optional email

### Step 8 — Customer enters address or destination details if relevant
Required when fulfillment type needs it.

### Step 9 — Form submits to backend validation
The quick order form uses the same validation pipeline as the AI flow.

### Step 10 — Backend returns result
Possible results:
- needs more information
- invalid
- inquiry-only
- manual review required
- ready for checkout

### Step 11 — System branches based on result

#### If invalid or incomplete
Return the user to fix missing or invalid fields.

#### If inquiry-only
Route to inquiry flow.

#### If manual review
Explain clearly that the request requires manual review.

#### If ready for checkout
Move to review.

### Step 12 — Customer reviews order
Customer confirms details.

### Step 13 — Checkout handoff
Stripe checkout begins only when validation passes.

### Step 14 — Post-payment flow
Customer sees success and later status.


# 6. Flow 3 — Inquiry-Only Request Flow

## Goal
Handle catering-style or non-checkout requests correctly.

## Entry points
- `/catering`
- `/order/inquiry`
- AI conversation branch
- quick-form branch if an inquiry-only item is selected

## Flow

### Step 1 — Customer expresses inquiry
Examples:
- buffet service
- party packs
- food coolers
- event catering
- cocktail reception

### Step 2 — System identifies inquiry-only nature
The system recognizes that this should not enter standard checkout.

### Step 3 — Customer is moved into inquiry flow
The inquiry form or inquiry conversation collects:
- event type
- event date
- estimated guest count
- location
- notes
- contact details

### Step 4 — Inquiry is submitted
The system creates an inquiry record.

### Step 5 — Internal visibility
The inquiry appears in admin monitoring.

### Step 6 — Customer sees inquiry confirmation
Customer receives:
- a success message
- reference if available
- expectation of follow-up


# 7. Flow 4 — Mixed Request Flow

## Goal
Handle conversations where the customer combines standard order requests with inquiry-style requests.

## Example
“I want 7 meatpies for Friday and I also want to ask about buffet service for next month.”

## Flow

### Step 1 — System detects mixed request
The assistant or validation layer identifies both standard-order and inquiry-only intent.

### Step 2 — Standard-order portion is separated
The orderable items continue through order validation.

### Step 3 — Inquiry portion is separated
The catering-style request is routed into inquiry handling.

### Step 4 — Customer is guided through both without confusion
The system should not force both into one cart or one checkout.


# 8. Flow 5 — Local Delivery Flow

## Goal
Handle valid Lisbon-area or local manual courier delivery.

## Flow

### Step 1 — Customer selects local delivery
Can happen through AI or quick form.

### Step 2 — System collects:
- address
- WhatsApp number
- requested time
- delivery instructions

### Step 3 — Availability validation runs
Check:
- date/time validity
- delivery support rules
- blackout restrictions
- lead time

### Step 4 — Order proceeds through normal validation
If valid and checkout-ready, payment can proceed.

### Step 5 — Post-payment internal handling
The business later:
- prepares the order
- books a courier manually through Uber or Bolt
- shares ride details externally where needed

### Product note
The app should not pretend courier booking is automated if it is not.


# 9. Flow 6 — Intercity Pickup Transfer Flow

## Goal
Handle orders outside Lisbon honestly and operationally.

## Flow

### Step 1 — Customer selects intercity transfer
Can happen directly or after the system detects their location or order intention.

### Step 2 — System explains the model
The user must understand:
- this is not home delivery
- pickup is from a receiving office in their city
- office hours matter
- weekend limitations may apply

### Step 3 — System collects:
- destination city
- requested date
- contact details
- any timing-related notes

### Step 4 — Validation checks run
The system must validate:
- whether the timing is realistic
- whether the selected day fits office constraints
- whether the order meets notice requirements

### Step 5 — Order proceeds or is corrected
If invalid timing is selected, the system must ask for another valid option.

### Step 6 — If valid and pricing is resolved, proceed
Otherwise move to manual review if needed.


# 10. Flow 7 — Manual Review Flow

## Goal
Handle requests that are operationally valid but not automatically resolvable.

## Reasons manual review may occur
- valid non-preset quantity without safe automatic pricing
- special edge-case fulfillment handling
- ambiguous operational case
- custom exception requiring human review

## Flow

### Step 1 — Validation flags manual review
Backend returns `manual_review_required`.

### Step 2 — Customer sees clear explanation
The system should explain that:
- the request is valid
- but final confirmation or pricing needs manual review

### Step 3 — Internal admin visibility
The order appears in the manual-review queue.

### Step 4 — Operator reviews and acts
Operator may:
- confirm pricing
- reject
- request follow-up
- convert into a valid order path


# 11. Flow 8 — Post-Order Status Flow

## Goal
Let the customer understand what stage their order is in after ordering.

## Flow

### Step 1 — Payment succeeds
Order is created or updated with paid state.

### Step 2 — Order enters tracked state
Possible statuses include:
- awaiting payment
- payment verified
- scheduled
- preparing
- ready for pickup
- out for delivery
- completed

### Step 3 — Customer sees status page or progress view
The system shows a visual progress or timeline experience.


# 12. Flow 9 — Admin Dashboard Overview Flow

## Goal
Give the business a central place to monitor activity.

## Entry point
- `/admin`

## Flow

### Step 1 — Admin enters dashboard
They see overview cards and summaries.

### Step 2 — Dashboard surfaces key visibility
- total orders
- payment-state summary
- manual-review count
- inquiry count
- delivery-mode summary
- key analytics highlights

### Step 3 — Admin navigates into detail pages
Possible destinations:
- orders
- inquiries
- manual review
- customers
- analytics
- modes


# 13. Flow 10 — Admin Order Management Flow

## Goal
Allow internal review and management of order records.

## Flow

### Step 1 — Admin opens orders list
Can filter by:
- order state
- payment state
- fulfillment type
- manual review status

### Step 2 — Admin opens an order detail
Sees:
- customer
- items
- quantity
- fulfillment
- payment
- notes
- manual-review flag

### Step 3 — Admin updates internal state
Can update:
- order status
- internal notes
- review outcome where applicable


# 14. Flow 11 — Admin Inquiry Management Flow

## Goal
Allow internal handling of inquiry-only requests.

## Flow

### Step 1 — Admin opens inquiry queue
Sees all inquiry submissions.

### Step 2 — Admin reviews inquiry detail
Sees:
- event type
- date
- guest count
- location
- notes
- contact information

### Step 3 — Admin takes follow-up action
Can:
- mark as in progress
- mark as followed up
- add notes
- convert into later sales follow-up


# 15. Flow 12 — Admin Mode Switching Flow

## Goal
Support controlled switching between standard ordering mode and event-specific mode.

## Entry point
- `/admin/modes`

## Flow

### Step 1 — Admin views current operating mode
The system shows whether standard mode or event mode is active.

### Step 2 — Admin changes mode
Possible modes:
- standard Affy's mode
- event mode, such as Portimao or AfroNation

### Step 3 — System changes public-facing behavior
Expected effects may include:
- hiding the regular main menu
- showing the fixed event menu
- changing order-entry options
- changing fulfillment rules
- changing messaging or visuals

### Important note
The flow should include confirmation so mode changes are not accidental.


# 16. Flow 13 — Analytics Review Flow

## Goal
Allow the business to learn from the platform data.

## Entry point
- `/admin/analytics`

## Flow

### Step 1 — Admin opens analytics page
Sees high-level insights.

### Step 2 — Page shows key data
Examples:
- total orders
- top items
- AI vs form order source
- repeat customers
- manual-review volume
- inquiry volume
- delivery-mode split

### Step 3 — Admin uses insight for business decisions
It supports:
- menu decisions
- fulfillment planning
- customer retention thinking
- staffing and operations planning


# 17. Edge Cases the Flows Must Support

The flows must explicitly support these cases:

- ambiguous menu request
- multilingual menu request
- invalid quantity below minimum
- invalid decimal quantity
- valid non-preset quantity
- unavailable requested slot
- delivery without address
- inquiry-only request
- mixed request
- manual review required
- intercity request on unrealistic timing
- payment success
- payment cancellation


# 18. Flow Integration Rule

- one trust layer
- one quantity logic
- one scheduling logic
- one inquiry-routing logic
- one checkout-readiness gate

This is what keeps the product consistent.


# 19. Final Note

The user flows in this product must reflect one core truth:
Affy's AI Ordering System is a structured ordering and operations platform that must behave correctly for customers and for the business.