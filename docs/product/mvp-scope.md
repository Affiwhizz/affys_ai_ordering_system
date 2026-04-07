# Affy's AI Ordering System
## V1 Scope Definition

### Status
Active scope definition for the first release

### Owner
Affiong Akpanisong


# 1. Purpose

This document defines the scope of the first serious release of Affy's AI Ordering System.

It answers four questions:

- what must exist in V1
- what is intentionally included now
- what is intentionally deferred
- what must be true before the product can be considered release-ready

This is not a tiny prototype scope document.

This is the scope definition for the first real product version.


# 2. Scope Philosophy

V1 is meant to be a working and trustworthy product foundation.

It is not meant to automate every possible business operation on day one, but it must be strong enough to:

- support real customer ordering
- support real business operations
- reflect the real menu and fulfillment realities
- validate orders properly
- support internal visibility
- provide a strong technical and product foundation for future growth

The standard for V1 is not “good enough to demo.”  
The standard is “serious enough to use, explain, and build on.”


# 3. What V1 Must Achieve

V1 must allow the business to move from scattered manual order handling toward a structured digital workflow.

By the end of V1, the system should be able to:

- show the real main Affy's menu clearly
- help customers place orders through AI or through a quick form
- understand multilingual or mixed-language requests well enough to map them to the menu
- validate quantities correctly
- handle preset priced quantities and valid non-preset quantities properly
- reject invalid quantities such as below-minimum or unsupported decimal quantities
- support pickup, local delivery, and intercity pickup transfer flows
- validate scheduling before checkout
- route inquiry-only services out of normal checkout
- move only truly valid orders into payment
- show order progress after ordering
- give the business a usable admin and monitoring layer
- provide a first useful layer of analytics
- include a basic trust and compliance surface


# 4. In-Scope for V1

## 4.1 Public Website and Customer Entry

V1 includes:

- homepage
- navigation and site shell
- menu page
- contact and catering entry points
- ordering entry points

## 4.2 Menu and Catalog

V1 includes:

- real menu categories
- real menu items
- preset priced display quantities
- quantity-rule support
- item customizations where relevant
- multilingual aliases or localized names for menu resolution
- distinction between standard items and inquiry-only services

## 4.3 AI Ordering Assistant

V1 includes:

- text-based AI ordering
- guided conversation flow
- menu clarification
- quantity clarification
- fulfillment clarification
- scheduling clarification
- customer detail collection
- structured order-draft generation
- backend validation handoff

V1 does not require full voice ordering yet, but the model should be built in a way that does not block future voice support.

## 4.4 Quick Order Flow

V1 includes:

- non-AI order form
- same validation path as AI-assisted orders
- item and quantity selection
- customization capture
- fulfillment selection
- scheduling selection
- customer contact capture

## 4.5 Quantity Handling

V1 includes support for:

- preset priced quantities
- valid non-preset whole-number quantities where business rules allow them
- rejection of below-minimum quantities
- rejection of unsupported decimal quantities
- manual review for valid quantities that do not have safe automatic pricing

## 4.6 Fulfillment Handling

V1 includes three fulfillment realities:

- `pickup`
- `local_delivery`
- `intercity_pickup_transfer`

### Pickup
Customer collects directly.

### Local delivery
Customer provides address and WhatsApp number, and the operator handles courier booking manually outside the app flow where needed.

### Intercity pickup transfer
Customer order is prepared in Lisbon, transferred through a transport office such as Rodo Mail, and picked up by the customer from the receiving office in their city.

This flow must be clearly explained in the product and must not be presented as home delivery.

## 4.7 Scheduling and Availability

V1 includes:

- valid date selection
- valid time selection
- fulfillment-aware scheduling
- blackout-period handling
- lead-time handling
- rejection of unavailable or invalid slots

## 4.8 Checkout and Payment

V1 includes:

- review-before-checkout
- checkout readiness validation
- Stripe checkout handoff
- payment result handling
- payment state updates
- order state changes based on payment verification

V1 must not move an order into preparation or delivery flow before payment is verified.

## 4.9 Inquiry Handling

V1 includes:

- inquiry-only routing for services that should not go through instant checkout
- inquiry data capture
- inquiry submission path
- internal visibility for inquiry follow-up

## 4.10 Admin and Internal Operations

V1 includes a basic but real admin layer with:

- order list
- order detail visibility
- payment-state monitoring
- manual-review visibility
- inquiry visibility
- customer lookup
- delivery-mode visibility
- order-status update capability

