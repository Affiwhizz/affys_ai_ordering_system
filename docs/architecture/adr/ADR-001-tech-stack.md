# ADR-001: V1 Tech Stack and Application Structure

## Status
Accepted

## Context
Affy’s AI Ordering System is being built as an MVP web application that needs to:

- provide a modern customer-facing website
- support AI-guided ordering
- support a quick order form fallback
- store structured order and customer data
- connect ordering to a payment flow
- remain simple enough to build, test, and iterate on quickly

At this stage, the product does not need a fully separate backend service. The goal is to move quickly while maintaining a clean, professional structure.

## Decision
V1 will be built as a full-stack Next.js application using the following stack:

- **Frontend:** Next.js + TypeScript + App Router + Tailwind CSS
- **Backend:** Next.js Route Handlers + Server Actions
- **Database:** Supabase
- **Payments:** Stripe
- **AI:** OpenAI API

The application code will live inside the `frontend/` folder.

## Rationale
This decision was made because:

- Next.js supports both frontend UI and backend logic in one application
- TypeScript improves code safety and maintainability
- App Router aligns with current Next.js architecture
- Tailwind CSS supports fast UI development
- Supabase provides a practical backend data layer for MVP development
- Stripe offers a clean payment handoff flow
- OpenAI API supports the conversational ordering assistant

Using a single full-stack Next.js application reduces architectural overhead and makes it easier to build the MVP without managing two separate codebases.

## Alternatives considered

### Option 1: Separate frontend and backend services
Example:
- Next.js frontend
- Express/Fastify backend

**Rejected for V1** because it adds more setup, more deployment complexity, and more moving parts than necessary at the MVP stage.

### Option 2: Static frontend with third-party automation only
Example:
- simple website
- external forms and automations

**Rejected** because it would not provide the structured AI-assisted workflow and engineering depth required for the product vision and portfolio value.

## Consequences

### Positive
- faster MVP development
- simpler local development setup
- easier deployment path
- cleaner early-stage iteration
- strong portfolio alignment with modern full-stack development

### Trade-offs
- backend logic remains tied to the Next.js application
- if the system becomes much larger later, architectural extraction may be needed

## Notes
This decision applies to V1 only. The architecture can be revisited in later versions if product scope or scale changes.