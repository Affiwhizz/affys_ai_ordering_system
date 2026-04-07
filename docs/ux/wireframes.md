# Affy's AI Ordering System
## Wireframes

### Status
Working wireframe definition for V1

# 1. Purpose

This document defines the structural wireframes for the main screens in Affy's AI Ordering System.

It is used to:
- describe the layout of key pages
- clarify which UI blocks belong on each screen
- support later visual design and implementation
- keep the product structure consistent with the PRD, sitemap, and user flows

This is a low-to-mid fidelity product wireframe document.  
It describes layout and content structure, not final visual styling.


# 2. Wireframe Principles

The wireframes should follow these principles:

- clarity before decoration
- strong hierarchy
- clear next action on every important screen
- no fake automation
- operational honesty in delivery and manual-review states
- customer and admin views should both feel structured and trustworthy
- layouts should support mobile-first use, even if desktop admin views become richer later


# 3. Global Layout Patterns

## 3.1 Public Site Layout Pattern

Most public-facing pages should follow this structure:

### Header
- logo or brand mark
- navigation
- order CTA
- optional mobile menu trigger

### Main content area
- page-specific hero or title
- page-specific content blocks
- page-specific CTAs

### Footer
- contact details
- trust and policy links
- copyright or brand footer content

## 3.2 Ordering Layout Pattern

Ordering pages should prioritize:
- progress clarity
- current-step visibility
- customer reassurance
- clean structured input

A typical ordering layout can use:

### Left or main column
- active step or conversation area
- form or AI interaction area

### Right or side column
- live order summary
- fulfillment summary
- important rules or notices
- price estimate or manual-review note where relevant

On mobile, this should stack vertically.

## 3.3 Admin Layout Pattern

Admin pages should use a dashboard-style structure:

### Top bar
- page title
- quick actions
- status indicators

### Sidebar
- dashboard
- orders
- manual review
- inquiries
- customers
- analytics
- modes
- settings

### Main panel
- cards
- tables
- filters
- detail panels
- action buttons


# 4. Public Website Wireframes

## 4.1 Homepage

### Purpose
Introduce the brand, explain the platform, and move users toward browsing or ordering.

### Main sections

#### Header
- logo
- Home
- Menu
- Order
- Catering
- About
- Contact

#### Hero section
- headline
- short value proposition
- primary CTA: Start Ordering
- secondary CTA: View Menu

#### How it works section
- browse
- order with AI or quick form
- review and pay
- receive updates

#### Featured highlights
- signature dishes or menu categories
- visual cards or tiles

#### Ordering options section
- AI ordering card
- quick order card
- catering inquiry card

#### Trust section
- payment-before-preparation note
- clear fulfillment note
- quality or service note

#### Footer
- privacy
- terms
- ordering policy
- contact info


## 4.2 Menu Page

### Purpose
Allow customers to browse the real menu clearly and start ordering.

### Main layout

#### Header
Standard public header

#### Page intro
- title: Menu
- short explanation
- optional note about categories or ordering rules

#### Category navigation
- tabs, chips, or side navigation for:
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

#### Item grid or list
Each item card should include:
- image if available
- item name
- short description
- preset quantity examples
- optional customization hint
- tag if inquiry-only
- CTA: Order
- CTA: Ask AI

#### Notes block
Important visible notes such as:
- quantity rules
- notice-period reminders
- allergy note


## 4.3 Catering Page

### Purpose
Explain inquiry-only or service-based offerings and guide customers into inquiry flow.

### Main sections

#### Hero
- Catering / Services title
- short explanation that some services are handled by inquiry

#### Service blocks
Examples:
- buffet
- party packs
- cocktail reception
- food coolers
- event catering

#### Inquiry CTA
- Start Inquiry

#### Process section
- tell us what you need
- submit your details
- receive follow-up


## 4.4 Contact Page

### Purpose
Provide clear business contact entry points.

### Main sections
- page title
- short contact introduction
- contact form or contact blocks
- WhatsApp or business contact details
- optional FAQ teaser


# 5. Ordering Experience Wireframes

## 5.1 Order Entry Hub

### Route
`/order`

### Purpose
Let the customer choose how they want to order.

### Main layout

