# Affy's AI Ordering System
## Product Requirements Document (PRD)

### Version
PRD v1

### Status
Working product definition

### Owner
Affiong Akpanisong

### Product Type
AI-assisted food ordering and operations web platform


# 1. Executive Summary

Affy's AI Ordering System is a full-stack ordering and operations platform for Affy's food business.

It is being built to solve a real business problem while also serving as a serious software engineering and AI product build. The product is not simply a website redesign. It is a structured digital ordering, scheduling, payment, inquiry-routing, admin, and analytics platform designed to reduce manual back-and-forth, improve customer experience, and create a more scalable operating system for the business.

The system is meant to support two realities at the same time:

- the customer-facing experience of browsing, asking questions, placing valid orders, paying, and receiving updates
- the business-facing reality of managing orders, handling manual review, monitoring payments, switching operating modes, tracking customer behavior, and coordinating fulfillment

This document is intended to be presentation-ready. It brings together the product definition, system expectations, roadmap, compliance requirements, operational realities, and tooling strategy in one place.


# 2. Product Context

Affy's currently handles much of its ordering through direct chat and manual coordination. Customers often ask repeat questions such as:

- Are you available today?
- What is on the menu?
- How do I order?
- Can I pick up later?
- Do you deliver?
- How much is this quantity?

That process works, but it creates friction. It slows down response time. It keeps too much of the business tied to one person's availability. It makes customer and order data difficult to structure. It creates room for inconsistency in quantity handling, scheduling, delivery coordination, and payment communication.

The product response is to create a digital ordering and operations platform that handles those interactions more cleanly and consistently.


# 3. Product Vision

Affy's AI Ordering System should become the digital operating layer for Affy's.

At a customer level, it should allow someone to:

- browse the menu clearly
- ask questions in natural language
- order through AI guidance or a quick form
- choose a valid quantity
- select a valid date and time
- choose pickup or delivery correctly
- pay only when the order is truly ready for checkout
- understand what happens next after ordering

At an operational level, it should allow the business to:

- reduce repeated manual chat handling
- capture structured customer and order data
- route catering-style services into inquiry flow
- manage local and intercity fulfillment correctly
- monitor order and payment states
- review manual-pricing cases
- analyze order trends and customer behavior
- switch into event-specific selling modes when needed


# 4. Product Goals

## 4.1 Primary Goals

- allow customers to place valid orders without relying on constant manual WhatsApp back-and-forth
- support both AI-guided ordering and quick-form ordering
- validate quantity, scheduling, delivery mode, and business rules before checkout
- route inquiry-only requests correctly
- capture structured customer and order data
- support internal order, payment, and customer management through admin tools

## 4.2 Secondary Goals

- support multilingual customer input
- support future event-mode switching, such as Portimao or AfroNation mode
- support manual delivery workflows inside the system instead of pretending there is a native courier integration
- provide a strong engineering portfolio artifact with visible technical depth

## 4.3 Strategic Goals

- make the business more scalable
- build an internal data foundation for analytics and future automation
- create a real AI-assisted commerce product rather than a static website
- document the work in a way that is credible to recruiters, collaborators, and future partners


# 5. Product Users

## 5.1 External Users

### Standard Customers
People who want to browse the menu and place orders.

### Customers Who Need Guidance
People who may not know exactly what they want and need AI-assisted ordering.

### Customers Submitting Inquiries
People who want buffet, food coolers, party packs, or other services that should not go through direct checkout.

### Customers Outside Lisbon
People whose orders may require transport-office handling rather than local courier drop-off.

### Multilingual Customers
People who may submit requests in English, Portuguese, or mixed language.

## 5.2 Internal Users

### Affiong Akpanisong
Primary business operator and admin user.

### Staff or Operator Support
Current or future staff who may need to:

- view orders
- monitor payments
- update order status
- manage manual review
- handle delivery coordination
- review inquiries
- monitor dashboards and analytics


# 6. Core Product Modules

## 6.1 Public Website
- homepage
- menu page
- about, contact, and catering sections
- standard ordering entry points

## 6.2 AI Ordering Assistant
- text-first guided ordering
- future voice support path
- multilingual understanding
- menu resolution and clarification
- quantity-rule handling
- scheduling and delivery logic

