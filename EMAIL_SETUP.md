# Affy's — Email Sending Setup (Resend + Supabase)

This connects a proper email service so your admin **sign-in links** (and
later, **order confirmations**) send instantly and arrive branded from
`hello@atasteofaffys.com` — instead of using Supabase's tiny built-in
sender that caps out after a couple of emails per hour.

We're using **Resend**. Free tier is ~3,000 emails/month (100/day), which
is far more than you'll need.

**Important — your existing email is safe.** Resend sends from a
subdomain (`send.atasteofaffys.com`). Everything below only *adds* new DNS
records. **Never delete your existing Microsoft 365 records** (the MX, SPF,
and DKIM entries that run your `hello@` inbox). Adding and deleting are
different buttons — only ever add here.

---

## Step 1 — Create a Resend account

1. Go to https://resend.com → **Sign up** (you can use your Google login or
   `hello@atasteofaffys.com`).
2. It's free — no card needed to start.

---

## Step 2 — Add your domain

1. In Resend, left sidebar → **Domains** → **Add Domain**.
2. Type: `atasteofaffys.com` (note the **s**).
3. Region: pick **EU (Ireland)** if offered — closest to you and your
   Supabase project. If not offered, the default is fine.
4. Click **Add**.

Resend now shows you a list of **DNS records** to add. Keep this page open —
you'll copy from it in the next step. They'll look roughly like:

| Type | Name (Host) | Value |
|---|---|---|
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey` | (a long key starting `p=...`) |

Your exact values may differ slightly — **always use what Resend shows
you**, not the example above.

---

## Step 3 — Add those records to your DNS

1. Go to wherever you manage DNS for `atasteofaffys.com` (your domain
   registrar's DNS panel, or Microsoft/Cloudflare if that's where the
   nameservers point).
2. For **each** record Resend listed, click **Add record** and copy across:
   - **Type** (MX, TXT, etc.)
   - **Name/Host** — paste exactly what Resend shows (e.g. `send` or
     `resend._domainkey`). If your DNS panel auto-appends your domain,
     don't type the domain twice.
   - **Value** — paste exactly (long DKIM keys must be copied in full, no
     spaces added).
   - **Priority** — only for the MX record (usually `10`).
   - **TTL** — leave default / Auto.
3. Save each one.

**Do not touch** your existing records named `@`, `autodiscover`,
`selector1._domainkey`, `selector2._domainkey`, or your current MX pointing
to `mail.protection.outlook.com`. Those run your inbox — leave them alone.

---

## Step 4 — Verify the domain in Resend

1. Back in Resend's domain page, click **Verify** (or just wait — it
   auto-checks).
2. DNS can take anywhere from 5 minutes to an hour to propagate. When done,
   each record turns **green / Verified**.
3. Once the domain shows **Verified**, you're ready.

If it's still pending after an hour, double-check the record names for typos
or an accidentally duplicated domain (e.g. `send.atasteofaffys.com.atasteofaffys.com`).

---

## Step 5 — Create an API key (this is your SMTP password)

1. In Resend, sidebar → **API Keys** → **Create API Key**.
2. Name it `Supabase Auth`. Permission: **Sending access** is enough.
3. Copy the key (starts with `re_...`) **now** — Resend only shows it once.
   Paste it somewhere safe for the next step.

---

## Step 6 — Point Supabase at Resend

1. In Supabase → **Project Settings → Authentication** (or
   **Authentication → Emails → SMTP Settings**, depending on the dashboard
   version).
2. Turn on **Enable Custom SMTP**.
3. Fill in:

   ```
   Sender email      = hello@atasteofaffys.com
   Sender name       = Affy's
   Host              = smtp.resend.com
   Port              = 465
   Username          = resend
   Password          = (paste your re_... API key from Step 5)
   ```

   (If port 465 ever gives trouble, try 587 instead.)
4. Click **Save**.

---

## Step 7 — Raise the email rate limit

Now that you're not on the tiny built-in sender, you can lift the cap:

1. Supabase → **Authentication → Rate Limits**.
2. Find **"Rate limit for sending emails"** and raise it to something
   comfortable (e.g. **30 per hour** — plenty for sign-ins).
3. Save.

This is what fixes the "email rate limit exceeded" message you hit.

---

## Step 8 — Test it

1. Go to `https://affys-ai-ordering-system.vercel.app/admin/login`.
2. Enter `atasteofaffy@gmail.com`, send the link.
3. The email should arrive within seconds, **from `hello@atasteofaffys.com`**.
4. Click it → if you've already done the staff bootstrap (the
   `insert into staff_users ...` step), you'll land in the dashboard.

---

## Optional — brand the email later

Supabase → **Authentication → Emails → Templates** lets you customise the
"Magic Link" email (logo, wording, colours) so it matches Affy's. Not needed
to get working — a polish step for later.

---

## Quick reference (once set up)

| Setting | Value |
|---|---|
| SMTP host | `smtp.resend.com` |
| SMTP port | `465` (or `587`) |
| SMTP username | `resend` |
| SMTP password | your Resend API key (`re_...`) |
| From address | `hello@atasteofaffys.com` |
| Sending domain | `atasteofaffys.com` (verified in Resend) |
