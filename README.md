# Gayarti Jewellers — MERN Jewellery E-Commerce

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
| Admin    | admin@GayartiJewellers.test       | Admin@12345     |
| Customer | customer@GayartiJewellers.test    | Customer@12345  |

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
- ✅ **Phase 3** — Cart/Wishlist now MongoDB-backed for logged-in users
  (merges guest cart on login); Orders with a full checkout flow and status
  timeline; Enquiries (Contact form, admin inbox); Gold Rate (storefront
  page + admin publishing + history); Reviews (on Product Details); FAQ
  page with admin-managed categories
- ⏳ **Phase 5** — SEO, full responsiveness/accessibility pass, deployment

## Admin Panel

Visit `http://localhost:5173/admin/login` and sign in with the seeded admin
account. From there:

- **Dashboard** — live stats and charts, including real order/enquiry counts
  and the current gold rate
- **Products** — add/edit/delete, with drag-in image upload to Cloudinary
- **Categories** / **Collections** — add/edit/delete with cover images
- **Orders** — view all orders, filter by status, update status
- **Enquiries** — view submitted enquiries, update status (New/In Progress/Resolved)
- **Gold Rate** — publish a new rate (becomes the storefront's current rate), view history
- **FAQs** — add/edit/delete, grouped by category
- **Customers** — search and activate/deactivate accounts

Anything you add here shows up on the customer storefront immediately,
since both sides hit the same API.

## What's still not built (Phase 5)

- SEO metadata (dynamic titles, Open Graph, structured data, sitemap)
- Full accessibility/responsiveness audit pass
- Deployment configuration and instructions
- Offers/Banners management (mentioned in the original brief but not
  prioritized — say the word if you want these added)
- Online payment (currently Cash on Delivery only)

See each package's own README for full details on what's implemented and
how it works.
