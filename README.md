# Affy's AI Ordering System

Affy's AI Ordering System is a full-stack AI-assisted food ordering and operations platform for Affy's.

It is being built to improve how customers place orders, how the business manages orders internally, and how product, customer, payment, and fulfillment data are captured in a structured way.

This is not just a website redesign. It is a real commerce and operations system designed around the actual realities of the business.

## What the platform is meant to do

The platform is designed to:

- let customers browse the real Affy's menu by category
- support AI-guided ordering in natural language
- support a quick non-AI order form
- validate quantities, scheduling, and fulfillment rules before checkout
- route catering-style or inquiry-only requests correctly
- support payment handoff only when an order is truly checkout-ready
- support customer-facing order review and progress visibility
- support internal admin handling, manual review, and analytics
- support future event-mode switching such as Portimao or AfroNation mode

## Product realities the system must reflect

The system is being modeled around how Affy's actually operates.

That includes:

- litre-based pricing for many main dishes
- piece-based pricing for pastries, proteins, and swallows
- preset priced quantities plus some valid non-preset whole-number quantities
- invalid decimal-half quantities such as 2.5 litres
- minimum order and notice-period rules
- local delivery coordination inside Lisbon through manually booked courier rides
- intercity order handling outside Lisbon through transport-office transfer and pickup
- inquiry-only service flows for catering-style requests
- WhatsApp-first communication for customer updates and delivery coordination

## Core customer-facing capabilities

- menu browsing
- AI ordering assistant
- quick order form
- multilingual order understanding
- quantity validation
- customization capture
- pickup and delivery selection
- valid date and time selection
- order review before checkout
- payment handoff
- order-status visibility

## Core business-facing capabilities

- admin dashboard
- order monitoring
- payment-state monitoring
- manual review handling
- inquiry monitoring
- customer lookup
- analytics and reporting
- mode switching for event-based selling

## Fulfillment models

The platform is being designed to support at least three fulfillment realities:

- `pickup`
- `local_delivery`
- `intercity_pickup_transfer`

### Local delivery
For local delivery, the customer provides an address and reachable WhatsApp number. The business may then book a courier manually through Uber or Bolt and share the trip details with the customer outside the app workflow where needed.

### Intercity pickup transfer
For intercity handling, the order is prepared in Lisbon, taken to a transport office such as Rodo Mail, and collected by the customer from the receiving office in their city. This is not home delivery and must respect office hours and operational constraints.

## Current architecture direction

V1 is being built as a full-stack Next.js application.

### Planned stack

- Frontend: Next.js + TypeScript + App Router + Tailwind CSS
- Backend: Next.js Route Handlers and server-side logic
- Database: Supabase
- Payments: Stripe
- AI: OpenAI API
- Anti-bot protection: Cloudflare Turnstile
- Deployment: Vercel
- Optional multilingual enhancement: Google Cloud Translation API
- Transactional email later: AWS SES

## Project status

The project is currently in the product-definition, architecture-alignment, and implementation-planning stage.

The repo already contains core product, architecture, data, AI, and UX documentation, and the system is being aligned to a broader V1 scope that includes admin, analytics, operations, compliance, and event-mode support.

## Repository structure

```text
affys_ai_ordering_system/
  docs/
    admin/
    ai/
    architecture/
      adr/
    compliance/
    data/
    operations/
    product/
    testing/
    ux/
  frontend/
  README.md
```

## Documentation map

### Product
```text
docs/product/prd.md
docs/product/product-plan.md
docs/product/mvp-scope.md
```

### UX
``` text
docs/ux/sitemap.md
docs/ux/user-flows.md
docs/ux/wireframes.md
```

### Architecture
```text
docs/architecture/system-overview.md
docs/architecture/api-contract.md
docs/architecture/adr/
Data
docs/data/data-model.md
```

### AI
```text
docs/ai/order-schema.json
docs/ai/prompt-strategy.md
Admin, compliance, operations, testing
docs/admin/
docs/compliance/
docs/operations/
docs/testing/
Build goals
```

This project is being built with two goals in mind:

- create a working digital ordering and operations system for Affy's
- create a strong, software engineering and AI product build with clear architecture, documentation, and implementation depth

## Notes
Portimao bowls (for afronation) are separate from the main Affy's menu and should not be mixed into the core website menu.

The product is being designed to support both present-day business operations and future controlled expansions such as event-mode switching, richer analytics, and stronger internal tooling.