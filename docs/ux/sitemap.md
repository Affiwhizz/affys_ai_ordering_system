# Affy's AI Ordering System
## Sitemap

### Status
Working sitemap for V1 product structure


# 1. Purpose

This document defines the high-level page and route structure for Affy's AI Ordering System.

It is used to:
- map the product's public-facing pages
- map the ordering experience
- map the internal admin experience
- identify policy and trust pages
- support future expansion such as event-mode switching

This is a structural UX document, not a visual design document.


# 2. Sitemap Principles

The sitemap should reflect the real product structure.

That means it must support:
- customer browsing
- customer ordering
- inquiry routing
- post-order visibility
- internal admin operations
- analytics visibility
- policy and trust pages
- future mode-switching capability

The product should not feel like a set of disconnected screens.  
It should feel like one coherent platform.


# 3. Public Site Structure

## Root
- `/`

## Core public pages
- `/`
- `/menu`
- `/order`
- `/catering`
- `/about`
- `/contact`

## Trust and policy pages
- `/privacy`
- `/terms`
- `/ordering-policy`

## Optional future trust pages
- `/faq`
- `/refund-policy`


# 4. Ordering Entry Structure

## Main ordering hub
- `/order`

This page should act as the main entry point into ordering and should let the user choose between:
- AI ordering
- quick order
- inquiry path where relevant

## AI ordering
- `/order/ai`

## Quick order
- `/order/quick`

## Review
- `/order/review`

## Checkout result pages
- `/order/success`
- `/order/cancelled`

## Order progress or tracking
- `/order/status`
- `/order/status/[orderCode]`


# 5. Inquiry Structure

Some services should not go through direct checkout.

These should route into inquiry flow.

## Inquiry entry points
- `/catering`
- `/order/inquiry`

## Inquiry submission result
- `/order/inquiry/success`


# 6. Menu Structure

## Main menu page
- `/menu`

This page should support:
- browsing by category
- item selection
- preset quantity visibility
- inquiry-only tagging where relevant
- AI ordering CTA
- quick order CTA

## Optional future menu sub-routes
These are not strictly required for V1, but the structure should allow them later:
- `/menu/[category]`
- `/menu/[category]/[itemSlug]`


# 7. Customer Journey Pages

## Awareness and trust
- `/`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/ordering-policy`

## Browse and decide
- `/menu`
- `/catering`

## Order
- `/order`
- `/order/ai`
- `/order/quick`
- `/order/review`

## Pay
- Stripe handoff occurs externally after `/order/review`

## Post-order
- `/order/success`
- `/order/status`
- `/order/status/[orderCode]`


# 8. Admin and Internal Structure

The product now includes a real internal operations layer.

## Admin entry
- `/admin`

## Admin pages
- `/admin`
- `/admin/orders`
- `/admin/orders/[orderId]`
- `/admin/manual-review`
- `/admin/inquiries`
- `/admin/customers`
- `/admin/analytics`
- `/admin/settings`
- `/admin/modes`


# 9. Admin Page Intent

## `/admin`
Admin overview dashboard.

Should show:
- order summary
- payment summary
- inquiry summary
- manual-review summary
- delivery-mode summary
- high-level analytics cards

## `/admin/orders`
Main orders list.

Should support:
- filtering
- sorting
- status visibility
- payment visibility
- fulfillment visibility

## `/admin/orders/[orderId]`
Single order detail view.

Should support:
- line items
- customer details
- fulfillment details
- payment details
- internal notes
- manual-review visibility
- status update controls

## `/admin/manual-review`
Orders or line items that require human pricing or approval.

## `/admin/inquiries`
Inquiry-only submissions that need business follow-up.

## `/admin/customers`
Structured customer records and lookup.

## `/admin/analytics`
Analytics and business intelligence view.

## `/admin/settings`
General admin-level configuration.

## `/admin/modes`
Operating-mode control page for switching platform behavior.


# 10. Operating Mode Structure

The system should be able to support different business modes under the same domain.

## Default mode
Standard Affy's ordering mode.

## Future event mode
Portimao or AfroNation style mode.

This should affect:
- homepage messaging
- menu visibility
- ordering options
- fulfillment rules
- visuals
- operational behavior

## Mode-control location
- `/admin/modes`

## Future public-mode behavior
When event mode is active, the public-facing experience may dynamically change while keeping the same root domain.


# 11. Fulfillment-Sensitive UX Areas

The sitemap must support the fact that not all fulfillment flows are the same.

This affects:
- `/order/ai`
- `/order/quick`
- `/order/review`
- `/ordering-policy`
- `/admin/orders/[orderId]`

The experience must distinguish:
- pickup
- local delivery
- intercity pickup transfer

This does not require separate public pages for each flow, but the structure must support branching inside the ordering and review experience.


# 12. Policy and Trust Surface

The following pages are important because the product is handling personal data, orders, and payments:

- `/privacy`
- `/terms`
- `/ordering-policy`

These should not be treated as optional decorations.  
They are part of the product trust layer.


# 13. Navigation Structure

## Main public navigation
- Home
- Menu
- Order
- Catering
- About
- Contact

## Secondary trust/footer navigation
- Privacy
- Terms
- Ordering Policy

## Admin navigation
- Dashboard
- Orders
- Manual Review
- Inquiries
- Customers
- Analytics
- Modes
- Settings


# 14. Route Tree

```text
/
├── /menu
├── /order
│   ├── /order/ai
│   ├── /order/quick
│   ├── /order/review
│   ├── /order/success
│   ├── /order/cancelled
│   ├── /order/status
│   ├── /order/status/[orderCode]
│   └── /order/inquiry
│       └── /order/inquiry/success
├── /catering
├── /about
├── /contact
├── /privacy
├── /terms
├── /ordering-policy
└── /admin
    ├── /admin/orders
    ├── /admin/orders/[orderId]
    ├── /admin/manual-review
    ├── /admin/inquiries
    ├── /admin/customers
    ├── /admin/analytics
    ├── /admin/modes
    └── /admin/settings
```
# 15. V1 Priority Pages

The most important pages for the first serious release are:

Public
/
/menu
/order
/order/ai
/order/quick
/order/review
/order/success
/order/status/[orderCode]
/catering
/privacy
/terms
/ordering-policy
Internal
/admin
/admin/orders
/admin/orders/[orderId]
/admin/manual-review
/admin/inquiries
/admin/analytics
/admin/modes

# 16. Future Expansion Space

The sitemap should leave room for future additions such as:

/faq
/refund-policy
/menu/[category]
/menu/[category]/[itemSlug]
/account
/account/orders
/account/profile
/admin/staff
/admin/notifications

These do not need to be built immediately, but the architecture should not block them.

# 17. Final Note

The sitemap should communicate one important truth:

Affy's AI Ordering System is a customer ordering platform, an internal operations system, and a foundation for future event-mode selling under one product structure.