## 6.3 Quick Order Flow
- non-AI fallback ordering path
- same backend validation as the AI flow

## 6.4 Review and Checkout Flow
- review screen
- pricing confirmation
- checkout readiness logic
- Stripe handoff

## 6.5 Inquiry Flow
- inquiry-only service capture
- no forced standard checkout for catering-style requests

## 6.6 Admin Dashboard
- orders list
- payment-state monitoring
- order-state updates
- manual review queue
- inquiry monitoring
- customer lookup
- analytics summary
- mode switching

## 6.7 Analytics and Reporting
- order counts
- item popularity
- order-type trends
- repeat-customer visibility
- manual review counts
- inquiry counts
- delivery-mode split
- event-mode reporting later

## 6.8 Operating Mode Control
- standard Affy's mode
- Portimao or AfroNation mode
- future event-mode support


# 7. Scope

## 7.1 In Scope

### Customer-Facing Scope
- menu browsing
- AI ordering
- quick order form
- multilingual text understanding
- quantity rules
- spice-level selection where applicable
- scheduling by valid date and time
- pickup and delivery handling
- delivery-mode logic for Lisbon versus outside Lisbon
- payment handoff
- customer review step
- post-order status visibility

### Internal Scope
- admin dashboard
- order monitoring
- payment-state monitoring
- customer data access
- analytics layer
- order-management tools
- manual review handling
- inquiry management
- mode-switch system

### Legal, Compliance, and Security Scope
- privacy policy
- terms of use
- ordering policy
- GDPR-aware handling
- CCPA-aware handling if relevant
- vendor and subprocessor documentation
- data minimization review
- anti-bot form protection
- secret management
- data-retention policy

## 7.2 Out of Scope for Initial Release

These are not required for the first working release unless explicitly pulled in later:

- native courier marketplace integration that automatically books and tracks all deliveries end to end
- full customer sign-up and account management system
- loyalty program mechanics
- advanced recommender system based on long-term customer behavior
- enterprise-scale analytics warehouse
- fully automated pricing for all custom non-preset quantities where no safe pricing rule exists

## 7.3 Future Expansion Opportunities

- customer accounts and saved preferences
- repeat-order shortcuts
- loyalty and retention mechanics
- WhatsApp automation
- richer analytics dashboards
- deeper internal staff tooling
- voice ordering as a full first-class interaction layer
- multilingual menu rendering on the frontend
- marketing automation


# 8. Core Business Realities That Shape the Product

## 8.1 Menu Structure

The main website menu should reflect the real Affy's menu structure:

- Rice Dishes
- Stews and Sauces
- Soups
- Peppersoups
- Traditional Dishes
- Specials
- Sides and Protein
- Swallows
- Pastries and Small Chops
- Other Catering Services

Portimao bowls are separate and should not be mixed into the core website menu.

## 8.2 Quantity Logic

The menu shows preset quantities, but some larger whole-number quantities may still be accepted.

Examples:

- 5 litres may be valid even if 2L, 3L, and 4L are the displayed menu presets
- 7-piece pies may be valid even if 5 pieces is the displayed minimum
- quantities below the minimum are invalid
- decimal-half quantities like 2.5L are invalid

### Product Consequence

The platform must support:

- preset priced quantities
- valid non-preset quantities
- invalid quantity rejection
- manual pricing review when valid non-preset quantities do not have safe automatic pricing

## 8.3 Payment Before Preparation

The product must not move orders into preparation or delivery flow before payment is verified.

## 8.4 Scheduling

Customers must only choose valid date and time slots according to:

- operating hours
- fulfillment type
- blackout periods
- lead time
- special delivery rules

## 8.5 Delivery Geography Split

The delivery experience is not one single workflow. There are at least two delivery models.

### Lisbon-Area or Local Delivery

Operational workflow:

- customer gives address and a reachable number
- order is prepared
- courier is booked manually through Uber or Bolt by the operator
- customer receives ride or share details through chat or follow-up communication

### Outside Lisbon or Intercity Order Handling

Operational workflow:

- order is prepared fresh
- package is taken to Rodo Mail or a similar transport office
- the customer must pick up from the receiving office in their city
- there are timing constraints because many receiving offices close around 4:30 p.m.
- offices do not open on weekends
- this is not home delivery

