# Production Readiness Checklist

This covers everything worth doing before real customers and real money
touch this app. Items marked **[code]** are already handled by this
codebase — just configure them correctly. Items marked **[infra]** are
things you do outside the code, when choosing hosting/deployment.

## Before you deploy

- [ ] **[code]** Generate a real `JWT_SECRET` — don't use the placeholder.
      ```bash
      node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
      ```
- [ ] **[code]** Set `NODE_ENV=production` in your deployed backend's
      environment variables. The server now refuses to start in
      production if `JWT_SECRET`/`MONGO_URI` are missing or the JWT
      secret is still a placeholder — see `server/config/validateEnv.js`.
- [ ] **[code]** Set `CLIENT_URL` to your real frontend domain(s)
      (comma-separated if you have more than one, e.g. www + non-www).
      CORS will reject requests from anywhere else once this is set.
- [ ] **[code]** Set `SITE_URL` to your real domain — used for the
      sitemap and SEO canonical URLs.
- [ ] **[code]** Set real Cloudinary credentials (not the placeholders).
- [ ] **[infra]** MongoDB Atlas → Network Access: remove the
      "Allow Access from Anywhere" (`0.0.0.0/0`) entry you added during
      development, and add only your production server's outbound IP
      (or your hosting provider's IP range, if it's static/known — many
      PaaS hosts like Render document this).
- [ ] **[infra]** MongoDB Atlas → Database Access: rotate the database
      user's password if it was ever shared in a screenshot, chat log,
      or committed to git.

## After you deploy, before announcing it publicly

- [ ] **[code]** Log into `/admin/login` with the seeded admin account,
      go to **My Account → Change Password**, and change it away from
      the demo value. Do the same for the demo customer account, or
      delete it.
- [ ] **[infra]** Confirm HTTPS is active (automatic on Vercel/Netlify/
      Render; needs a reverse proxy + Let's Encrypt if you're on a raw
      VPS). Never run real checkout traffic over plain HTTP.
- [ ] **[infra]** Set up MongoDB Atlas backups. The free M0 tier does
      **not** include point-in-time backups — consider upgrading to at
      least M10 once you have real order data you can't afford to lose,
      or export data manually on a schedule in the meantime.
- [ ] **[infra]** Set up basic uptime monitoring (UptimeRobot, Better
      Stack, or your host's built-in health checks) pointed at
      `/api/health`.
- [ ] **[code]** Run `npm run seed` **only** with `ALLOW_PROD_SEED=true`
      explicitly set — it wipes and recreates core data. Normally you
      should never run it again once real products/customers exist.

## Known gaps (decide if they matter for your launch)

- **No online payment gateway.** Checkout is Cash-on-Delivery only. If
  that's acceptable for launch (many jewellery retailers do COD or
  in-store payment), fine — otherwise this needs Razorpay/UPI integration
  before launch.
- **No transactional email.** "Forgot Password" generates a reset token
  but nothing emails it to the customer — there's no email provider
  (SendGrid/Postmark/etc.) wired in. Right now, only **Change Password**
  (while logged in) actually works end-to-end. If you need self-service
  password recovery for customers who are locked out, that requires
  adding an email service — flag it if you want this built.
- **No automated tests.** Every change so far has been verified with
  manual syntax/import checks, not a test suite. Fine for a small store
  run by one team; worth revisiting if multiple people start changing
  the code.
- **Rate limiting** is applied to auth, enquiry, and now globally across
  `/api/*` (see `server/server.js`) — reasonable defaults, not
  battle-tested against real attack traffic.

## Already handled

- Password hashing (bcrypt), JWT auth, role-based authorization
- Helmet security headers, CORS restricted to configured origins,
  MongoDB injection sanitization, gzip compression
- `trust proxy` configured for correct client IPs behind a reverse proxy
- Environment validation at startup (fails fast on missing/weak config
  in production instead of silently running insecurely)
- Seed script refuses to run against `NODE_ENV=production` without an
  explicit opt-in