## 4.11 Analytics Foundation

V1 includes a first useful analytics layer with:

- total orders
- top items
- order-source split
- repeat-customer visibility
- inquiry count
- manual-review count
- delivery-mode split

## 4.12 Event-Mode Foundation

V1 includes the architectural foundation for operating-mode switching.

That means the product should be designed so that the same system can later switch between:

- standard Affy's mode
- event-specific mode, such as Portimao or AfroNation mode

V1 does not require the final Portimao design to be completed yet, but the product structure must not block it.

## 4.13 Trust, Policy, and Compliance Surface

V1 includes:

- privacy policy draft
- terms of use draft
- ordering policy draft
- data governance notes
- anti-bot protection planning and implementation baseline
- privacy-aware and security-aware design choices


# 5. What Is Explicitly Deferred Beyond V1

The following are intentionally not required for the first serious release unless pulled in deliberately later:

- full voice ordering as a finished primary interface
- customer account creation and sign-in
- loyalty and rewards systems
- advanced customer recommendation engine
- fully automated courier dispatch and live courier tracking
- fully automated pricing engine for every possible non-preset quantity
- enterprise-grade analytics warehouse
- deep marketing automation
- highly advanced role-based admin system

These may still be designed for, but they are not required for V1 release readiness.


# 6. What V1 Is Not

V1 is not:

- a static brochure website
- a chat toy with no validation
- a fake checkout flow that ignores business rules
- a cosmetic prototype
- a generic delivery app pretending all deliveries work the same way

V1 is meant to be a working operating layer for the business.


# 7. Release-Critical Capabilities

The following are release-critical.

If these are missing, V1 should not be treated as truly ready.

## Customer ordering core
- menu browsing
- AI ordering or quick order capability
- valid quantity handling
- fulfillment selection
- schedule selection
- review step

## Backend trust layer
- item validation
- quantity validation
- availability validation
- inquiry-only routing
- checkout readiness logic
- payment-state handling

## Business operations core
- admin visibility
- manual-review visibility
- inquiry visibility
- payment visibility
- delivery-mode visibility

## Trust and policy baseline
- privacy surface
- ordering policy surface
- security baseline
- anti-bot form protection baseline


# 8. V1 Boundaries Around Pricing

Pricing must be handled honestly.

V1 may support two pricing states:

## Preset priced quantity
A quantity that directly matches a predefined priced option in the menu data.

## Manual-review quantity
A quantity that is valid operationally but does not have safe automatic pricing available yet.

The system must not pretend that every valid quantity automatically has final instant pricing.

Where pricing is unresolved, the system should use a clear manual-review path.


# 9. V1 Boundaries Around Delivery

Delivery must be modeled honestly.

V1 must distinguish:

- home pickup by customer
- local manually coordinated courier delivery
- intercity transfer for office pickup

The system must not hide these differences from customers.

Intercity transfer especially must be communicated clearly because:
- it depends on office timing
- it does not behave like home delivery
- it may not be practical on weekends or after certain hours


# 10. V1 Boundaries Around Event Mode

V1 should prepare the system to support event-mode switching without forcing that full experience into the initial release.

This means:

- the architecture must support mode-based menu presentation
- the architecture must support different ordering behavior by mode
- the architecture must support different visuals and fulfillment logic by mode

The final Portimao or AfroNation customer-facing mode can be built as a structured extension once the shared platform foundation is strong.


# 11. Success Criteria for V1

V1 should be considered successful when all of the following are true:

- customers can place valid orders digitally
- AI and quick form both feed into the same trust layer
- quantities are handled correctly
- invalid quantity cases are rejected properly
- local and intercity fulfillment paths are handled honestly
- inquiry-only services are separated correctly
- payment only happens when checkout is truly ready
- order progress can be shown after payment
- the business can monitor orders internally
- the business can monitor manual review and inquiries internally
- the system provides basic analytics visibility
- the product has enough policy and compliance surface to be trustworthy
- the repo and docs are strong enough to explain the build credibly


# 12. Working Rule for Scope Decisions

Any new feature should be judged by one question:

Does this make the first serious release more trustworthy, more operationally accurate, or more useful?

If yes, it may belong in V1.

If it adds complexity without improving trust, operational realism, or usability, it should likely be deferred.


# 13. Final Scope Statement

The first serious release of Affy's AI Ordering System includes the customer ordering experience, the validation and checkout trust layer, the admin and operations foundation, the analytics foundation, the fulfillment-mode realism, and the core policy and compliance surface needed to support a real business-facing product.