### Product Consequence

The app must model delivery as at least:

- `pickup`
- `local_delivery`
- `intercity_pickup_transfer`

The product must not present intercity orders as if they are simple home delivery.

## 8.6 Event Mode Switching

The system must support a mode-switch capability so the same domain can run different selling configurations.

### Example

When switched into Portimao or AfroNation mode:

- regular main-menu ordering is hidden
- event-specific ordering UI is shown
- a fixed event menu is shown
- event pricing and payment behavior are shown
- event pickup or collection logic is shown
- visuals change to the event design

### Product Consequence

This should be built as a platform mode capability, not as a separate random site.


# 9. Product Feature Requirements in Detail

## 9.1 Menu and Catalog Requirements

The system must:

- display the real main Affy's menu by category
- support preset priced quantities
- support known customizations
- support multilingual matching via aliases and localized names
- distinguish standard items from inquiry-only services

## 9.2 Quantity and Pricing Requirements

The system must:

- validate minimum quantities
- reject invalid decimals where decimals are not allowed
- distinguish preset quantities from valid non-preset quantities
- route valid non-preset quantities to manual pricing review if automatic pricing is not safely defined
- store requested quantity and pricing-resolution mode

## 9.3 AI Ordering Requirements

The AI assistant must:

- understand mixed English, Portuguese, or multilingual input
- resolve menu items against aliases and localized names
- ask focused follow-up questions
- not guess prices or availability
- distinguish standard order flow from inquiry flow
- support quantity rules
- support scheduling flow
- support customer-contact collection
- hand off a structured order draft for backend validation

## 9.4 Quick Order Form Requirements

The quick order form must:

- work without AI
- support the same backend validation pipeline
- collect required customer and fulfillment information
- support quantity and customization capture

## 9.5 Scheduling Requirements

The system must:

- expose only valid slots
- reject invalid or blocked slots
- apply lead-time rules
- support different slot logic for different fulfillment types
- support future mode-specific availability

## 9.6 Delivery Requirements

### Local Delivery

The system must collect:

- delivery address
- reachable WhatsApp number
- requested time
- delivery instructions

The system should treat courier booking as a manual operator action for now.

### Intercity Transfer Orders

The system must:

- clearly explain the flow
- collect destination city and pickup expectations
- reflect that this is station or office pickup, not home delivery
- respect transport-office timing limitations
- prevent unrealistic weekend or after-hours transfer expectations

## 9.7 Checkout Requirements

The system must only create checkout when:

- required fields are complete
- quantity is valid
- availability has passed
- pricing is resolved
- inquiry-only conflicts are absent
- payment is truly the correct next step

## 9.8 Admin Dashboard Requirements

The admin platform must support:

- order list and filtering
- order detail view
- customer lookup
- payment-status monitoring
- order-status update controls
- manual review queue
- inquiry queue
- delivery-mode visibility
- intercity-transfer visibility
- event-mode switch control
- analytics cards

## 9.9 Analytics Requirements

At minimum, analytics should support:

- total orders
- top items
- specific item search
- repeat customers
- order-source split, AI versus form
- manual review count
- inquiry count
- delivery-mode split
- event-mode reporting later

## 9.10 Conversational AI Expansion

The product should be built with future support for:

- text-first now
- voice-enabled ordering later

This means the core order-capture model should be channel-neutral.

## 9.11 Spice-Level Requirement

Where relevant, the menu should support spice-level selection. This should be modeled as a controlled customization rather than freeform text.


# 10. Compliance, Privacy, and Policy Requirements

These are part of the product requirement set.

## 10.1 Privacy Policy

The product must have a privacy policy describing:

- data collected
- purpose of collection
- processors and vendors
- retention approach
- rights handling
- contact route

## 10.2 Terms of Use

The product must define:

- usage expectations
- order limitations
- payment expectations
- cancellation and refund references
- inquiry-only flow caveats

## 10.3 Ordering Policy

The product must clearly state:

- minimum-order rules
- notice periods
- delivery-model limitations
- quantity rules
- allergy notice

## 10.4 GDPR-Aware Design

The build must follow privacy-by-design principles, including:

