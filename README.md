# Rana Jewels — MERN Jewellery E-Commerce

A premium jewellery storefront built as a real full-stack MERN app —
React frontend, Express/Node backend, MongoDB database, nothing mocked.

```
jewellery-app/
  server/   → Phase 1: Express + MongoDB API (see server/README.md)
  client/   → Phase 2: React + Vite storefront (see client/README.md)
```

## Quick start

**1. Backend**
```bash
cd server
npm install
cp .env.example .env   # set MONGO_URI + JWT_SECRET
npm run seed
npm run dev             # http://localhost:5000
```

**2. Frontend** (in a second terminal)
```bash
cd client
npm install
cp .env.example .env    # defaults to http://localhost:5000/api
npm run dev              # http://localhost:5173
```

Demo accounts (from the seed script):

| Role     | Email                     | Password        |
|----------|----------------------------|-----------------|
| Admin    | admin@ranajewels.test       | Admin@12345     |
| Customer | customer@ranajewels.test    | Customer@12345  |

## Build status

- ✅ **Phase 1** — Backend foundation: auth, Products/Categories/Collections
  API with real filtering/sorting/pagination, seed data
- ✅ **Phase 2** — Storefront core: Home, Shop, Product Details, Collections,
  New Arrivals, Cart, Wishlist, Login/Register, Account — all live against
  the Phase 1 API
- ✅ **Phase 4** — Admin Panel: `/admin/login`, dashboard with Recharts
  (stock health, products-by-category), full Product CRUD with Cloudinary
  image upload, Category & Collection management, Customer list with
  activate/deactivate — all admin-only and JWT-protected
- ⏳ **Phase 3** — Cart/Wishlist/Order/Enquiry/GoldRate/Review/FAQ backend +
  their customer-facing pages (Contact, FAQ, Gold Rate, Offers, Order
  Details) — skipped ahead to Phase 4 per request, still open
- ⏳ **Phase 5** — SEO, full responsiveness/accessibility pass, deployment

## Admin Panel

Visit `http://localhost:5173/admin/login` and sign in with the seeded admin
account (`admin@ranajewels.test` / `Admin@12345`, or whatever you set in
`server/.env`). From there:

- **Dashboard** — live stats and charts pulled from MongoDB
- **Products** — add/edit/delete, with drag-in image upload straight to
  Cloudinary (requires Cloudinary credentials in `server/.env` — see
  `server/README.md`)
- **Categories** / **Collections** — add/edit/delete with cover images
- **Customers** — search and activate/deactivate accounts

Anything you add here — a new product, a new category — shows up on the
customer storefront immediately, since both sides hit the same API.

See each package's own README for full details on what's implemented and
how it works.
"# Gayatri-jewellers-" 
