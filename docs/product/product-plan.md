# Affy's AI Ordering System
## Product Plan

### Status
Active product build plan

### Owner
Affiong Akpanisong

# 1. Purpose

This document puts the product vision into a practical build plan.

It focuses on:
- what is being built in this cycle
- how the work is grouped
- what the release path looks like
- what must exist before the product can be considered a strong V1

This is only an execution document, not the full product definition.  
The PRD remains the full product reference.


# 2. Product Summary

Affy's AI Ordering System is a full-stack AI-assisted food ordering and operations platform for Affy's.

The system is being built to support:

- customer-facing digital ordering
- AI-guided ordering conversations
- quick-order fallback flow
- validation of quantity, timing, and fulfillment rules
- internal order and inquiry management
- admin visibility and analytics
- future mode switching for event-based selling such as Portimao or AfroNation

This build is meant to produce both:
- a real business system
- a strong engineering portfolio project


# 3. Build Objectives

## Primary Objectives

- reduce manual ordering back-and-forth
- turn customer requests into structured, validated order data
- support checkout only when an order is truly ready
- create a usable admin and operations layer
- capture enough internal data to support analytics and future automation

## Secondary Objectives

- support multilingual customer input
- support multiple fulfillment models
- support inquiry-only service routing
- prepare the platform for future event-mode switching
- create a well-documented, recruiter-grade build


# 4. Build Scope for This Cycle

This cycle includes both customer-facing and internal features.

## Customer-facing scope

- homepage and site shell
- menu page
- AI ordering assistant
- quick order form
- review screen
- checkout handoff
- progress and status visibility
- multilingual request handling
- quantity-rule handling
- pickup, local delivery, and intercity transfer logic

## Internal scope

- admin dashboard foundation
- order list and detail view
- payment-state visibility
- manual-review handling
- inquiry handling
- customer lookup
- analytics foundation
- delivery-mode awareness
- mode-switch foundation

## Policy and compliance scope

- privacy policy outline
- terms outline
- ordering policy
- data governance notes
- security and abuse-protection planning


# 5. Product Tracks

The project is easiest to manage as parallel product tracks.

## Track 1 — Customer Ordering Experience
Covers:
- menu browsing
- AI ordering
- quick order form
- review and checkout
- order progress experience

## Track 2 — Validation and System Logic
Covers:
- quantity validation
- preset vs non-preset quantity handling
- notice-period rules
- availability validation
- inquiry-only routing
- checkout readiness logic
- payment-state transitions

## Track 3 — Operations and Fulfillment
Covers:
- local delivery handling
- intercity pickup transfer handling
- operator workflows
- order-state management
- manual-review flow
- delivery coordination visibility

## Track 4 — Admin and Analytics
Covers:
- admin dashboard
- order monitoring
- inquiry monitoring
- payment monitoring
- customer lookup
- analytics and reporting foundation

## Track 5 — Compliance and Trust
Covers:
- privacy policy
- terms of use
- ordering policy
- data handling notes
- anti-bot and security baseline

## Track 6 — Portfolio and Visibility
Covers:
- repo quality
- architecture docs
- testing notes
- README story
- public build documentation


# 6. Release Strategy

## V1 release goal

V1 should be a working platform that can:

- present the real menu clearly
- collect valid customer orders
- support AI-guided and non-AI ordering
- enforce quantity and scheduling rules
- support local delivery and intercity transfer logic
- route inquiry-only requests properly
- hand off valid orders to checkout
- show order status after checkout
- give the business basic admin and analytics visibility

## V1 release philosophy

The goal is not to automate every business operation immediately.

The goal is to build a trustworthy and extensible ordering platform with a strong business and engineering foundation.


# 7. Build Phases

## Phase 1 — Contract and Design
Focus:
- product definition
- architecture decisions
- data model
- AI policy
- backend contract
- implementation backlog
- menu seeding plan