- data minimization
- purpose limitation
- transparency
- controlled access
- retention awareness

## 10.5 CCPA-Aware Posture

If relevant, the product should support notice and rights awareness for California users.

## 10.6 Security Requirements

The system must include:

- bot protection on forms
- secrets management
- server-side validation
- controlled admin access
- clean logging practices
- dependency hygiene

## 10.7 Data Governance Requirements

The product should define:

- what customer data is collected
- why it is collected
- where it is stored
- who can access it
- how long it is kept
- how user-rights requests would be handled


# 11. Non-Functional Requirements

## Performance
- fast page loads
- responsive UI
- efficient search and validation

## Reliability
- no checkout without validation
- state transitions must be consistent
- payment and order states must stay synchronized

## Usability
- clear customer flows
- simple question progression
- visible next action
- transparent manual review situations

## Maintainability
- docs-first build
- structured API contracts
- typed request and response shapes
- explicit business-logic modules

## Portfolio Quality
- serious architecture narrative
- visible engineering process
- clean repo story


# 12. System and Product Architecture Summary

## 12.1 Core Architecture Direction

The product is designed as a full-stack Next.js application.

### Planned Stack

- Frontend: Next.js + TypeScript + App Router + Tailwind CSS
- Backend: Next.js route handlers and server-side logic
- Database: Supabase or Postgres-backed design
- Payments: Stripe Checkout
- AI: OpenAI API
- Anti-bot protection: Cloudflare Turnstile
- Deployment: Vercel
- Optional multilingual enhancement: Google Cloud Translation API
- Transactional email later: AWS SES
- Auth later if needed: Okta or Cognito, not both

## 12.2 Architecture Philosophy

- one primary repo
- docs-first workflow
- backend validation as system gatekeeper
- AI outputs structured drafts, not final truth
- frontend and AI converge into the same validation pipeline


# 13. Data and System Expectations

The platform must support structured modeling for:

- customers
- menu categories
- menu items
- menu aliases and localized names
- menu item variants
- quantity rules
- availability rules
- blackout periods
- orders
- order items
- payment records
- inquiry records
- admin-visible status states
- mode-switch configuration

The system should distinguish clearly between:

- preset priced quantities
- valid non-preset quantities
- invalid quantities
- checkout-ready states
- manual-review states
- inquiry-only states


# 14. Implementation Plan

This product is being built in five phases with 26 structured steps.

## Phase 1 — Contract and Design

### Step 1 — Initialize the project structure

#### What is done
- repository created
- docs scaffold created
- project directories created
- README and planning structure started

#### Why it matters
Creates the foundation for a serious build and avoids scattered work.

#### How it was done
- create the repo
- create the docs folders
- create the architecture, AI, data, and product documentation files
- commit the project skeleton

### Step 2 — Scaffold the real frontend app

#### What is done
- Next.js app scaffolded in `frontend/`
- TypeScript, App Router, Tailwind, and linting added
- local development app run successfully

#### Why it matters
Moves the project from planning into a real runnable application base.

#### How it was done
- scaffold the app
- verify the local run
- align the repo structure around a real implementation target

### Step 3 — Lock the V1 architecture decision

#### What is done
- full-stack Next.js chosen for V1
- separate backend service deferred
- ADR and architecture docs updated

#### Why it matters
Prevents over-engineering and gives the build a stable technical direction.

#### How it was done
- update the README
- write the system overview
- document the stack decision

### Step 4 — Define the core data model

#### What is done
The conceptual data model was designed to cover:
- customers
- categories
- menu items
- menu item variants
- quantity rules
- availability rules
- blackout periods
- orders
- order items
- payments

#### Why it matters
The data model determines what the rest of the system can do reliably.

#### How it was done
By translating the real Affy's menu and operational logic into structured entities and relationships.

### Step 5 — Define the AI order capture schema

#### What is done
A structured schema was designed for how the AI assistant captures customer order drafts.

#### Why it matters
The AI needs to return machine-usable structured data, not vague summaries.

#### How it was done
By defining fields for:
- intent
- items
- quantity
- fulfillment
- customer details
- missing fields
- ambiguity
- validation state
- next action

### Step 6 — Define AI prompt strategy and conversation policy