#### Page intro
- title: Start Your Order
- short explanation

#### Choice cards
- Order with AI
- Quick Order
- Catering / Inquiry

Each card should include:
- short description
- CTA button

#### Important ordering notes
- WhatsApp required for order coordination
- quantity and availability validation happens before checkout
- some services are inquiry-only


## 5.2 AI Ordering Page

### Route
`/order/ai`

### Purpose
Provide a guided AI ordering conversation.

### Main layout

#### Header area
- page title
- short reassuring note
- optional back link to Order Hub

#### Main conversation panel
- assistant messages
- customer input area
- suggested reply chips or buttons where useful

#### Side or summary panel
- current order draft
- selected items
- quantity
- fulfillment
- requested date/time
- missing info indicator
- estimated next step

#### Notice area
Can include:
- quantity rules
- fulfillment realities
- inquiry-only note where relevant

#### Input area
- message box
- send button
- optional quick suggestions

### Key wireframe requirement
The page must visibly feel like a guided system, not a generic chatbot.


## 5.3 Quick Order Page

### Route
`/order/quick`

### Purpose
Allow structured non-AI ordering.

### Main layout

#### Page header
- title
- short explanation

#### Form blocks

##### Section 1 — Items
- item selector
- quantity input or selector
- customization selector
- add another item button

##### Section 2 — Fulfillment
- pickup
- local delivery
- intercity pickup transfer

##### Section 3 — Scheduling
- date selector
- time selector
- availability-aware UI

##### Section 4 — Customer details
- full name
- WhatsApp number
- email optional

##### Section 5 — Address or destination details
Conditional based on fulfillment type

#### Side or bottom summary
- selected items
- quantity
- fulfillment
- timing
- estimate or review note

#### Submit CTA
- Validate Order / Continue to Review


## 5.4 Review Page

### Route
`/order/review`

### Purpose
Let the customer confirm the order before payment.

### Main layout

#### Page title
- Review Your Order

#### Review sections

##### Items summary
- item names
- quantity
- customizations
- notes

##### Fulfillment summary
- pickup / local delivery / intercity pickup transfer
- timing
- destination or address details

##### Customer summary
- name
- WhatsApp
- email if provided

##### Price section
- subtotal
- fees if any
- total estimate
- or manual-review notice if pricing is unresolved

#### Important status block
If manual review is required, show it clearly and prominently.

#### Primary CTA
- Proceed to Payment
- or Submit for Manual Review, depending on system state

#### Secondary CTA
- Edit Order


## 5.5 Order Success Page

### Route
`/order/success`

### Purpose
Confirm successful order or payment outcome.

### Main sections
- success headline
- order reference
- short next-step explanation
- CTA to view order status
- CTA to return to home or menu


## 5.6 Order Cancelled Page

### Route
`/order/cancelled`

### Purpose
Handle cancelled or incomplete payment return.

### Main sections
- cancellation headline
- short explanation
- CTA to return to review
- CTA to restart order if needed


## 5.7 Order Status Page

### Route
`/order/status/[orderCode]`

### Purpose
Show customer-facing progress after order submission.

### Main layout

#### Header
- order reference
- current status label

#### Progress section
Visual timeline or stepper showing:
- awaiting payment
- payment verified
- scheduled
- preparing
- ready for pickup / out for delivery
- completed

#### Order summary
- items
- quantity
- fulfillment
- date/time
- contact summary

#### Support or info block
- what happens next
- contact prompt if needed


# 6. Fulfillment-Specific UI Wireframes

## 6.1 Pickup UI Treatment

Should show:
- pickup location
- selected date/time
- clear pickup expectation

## 6.2 Local Delivery UI Treatment

Should show:
- address collection
- delivery instructions
- WhatsApp requirement
- note that courier coordination is handled operationally after validation and payment

## 6.3 Intercity Pickup Transfer UI Treatment

Should show:
- destination city
- station or office pickup expectation
- timing limitations
- office-hours awareness
- non-home-delivery explanation

This should be a clearly different experience from local delivery.


# 7. Inquiry Flow Wireframes

## 7.1 Inquiry Page

### Route
`/order/inquiry`

### Purpose
Capture inquiry-only requests.

