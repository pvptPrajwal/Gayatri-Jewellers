# Rana Jewels — Frontend (Phase 2: Storefront Core)

A React + Vite storefront wired directly to the Phase 1 backend — no mocked
or hardcoded product data. Products, categories and collections are fetched
live from MongoDB via the Express API.

## What's included in this phase

- App shell: routing (React Router), state (Redux Toolkit), Tailwind theme
  with jewellery-brand design tokens, Axios instance with JWT handling
- Layout: AnnouncementBar, Header (search, wishlist/cart counts,
  login/profile), MobileMenu, Footer, WhatsApp + Back-to-top floating buttons
- Reusable components: ProductCard, ProductGrid, Rating, Pagination,
  Breadcrumb, LoadingSpinner, SkeletonLoader, EmptyState
- **Home** — hero, shop-by-category (live from `/api/categories`), featured
  collections (live from `/api/collections`), new arrivals & best sellers
  (live from `/api/products`), why-choose-us, visit-our-store
- **Shop** — real search, filters (category, collection, metal, gender,
  price range) and sort, all sent to the backend as query params; results
  and pagination come straight from the API response
- **Product Details** (`/product/:slug`) — gallery, full specs, add to
  cart/wishlist, related products, all from `/api/products/slug/:slug`
- **Collections** and **New Arrivals** — full pages backed by the same API
- **Cart** and **Wishlist** — working add/remove/quantity, persisted to
  `localStorage` for now (moves to the MongoDB-backed Cart/Wishlist API in
  Phase 3, once those endpoints exist)
- **Login / Register** — real requests to `/api/auth/login` and
  `/api/auth/register`, JWT stored and attached to future requests
- **Account** — basic authenticated dashboard (protected route)
- **About** — static content page per the brief
- 404 page, and honest "coming soon" placeholders for Offers, Gold Rate,
  Contact and FAQ — those need models/APIs that arrive in Phase 3, so
  rather than fake them with hardcoded data they clearly say what's pending

## 1. Install

```bash
cd client
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

By default `VITE_API_BASE_URL=http://localhost:5000/api` — update this if
your backend runs elsewhere (e.g. a deployed API URL).

## 3. Run

Make sure the Phase 1 backend is running first (`npm run dev` inside
`server/`, seeded via `npm run seed`), then:

```bash
npm run dev
```

Visit `http://localhost:5173`. Try:
- Browsing **Shop**, filtering by metal/category/price — watch the URL
  query params update and results refetch from the API
- Opening a product, adding it to cart and wishlist
- Registering a new account, or logging in as the seeded admin/customer
  (`admin@ranajewels.test` / `Admin@12345`, `customer@ranajewels.test` /
  `Customer@12345`)

## Design notes

Brand tokens (Tailwind config): ivory `#FBF7EF` base, sand `#F0E6D2` for
section contrast, charcoal `#2B2420` text, antique gold `#A8792E` as the
single accent color, maroon `#7A2331` and pine green `#33473B` used sparingly
for badges/status. Headings use Cormorant Garamond (serif), UI/body text
uses Jost (sans) — both loaded via Google Fonts in `index.html`.

## Why Cart/Wishlist are client-side for now

The brief calls for Cart and Wishlist to persist in MongoDB for logged-in
users. Phase 1 didn't build those API routes yet (they're scoped for Phase
3 alongside Orders/Enquiries), so wiring them to a fake or partial backend
now would just mean rewriting this logic shortly after. Building them
against `localStorage` first keeps the UI fully functional today, and
Phase 3 will swap the Redux slices' persistence layer to call the real
`/api/cart` and `/api/wishlist` endpoints for authenticated users, merging
any local cart on login — without changing the components that use them.

## Next phases

- Phase 3: Cart/Wishlist/Order/Enquiry/GoldRate/Review/FAQ backend models +
  APIs, and their corresponding pages (Contact, FAQ, Gold Rate, Offers,
  Order Details, full Account section)
- Phase 4: Admin dashboard (stats, charts, full CRUD UI, Cloudinary uploads)
- Phase 5: SEO, full responsiveness/accessibility pass, deployment docs