#### What is done
A production-oriented AI behavior policy was designed covering:
- multilingual input
- item resolution
- quantity handling
- preset versus non-preset quantity logic
- customization rules
- availability checks
- inquiry-only routing
- review and checkout gating
- backend and tool boundaries

#### Why it matters
A schema alone does not guarantee reliable AI behavior.

#### How it was done
By writing a policy that separates:
- system rules
- conversation rules
- validation and tool boundaries

### Step 7 — Define the backend contract

#### What is being done
Create the explicit handshake between:
- frontend
- AI draft flow
- backend validation
- checkout creation
- inquiry creation
- admin-readable states

#### Why it matters
This turns the product into a structured system instead of a loose set of pages and AI ideas.

#### How it is done
Document the API contract for:
- order-draft validation
- AI order-draft normalization
- menu search
- slot lookup
- checkout creation
- inquiry creation
- manual review outcomes

### Step 8 — Define the implementation backlog

#### What
Translate the architecture into actual work items.

#### Why
To avoid thinking in giant, fuzzy chunks.

#### How
Use both:
- GitHub Projects for engineering execution
- Notion for project HQ and operating notes

### Step 9 — Design the database implementation plan

#### What
Convert the conceptual data model into an implementation-ready database design.

#### Why
Conceptual modeling is not enough to build safely.

#### How
Define:
- final table columns
- PK/FK relationships
- nullability rules
- indexes
- enum handling
- migration order

### Step 10 — Seed real menu data

#### What
Turn the real Affy's menu into machine-usable menu records.

#### Why
The assistant, frontend, validation engine, and backend all depend on real menu data.

#### How
Prepare:
- category seeds
- menu item seeds
- preset priced quantity seeds
- quantity rules
- aliases and localized names
- ordering modes
- customization rules

## Phase 2 — Backend Logic and Core Systems

### Step 11 — Build the validation rules engine

#### What
Implement the business logic that decides whether an order is valid.

#### Why
This is the trust layer of the product.

#### How
Build reusable validation functions for:
- item existence
- activity state
- ordering mode
- quantity validity
- minimum-order value
- notice periods
- required fields
- inquiry-only routing
- manual-review triggers

### Step 12 — Build the availability engine

#### What
Implement valid date and time slot logic.

#### Why
Customers must only book real available slots.

#### How
Use:
- availability rules
- blackout periods
- fulfillment type
- lead times
- slot generation logic

### Step 13 — Implement the AI order-draft flow

#### What
Connect AI extraction to backend normalization and validation.

#### Why
Because this is where the AI becomes part of a reliable ordering system rather than a freeform chat layer.

#### How
- send AI request using a structured schema
- normalize AI output
- merge into order-draft shape
- pass the draft into the validation pipeline

### Step 14 — Build the quick order-form flow

#### What
Implement the non-AI ordering path.

#### Why
Not every customer wants to chat with AI.

#### How
Build a form flow that captures the same core fields and sends them into the same backend validation path.

### Step 15 — Build the AI ordering interface

#### What
Create the AI ordering UI.

#### Why
This is one of the signature features of the product.

#### How
Design:
- controlled chat flow
- guided questioning
- live order summary
- fallback to quick form
- stage-aware conversation UX

### Step 16 — Build the review screen

#### What
Create the summary gate before checkout.

#### Why
The customer must see exactly what they are about to submit.

#### How
Render:
- customer details
- fulfillment details
- date and time
- line items
- quantity
- customization
- price or manual-review state

### Step 17 — Implement Stripe checkout handoff

#### What
Create payment-session creation for checkout-ready orders.

#### Why
Order capture should lead into payment cleanly.

#### How
- create the Stripe checkout session
- connect the validated order state to the payment attempt
- redirect correctly

### Step 18 — Implement payment result handling

#### What
Update order and payment states after payment events.

#### Why
The product depends on payment verification before preparation or delivery.

#### How
- receive payment success, cancellation, or webhook events
- update payment records
- update order payment state
- move the order to the right next state

## Phase 3 — Frontend UX and Product Experience

### Step 19 — Build the menu page

#### What
Create the customer-facing menu experience.

#### Why
Customers need a clear way to browse what is available.

