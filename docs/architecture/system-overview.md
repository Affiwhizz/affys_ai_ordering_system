# System Overview

## Overview
Affy’s AI Ordering System is being built as a full-stack Next.js application for V1.

The frontend user interface and backend application logic will live inside the same Next.js project located in the `frontend/` folder. This approach keeps the system simpler to build, easier to deploy and faster to iterate on during the MVP stage.

## V1 Architecture
The system will include the following layers:

- **Frontend:** Next.js App Router pages and components for the website UI
- **Backend:** Next.js Route Handlers and Server Actions for order handling, AI orchestration, and payment logic
- **Database:** Supabase for storing customers, orders, and related data
- **Payments:** Stripe for payment handoff and payment status tracking
- **AI Layer:** OpenAI API for guided conversational ordering and structured order capture

## WHy
For V1, a single full-stack Next.js application is the best fit because:

- the product is still in MVP stage
- the app has one main workflow
- there is no need yet for a completely separate backend service
- it reduces complexity in setup, deployment, and maintenance
- it allows faster iteration while building and testing the product

## Future flexibility
If the system grows in complexity later, the backend can be extracted into a separate service. For now, V1 will keep frontend and backend logic inside the same Next.js application.