# Gayatri Jewellers — Frontend

A React + Vite storefront and admin panel wired directly to the Express
backend — no mocked or hardcoded data anywhere. See the root `README.md`
for full build status across all phases; this file covers frontend-specific
setup and structure.

## What's here

- **Storefront**: Home, Shop (search/filter/sort), Product Details (with
  reviews), Collections, New Arrivals, Cart, Wishlist, Checkout, My Orders /
  Order Details, Contact (enquiry form), FAQ, Gold Rate, Login/Register/
  Forgot Password, Account
- **Admin panel** (`/admin/*`): Dashboard (Recharts), Products (full CRUD +
  Cloudinary image upload), Categories, Collections, Orders, Enquiries,
  Gold Rate, FAQs, Customers
- **State**: Redux Toolkit. Cart/Wishlist sync to the backend for logged-in
  users (merging any guest-session items on login) and fall back to
  `localStorage` for guests.
- **SEO**: per-page `<Seo />` component (title/description/canonical/Open
  Graph/Twitter), `schema.org/Product` JSON-LD on product pages,
  `public/robots.txt`.
- **Design tokens** (Tailwind config): ivory `#FBF7EF` base, sand `#F0E6D2`
  section contrast, charcoal `#2B2420` text, antique gold `#A8792E` accent,
  maroon `#7A2331` / pine `#33473B` for status. Cormorant Garamond
  (headings) + Jost (body), via Google Fonts in `index.html`.

## 1. Install

```bash
cd client
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL` — defaults to `http://localhost:5000/api`
- `VITE_SITE_URL` — used to build canonical/Open Graph URLs; set to your
  real domain before deploying

## 3. Run

Make sure the backend is running first (`npm run dev` inside `server/`,
seeded via `npm run seed`), then:

```bash
npm run dev
```

Visit `http://localhost:5173`. Storefront demo login:
`customer@gayatrijewellers.test` / `Customer@12345`. Admin panel at
`/admin/login`: `admin@gayatrijewellers.test` / `Admin@12345` (override
these in `server/.env` before relying on them for anything real).

## Structure

```
src/
  app/          Redux store
  components/
    admin/      Admin-only layout + widgets (image uploader, etc.)
    common/     Shared UI (ProductCard, Seo, ConfirmDialog, ...)
    layout/     Storefront header/footer/nav
  features/     Redux slices (auth, cart, wishlist)
  hooks/        useAuth, etc.
  pages/        Route-level components
    admin/      Admin route pages
  services/     Axios calls per API resource
  utils/        Formatting helpers
```