#### How
Render category-driven menu UI with:
- images where available
- preset quantities
- item descriptions
- quick-order CTAs
- AI-help CTAs
- inquiry presentation for services

### Step 20 — Build the homepage and site shell

#### What
Create the public website structure around the ordering system.

#### Why
This is still a brand website, not only a utility panel.

#### How
Build:
- homepage
- nav
- footer
- brand sections
- menu and order entry points
- catering, contact, and about sections

### Step 21 — Build the order-progress experience

#### What
Create the visual status and progress experience for customers.

#### Why
Customers should understand what stage their order is in after checkout.

#### How
Use order status and timestamps to render:
- payment received
- payment verified
- scheduled
- preparing
- ready for pickup
- out for delivery
- completed

## Phase 4 — Operations, Compliance, and Quality

### Step 22 — Build the basic admin or operator view

#### What
Create the simplest useful internal view for order handling.

#### Why
The business still needs to inspect, track, and update order states.

#### How
Start with:
- dashboard views
- manual-review visibility
- inquiry visibility
- payment visibility
- customer lookup

### Step 23 — Test the core flows

#### What
Run scenario-based testing.

#### Why
Real system quality appears when edge cases are tested.

#### How
Test:
- preset quantity flow
- valid non-preset quantity flow
- invalid decimal quantity
- below-minimum quantity
- multilingual request
- delivery without address
- unavailable slot
- inquiry-only request
- mixed request
- payment success or cancel
- manual-review path

### Step 24 — Refine the AI behavior after testing

#### What
Tune prompts, schema, alias handling, and validation after observing real behavior.

#### Why
The first AI behavior pass is never the final one.

#### How
Review:
- ambiguity failures
- quantity misunderstanding cases
- language-resolution issues
- inquiry-routing issues
- poor next-question behavior

## Phase 5 — Portfolio and Visibility

### Step 25 — Write the engineering story for the repo

#### What
Turn the build into a strong portfolio artifact.

#### Why
A good product can still be presented badly. This step ensures that does not happen.

#### How
Upgrade the README and docs to communicate:
- the problem
- the business context
- the architecture
- the AI workflow
- multilingual support
- quantity-rule logic
- scheduling logic
- validation philosophy
- payment flow
- screenshots and demo path

### Step 26 — Publish the build story publicly

#### What
Document and share the project journey.

#### Why
This supports personal brand, public proof of work, and opportunity creation.

#### How
Publish through:
- Substack
- LinkedIn
- GitHub
- later project walkthroughs or demo content


# 15. Cross-Cutting Compliance, Privacy, and Security Workstreams

These are not optional afterthoughts. They must be woven into the build as it develops.

## 15.1 Data Inventory and Governance

Define:
- what customer data is collected
- why it is collected
- where it is stored
- which services process it
- who can access it
- how long it should be retained

## 15.2 Privacy Policy Drafting

Prepare a privacy policy that explains at minimum:
- controller identity
- categories of data collected
- purpose of collection
- legal basis where relevant
- payment provider involvement
- analytics or cookies if any
- retention approach
- rights-handling route
- contact channel

## 15.3 Terms of Use and Ordering Policy

Prepare documents that explain:
- use of the site
- ordering expectations
- delivery limitations
- quantity and notice-period rules
- cancellation or refund expectations
- allergy notice

## 15.4 GDPR-Aware Implementation

Build with privacy-by-design principles in mind, including:
- minimization
- purpose limitation
- transparency
- controlled access
- structured retention awareness

## 15.5 CCPA-Aware Implementation

Where relevant, prepare for notice and rights-handling logic appropriate to California users.

## 15.6 Vendor and Subprocessor Awareness

Maintain awareness of external services involved in the system, such as:
- Vercel
- Supabase
- Stripe
- OpenAI
- Cloudflare
- Google Cloud if used
- AWS SES if used later

## 15.7 Security-by-Design Practices

Implement:
- anti-bot form protection
- secrets management
- rate-limiting strategy where needed
- input validation and sanitization
- careful logging and error hygiene
- admin access protection
- dependency hygiene


# 16. Tools, Platforms, and Systems Used in the Project

## 16.1 Core Engineering and Development

### GitHub
Used for:
- repository hosting
- version control
- pull requests
- issue tracking
- docs
- public engineering history