### Main layout

#### Intro block
- title
- explanation that this flow is for services requiring follow-up

#### Inquiry form fields
- service type
- event date
- guest count
- location
- notes
- full name
- WhatsApp number
- email optional

#### CTA
- Submit Inquiry


## 7.2 Inquiry Success Page

### Route
`/order/inquiry/success`

### Purpose
Confirm inquiry submission.

### Main sections
- success message
- inquiry reference if available
- follow-up expectation
- back to home or menu CTA


# 8. Admin Wireframes

## 8.1 Admin Dashboard

### Route
`/admin`

### Purpose
Give an overview of platform activity.

### Main layout

#### Sidebar
- Dashboard
- Orders
- Manual Review
- Inquiries
- Customers
- Analytics
- Modes
- Settings

#### Top summary cards
- total orders
- pending/manual review
- inquiry count
- paid orders
- delivery split summary

#### Secondary panels
- latest orders
- latest inquiries
- manual review queue preview


## 8.2 Orders List Page

### Route
`/admin/orders`

### Purpose
View and filter all orders.

### Main layout

#### Top controls
- search
- filter by status
- filter by payment state
- filter by fulfillment type
- filter by manual-review status

#### Orders table or list
Columns may include:
- order reference
- customer
- fulfillment type
- status
- payment status
- created date
- manual-review indicator


## 8.3 Order Detail Page

### Route
`/admin/orders/[orderId]`

### Purpose
Inspect and manage a single order.

### Main sections
- order reference and status
- customer details
- line items
- quantity and pricing resolution
- fulfillment details
- payment details
- internal notes
- status update controls
- manual-review visibility


## 8.4 Manual Review Page

### Route
`/admin/manual-review`

### Purpose
Show orders that require human intervention.

### Main sections
- manual review queue
- reason for review
- requested quantity
- pricing status
- action buttons
  - approve
  - reject
  - request follow-up
  - add note


## 8.5 Inquiry Management Page

### Route
`/admin/inquiries`

### Purpose
Handle inquiry submissions.

### Main sections
- inquiry list
- filters
- detail panel
- follow-up status
- notes


## 8.6 Customers Page

### Route
`/admin/customers`

### Purpose
Support customer lookup and relationship visibility.

### Main sections
- search
- customer list
- order history preview
- inquiry history preview
- contact details


## 8.7 Analytics Page

### Route
`/admin/analytics`

### Purpose
Present useful business insights.

### Main sections
- KPI cards
- top items
- order source split
- delivery mode split
- repeat customers
- manual-review count
- inquiry count



## 8.8 Modes Page

### Route
`/admin/modes`

### Purpose
Switch between standard and event-based operating modes.

### Main sections
- current active mode
- available modes
- short explanation of impact
- confirmation modal or confirmation step
- future mode configuration area


## 8.9 Settings Page

### Route
`/admin/settings`

### Purpose
Hold system-level operational settings later.

### Early content may include:
- availability references
- basic configuration notes
- future reserved space


# 9. Trust and Policy Wireframes

## 9.1 Privacy Page
Should be text-first and readable.

## 9.2 Terms Page
Should be text-first and readable.

## 9.3 Ordering Policy Page
Should be especially clear and operational.

Should highlight:
- minimum order
- notice period
- quantity rules
- local delivery vs intercity transfer
- allergy note


# 10. Mobile Considerations

The product must be mobile-friendly because ordering behavior is likely to happen heavily on mobile devices.

## Mobile wireframe priorities
- clear stacked layouts
- short forms
- persistent summary where possible
- large CTA buttons
- easy navigation back and forth
- readable order review
- simple progress visibility

Admin can be more desktop-enhanced, but should still remain usable on tablet or mobile where needed.


# 11. V1 Priority Screens

The most important screens to get right first are:

## Customer-facing
- homepage
- menu page
- order hub
- AI ordering page
- quick order page
- review page
- success page
- order status page
- inquiry page

## Internal
- admin dashboard
- orders list
- order detail
- manual review
- inquiries
- analytics
- modes


# 12. Final Note

The wireframes in this product should support one clear outcome:

customers should be able to order confidently,  
and the business should be able to operate confidently.

That is the point of the system.