## Phase 2 — Core Backend Logic
Focus:
- validation engine
- availability engine
- AI order-draft flow
- pricing-resolution logic
- payment-state handling

## Phase 3 — Customer Experience
Focus:
- quick order form
- AI ordering interface
- review screen
- menu page
- homepage
- order progress view

## Phase 4 — Operations and Admin
Focus:
- admin dashboard
- order monitoring
- inquiry handling
- manual-review visibility
- analytics foundation
- delivery-mode visibility

## Phase 5 — Quality, Compliance, and Presentation
Focus:
- testing scenarios
- policy docs
- README and documentation polish
- public build story


# 8. High-Level Build Sequence

The product should be built in this order:

1. define system contracts
2. define implementation backlog
3. finalize database implementation plan
4. seed real menu data
5. build validation logic
6. build availability logic
7. connect AI order capture to validation
8. build quick order flow
9. build AI ordering UI
10. build review and checkout flow
11. build payment result handling
12. build menu and public pages
13. build order progress experience
14. build admin dashboard foundation
15. build analytics foundation
16. create policy and compliance docs
17. test critical flows
18. refine weak points
19. package the project for portfolio visibility


# 9. Current Product Priorities

## Priority 1
Create a reliable ordering core:
- data model
- AI schema
- prompt strategy
- backend contract
- validation logic

## Priority 2
Create working customer flows:
- AI ordering
- quick order
- review
- checkout
- status

## Priority 3
Create internal visibility:
- admin dashboard
- manual review
- payment monitoring
- analytics

## Priority 4
Create trust and delivery realism:
- local vs intercity fulfillment modeling
- ordering policy
- privacy and compliance baseline
- anti-bot and security baseline


# 10. Key Product Risks

## Risk 1 — Scope expansion without structure
The product now includes ordering, admin, analytics, delivery logic, and policy work. Without disciplined sequencing, this can become messy.

### Response
Keep work grouped by phase and track. Document before building.

## Risk 2 — Quantity logic becoming inconsistent
Preset priced quantities, valid non-preset quantities, and invalid quantities must be handled consistently across AI, form, backend, and admin views.

### Response
Use one shared validation source of truth.

## Risk 3 — Delivery workflow mismatch
Local delivery and intercity transfer are fundamentally different. If the UI treats them the same, customers will be misled.

### Response
Model them as distinct fulfillment paths.

## Risk 4 — AI overpromising
If the AI guesses prices, timing, or fulfillment incorrectly, trust breaks.

### Response
Keep backend validation as the final gatekeeper.

## Risk 5 — Admin visibility arriving too late
If the customer-facing side is built without internal monitoring support, operations will still be chaotic.

### Response
Bring admin and analytics into the active build scope, not as an afterthought.


# 11. Success Definition for This Build Cycle

This build cycle is successful when the platform can:

- accept orders through AI and through form flow
- validate quantity and fulfillment rules correctly
- distinguish preset-priced vs manual-review quantity cases
- support local delivery and intercity transfer logic honestly
- route inquiry-only requests properly
- create checkout only for truly valid orders
- show post-order progress clearly
- provide admin visibility into orders, payments, and manual review
- support a first analytics layer
- stand as a strong product and engineering case study


# 12. Deliverables

The expected outputs for this cycle include:

- a working full-stack web application
- structured product documentation
- architecture documentation
- data model and backend contract
- AI ordering policy and schema
- menu and quantity logic implementation
- admin dashboard foundation
- analytics foundation
- compliance and policy drafts
- testing scenarios
- portfolio-grade repo presentation


# 13. Working Principle

The system should always favor:

- valid orders over rushed orders
- clear structure over guesswork
- real business logic over generic app assumptions
- operational honesty over fake automation
- strong engineering documentation over invisible decisions


# 14. Closing Note

Affy's AI Ordering System is being built as a serious product, not as a cosmetic prototype.

That means every major decision should help the product become:
- more usable for customers
- more manageable for the business
- more trustworthy operationally
- more credible as a software and AI engineering build