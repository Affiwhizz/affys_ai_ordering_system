# Affy's — Setup & Deployment Guide

A step-by-step guide for getting **atasteofaffy.com** from your laptop to a
live URL on the internet. Domain hookup is intentionally the last step
since it's tied to ownership transfer.

Each step lists what you do and what I'll do once you've done your part.

---

## Overview

We're using three free services that work together:

- **GitHub** — stores the source code, lets you (and developers later) work
  on it without losing history.
- **Supabase** — the backend: database, file storage, customer accounts
  later, real-time updates.
- **Vercel** — hosts the website itself. It pulls code from GitHub,
  builds it, serves it to visitors.

You'll create one account at each (all free for what we need right now).

---

## Step 1 — Create a GitHub account & install GitHub Desktop

You only do this once.

1. **Sign up** at https://github.com — pick a username (e.g. `affy-foods`).
2. **Download GitHub Desktop** at https://desktop.github.com — sign in with
   the account you just made.
3. In GitHub Desktop: **File → New Repository**
   - Name: `affys-website`
   - Local path: pick the folder that contains the `frontend/` folder
     (the one I've been editing — `affys_ai_ordering_system`)
   - **Tick "Initialize this repository with a README"** (just so the
     first commit isn't empty)
   - Click **Create Repository**
4. Click **Publish repository** (top toolbar) — **untick "Keep this code
   private"** only if you want the public to see your code (most food
   businesses keep it private; pick whichever you prefer)
5. Confirm — your code is now on GitHub.

Every time you save files I've changed, open GitHub Desktop, write a short
message in the box at the bottom-left (e.g. "Add menu data"), click
**Commit to main**, then **Push origin** at the top.

---

## Step 2 — Create a Supabase project

1. Go to https://supabase.com → **Start your project**.
2. Sign up (use the same email you'll use everywhere — `hello@atasteofaffy.com`
   ideally).
3. Click **New project**.
   - **Organization**: create one called `Affys`.
   - **Project name**: `affys-prod`.
   - **Database password**: click the **Generate** button, **then copy and
     paste this somewhere safe** (a password manager — you'll need it once,
     for the database editor). Supabase calls this the "database password" —
     it's separate from your account password.
   - **Region**: pick the closest one. For Portugal, choose
     **West EU (Ireland) — eu-west-1** or **Central EU (Frankfurt) —
     eu-central-1**.
   - **Pricing plan**: Free is fine for now.
4. Wait 2–3 minutes for Supabase to provision the project.

---

## Step 3 — Run the database schema

1. In your Supabase project, click **SQL Editor** in the left sidebar.
2. Click **+ New query**.
3. Open `frontend/db/schema.sql` from your computer in any text editor
   (TextEdit on Mac is fine). Select **all** the contents (Cmd+A), copy
   (Cmd+C).
4. Back in Supabase, paste into the editor and click **Run** (bottom right).
   - It should say "Success. No rows returned." after a few seconds.
   - If you see red errors, copy them and send them to me — usually means
     a previous attempt left some objects behind.
5. Click **+ New query** again. Open `frontend/db/seed.sql`, copy, paste,
   **Run**.
   - This populates the menu, delivery zones, and default content.
6. Verify by going to **Table Editor** in the sidebar — you should now see
   tables like `menu_items`, `orders`, `delivery_zones`, etc. Click
   `menu_items` and you should see all your dishes listed.

---

## Step 4 — Create the Storage buckets

These hold uploaded receipts, food photos, and the hero video.

1. In Supabase, click **Storage** in the left sidebar.
2. Click **New bucket** four times, creating:

   | Bucket name | Public? | Purpose |
   |---|---|---|
   | `receipts` | **Private** | Customer payment receipts (sensitive) |
   | `menu-images` | **Public** | Dish photos |
   | `catering-images` | **Public** | Catering photos behind the cards |
   | `blog-images` | **Public** | Blog cover images |

   To make a bucket public, tick the "Public bucket" checkbox before
   clicking Create.

3. Optional but recommended: in each bucket, click **Policies → New
   policy → Get started quickly → For full customization** to add upload
   policies. For now the default policies are fine because we'll do all
   uploads through the server using the service-role key.

---

## Step 5 — Get the Supabase API keys

1. In Supabase, click **Project Settings → API** (gear icon in the left
   sidebar).
2. You'll see three values you'll need shortly:

   - **Project URL** — looks like `https://abcdefghijklmnop.supabase.co`
   - **anon public key** — long string, safe to use in the browser
   - **service_role secret key** — long string, **NEVER paste this anywhere
     public** (don't commit it, don't put in chat, don't share)

3. Click the eye icon next to each to reveal them. Keep this tab open —
   you'll paste these into Vercel in a minute.

---

## Step 6 — Create a Vercel account

1. Go to https://vercel.com → **Sign Up**.
2. Click **Continue with GitHub** — easiest path since GitHub already has
   the code.
3. Pick the **Hobby** plan (free).

---

## Step 7 — Deploy the website

1. In Vercel dashboard → **Add New → Project**.
2. Find your GitHub repo (`affy-foods/affys-website`) → click **Import**.
3. **Root directory**: click "Edit" and set it to `frontend` (since the
   Next.js app is inside a `frontend` folder, not at the root).
4. **Framework Preset** should auto-detect as **Next.js**.
5. **Environment Variables** — this is the important part. Click "Add" and
   paste each one. The values come from Supabase (Step 5) and your phone
   number / email:

   ```
   NEXT_PUBLIC_SUPABASE_URL          = <paste your Supabase Project URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY     = <paste anon public key>
   SUPABASE_SERVICE_ROLE_KEY         = <paste service_role secret key>
   NEXT_PUBLIC_SITE_URL              = https://atasteofaffy.com
   NEXT_PUBLIC_WHATSAPP_DISPLAY      = +351 914 145 519
   NEXT_PUBLIC_WHATSAPP_HREF         = https://wa.me/351914145519
   NEXT_PUBLIC_SUPPORT_EMAIL         = hello@atasteofaffy.com
   ```

   For each one, leave "Production, Preview, Development" all ticked.
   `SUPABASE_SERVICE_ROLE_KEY` is the sensitive one — Vercel keeps it
   encrypted and doesn't show it to the browser.

6. Click **Deploy**.
7. After ~2 minutes you'll see "Congratulations" and a URL like
   `affys-website-xyz.vercel.app`. Click it — your site is live.

---

## Step 8 — Verify everything works

Open the deployed URL and walk through:

- Homepage loads, logo visible
- Cart icon shows in the header (count = 0)
- `/menu` loads the full menu (proof the build is using your real
  Supabase later when we wire reads, but for now the menu page reads from
  the bundled data)
- `/portimao` loads
- `/admin` redirects to `/admin/login` (proof the middleware is gating
  routes — login page itself will say "not built yet" for now; we wire
  proper sign-in next)

Every time you push to GitHub, Vercel auto-deploys the new version
(takes about 90 seconds). You'll get an email each time.

---

## Step 9 — Custom domain (do this after ownership transfer)

When `atasteofaffy.com` is in your name:

1. In Vercel, your project → **Settings → Domains**.
2. Type `atasteofaffy.com` → **Add**.
3. Vercel shows you DNS records to add at your domain registrar. Two
   things to add: an A record for the root (`@`) and a CNAME for `www`.
   The exact values appear on the Vercel page — copy them.
4. Go to your domain registrar's DNS panel (wherever the domain is
   currently parked — could be Squarespace, GoDaddy, IONOS, etc.) and add
   those records.
5. Wait 5–30 minutes — Vercel verifies and switches over automatically.
   HTTPS is set up for free without you doing anything.

That's it — `atasteofaffy.com` now points at the Vercel deployment, and
you have HTTPS for free.

---

## Step 10 — Tell me when each step is done

When you've finished Steps 1–7, send me a screenshot of:

- The Vercel deployment URL working
- The Supabase Project URL (just the URL, not the keys)

Then I'll start wiring the actual data reads — homepage will start
pulling content from Supabase, admin pages will show real (empty) data,
and we can start placing test orders.

---

## Common questions

**"Do I have to install Node.js or run commands?"** Not for this step. The
SQL gets pasted into Supabase, the code lives on GitHub, Vercel builds it.
You touch zero terminals. (If you want to preview the site on your own
laptop later, you'll install Node — separate guide.)

**"What's a database password vs. anon key vs. service-role key?"**
- *Database password* — used once if you ever connect to the database
  with a direct SQL tool. You can ignore it now.
- *Anon public key* — what the browser uses to talk to Supabase. It can
  only do what your Row Level Security policies allow (so even if a
  hacker grabs it, they can't read other people's orders).
- *Service-role key* — bypasses all security. Server-only. NEVER put it
  in client code.

**"I made a mistake in the SQL — can I start over?"** Yes. In Supabase,
**Database → Migrations → Reset database**. Then re-run schema.sql and
seed.sql.

**"What does it cost?"** All free up to substantial usage:
- Supabase: 500 MB database, 1 GB storage, 50k auth users.
- Vercel: 100 GB bandwidth, unlimited deploys.
- Domain: about €10–€15/year (renewal at your registrar).

When you outgrow free tiers (likely after a few hundred orders/month),
Supabase Pro is $25/mo and Vercel Pro is $20/mo.

**"Is my data safe?"** Yes — Supabase encrypts data at rest, backups
automatic, hosted in EU (GDPR-compliant), Row Level Security blocks
unauthorized reads. The service role key is the only thing you must
guard carefully — never paste it anywhere except Vercel env vars.