### GitHub Projects
Used for:
- backlog management
- roadmap tracking
- issue organization
- milestone planning
- work status visibility

### VS Code
Used for:
- coding
- markdown editing
- terminal access
- extension-based workflow support

### Terminal
Used for:
- scaffolding
- git operations
- package management
- scripts
- local development commands

## 16.2 Product and Project Operating Tools

### Notion
Used for:
- project HQ
- product notes
- scope management
- decision log
- operating dashboard
- internal planning
- build-in-public planning structure

### Substack
Used for:
- build-in-public documentation
- engineering journey writing
- public narrative and portfolio support

## 16.3 Frontend and Full-Stack Application Tools

### Next.js
Used for:
- frontend rendering
- routing
- server-side logic
- API endpoints
- application architecture

### TypeScript
Used for:
- type safety
- typed request and response shapes
- frontend and backend consistency

### Tailwind CSS
Used for:
- UI styling
- responsive layout work
- faster frontend iteration

## 16.4 Data and Backend Platforms

### Supabase
Used for:
- database foundation
- relational data storage
- query and admin convenience in early stages

### Postgres-Style Relational Modeling
Used for:
- orders
- payments
- quantity rules
- scheduling rules
- customer records
- inquiry data

## 16.5 AI and Language Tooling

### OpenAI API
Used for:
- AI order-draft extraction
- AI-assisted ordering conversations
- structured output generation
- multilingual input understanding

### Structured JSON Schemas
Used for:
- predictable AI outputs
- machine-usable order drafts
- safer backend handoff

### Google Cloud Translation API, optional
Used for:
- deterministic translation support for multilingual customer input if needed beyond LLM-only handling

## 16.6 Payments, Email, and Communication

### Stripe
Used for:
- checkout sessions
- payment handoff
- payment status handling
- post-payment state updates

### AWS SES, planned later
Used for:
- transactional email
- order confirmation email
- inquiry confirmation email
- payment follow-up notifications

### WhatsApp as Business Contact Channel
Used for:
- customer communication
- delivery coordination
- operator follow-up

## 16.7 Security and Abuse Prevention

### Cloudflare Turnstile
Used for:
- form protection
- anti-bot checks on inquiry or order entry points

### Environment Variable Management
Used for:
- secret storage
- API key protection
- configuration hygiene

## 16.8 Deployment and Platform Operations

### Vercel
Used for:
- deployment
- environment management
- preview builds
- production hosting for the Next.js app

### Domain and DNS Management
Used for:
- production routing
- custom-domain setup
- environment availability

## 16.9 Future Authentication Options

### Okta
Potential future use for:
- authentication
- authorization
- protected internal or admin systems if needed

### Amazon Cognito
Potential future alternative for:
- customer or staff identity handling
- protected account flows

## 16.10 Tools Deliberately Not Forced Into the Initial Build

### Asana
Not required as a core project-management system because GitHub Projects and Notion already cover the engineering and product-planning workflow well.

### Snowflake
Not required for the initial build because the current product bottleneck is ordering and operations, not enterprise data warehousing.


# 17. Deliverables Expected from the Project

By the time the system reaches a strong first release, the project should produce:

- a working web platform
- a structured AI ordering experience
- a validated quick-order flow
- a review-and-checkout system
- inquiry routing
- admin and dashboard capability
- analytics foundation
- policy pages
- architecture and data documentation
- a portfolio-grade repo story
- public build documentation


# 18. Success Criteria

The product should be considered successful when:

- customers can place valid orders without heavy manual chat dependency
- AI and form inputs converge into the same validation system
- quantities are handled correctly
- local versus intercity delivery realities are represented honestly
- manual review is treated as a real system state, not hidden confusion
- inquiry-only flows are separated properly
- admins can monitor and manage orders
- analytics begin to provide useful business insight
- privacy and operational policies are present
- the project reads as a serious product build and engineering proof artifact


# 19. Closing Statement

Affy's AI Ordering System is being built as both a real business platform and a serious engineering product. That means the standard for this work is not just whether the pages look good. The standard is whether the system behaves correctly, reflects the real business honestly, protects customer data responsibly, and stands up as a strong example of thoughtful software and AI product design.