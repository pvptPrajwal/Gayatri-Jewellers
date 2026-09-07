# Rana Jewels — Backend (Phase 1: Foundation)

Phase 1 of the MERN jewellery e-commerce build: Express + MongoDB backend with
JWT authentication, Products, Categories and Collections — fully working, not
mocked.

## What's included in this phase

- Express server with security middleware (helmet, cors, mongo-sanitize,
  rate limiting on auth routes, cookie-based + Bearer JWT support)
- Mongoose models: `User`, `Product`, `Category`, `Collection`
- Auth: register, login, get current user, logout, forgot/reset password
- Role-based authorization (`CUSTOMER` / `ADMIN`)
- Products API with search, filtering (category, collection, metal, purity,
  gender, occasion, price range, weight range, flags), sorting, and
  pagination — this powers the Shop page filters directly from MongoDB
- Categories & Collections CRUD (admin-only writes, public reads)
- Seed script with a demo admin, demo customer, 6 categories, 8 collections
  and 8 realistic products (with placeholder images) so you can test
  end-to-end immediately

## Phase 4 additions (Admin Panel + image uploads)

- Cloudinary-backed image upload endpoints (`/api/upload/image`,
  `/api/upload/images`, `DELETE /api/upload?publicId=...`) — admin only
- Dashboard stats endpoint (`GET /api/admin/stats`) — product/customer/
  category/collection counts, low-stock list, recent products, stock-status
  and products-by-category breakdowns for charts
- Customer management (`GET /api/users`, `PUT /api/users/:id/status`) —
  admin only

Orders, Enquiries, Reviews, FAQs and Gold Rates still don't have models/APIs
yet — that's Phase 3, not built in this pass. The dashboard stats endpoint
reports `totalOrders: 0`, `totalEnquiries: 0` and `goldRate: null` honestly
rather than faking numbers, until those exist.

### Image uploads require real Cloudinary credentials

`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in
`.env` must be set to a real Cloudinary account (free tier is fine —
https://cloudinary.com). Until they are, upload requests return a clear
503 error explaining what's missing, instead of crashing the server or
silently failing.

## 1. Install

```bash
cd server
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:
- `MONGO_URI` — your local or Atlas MongoDB connection string
- `JWT_SECRET` — any long random string

The `SEED_*` values control the demo accounts created by the seed script —
change the demo passwords before deploying anywhere public.

## 3. Seed the database

```bash
npm run seed
```

This wipes and repopulates Users, Categories, Collections and Products. To
wipe without reseeding: `npm run seed:destroy`.

Demo credentials (from `.env.example`, override in your own `.env`):

| Role     | Email                      | Password        |
|----------|-----------------------------|-----------------|
| Admin    | admin@ranajewels.test        | Admin@12345     |
| Customer | customer@ranajewels.test     | Customer@12345  |

## 4. Run

```bash
npm run dev     # nodemon, local development
npm start       # production
```

Server runs on `http://localhost:5000` by default. Health check:
`GET /api/health`.

## API Reference (Phase 1)

### Auth — `/api/auth`

| Method | Endpoint            | Access  | Notes |
|--------|----------------------|---------|-------|
| POST   | `/register`          | Public  | `{ name, email, phone, password, confirmPassword }` |
| POST   | `/login`              | Public  | `{ identifier, password }` — identifier is email or phone |
| GET    | `/me`                 | Private | Returns current user + populated wishlist |
| POST   | `/logout`             | Private | Clears auth cookie |
| POST   | `/forgot-password`    | Public  | `{ email }` |
| POST   | `/reset-password`     | Public  | `{ token, password }` |

Auth responses set an httpOnly `token` cookie **and** return `token` in the
JSON body, so the React frontend can use either cookie-based auth or an
`Authorization: Bearer <token>` header via Axios interceptors.

### Products — `/api/products`

| Method | Endpoint         | Access       |
|--------|-------------------|--------------|
| GET    | `/`                | Public       |
| GET    | `/slug/:slug`      | Public       |
| GET    | `/:id`             | Public       |
| POST   | `/`                | Admin only   |
| PUT    | `/:id`             | Admin only   |
| DELETE | `/:id`             | Admin only   |

`GET /api/products` query params: `search, category, collection, metal,
purity, gender, occasion, minPrice, maxPrice, minWeight, maxWeight,
isNewArrival, isBestSeller, isFeatured, sort (featured|newest|price_asc|
price_desc), page, limit`.

### Categories — `/api/categories` and Collections — `/api/collections`

Standard REST CRUD, public `GET`, `ADMIN`-only `POST/PUT/DELETE`.

## Example: register → login → create a product

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"7000000000","password":"Test@1234"}'

# Login as seeded admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@ranajewels.test","password":"Admin@12345"}'
# -> copy the "token" from the response

# Create a product (replace TOKEN and a real category/collection _id)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name":"Elegant Gold Chain","sku":"RJ-9001",
    "description":"A fine gold chain.",
    "category":"<categoryId>","metal":"Gold","purity":"22K",
    "grossWeight":10,"netWeight":9.5,"basePrice":50000,
    "makingCharges":3000,"stockQuantity":10
  }'
```

## Notes on design decisions

- **finalPrice / stockStatus are derived, not client-supplied** — a
  `pre('save')` hook on `Product` computes `finalPrice` from
  `basePrice + makingCharges - discount%`, and `stockStatus` from
  `stockQuantity`. This keeps pricing and stock state trustworthy no matter
  what the client sends.
- **Login accepts email or phone** (`identifier` field) per the spec's
  "Email / Phone" login requirement.
- **Passwords never appear in API responses** — the schema uses
  `select: false` on `password` plus a `toSafeObject()` helper.
- **Cloudinary image upload** wiring (multer + cloudinary SDK) will be added
  in the Admin Product Management phase, alongside the actual upload routes —
  the `Product`/`Category`/`Collection` schemas already have the
  `{ url, publicId }` shape ready for it.

## Next phases

- Phase 2: React storefront (Home, Shop, Product Details, Cart, Wishlist)
  wired to this API
- Phase 3: Cart/Wishlist/Order/Enquiry/GoldRate/Review/FAQ models + APIs and
  their pages
- Phase 4: Admin dashboard (stats, charts, full CRUD UI, Cloudinary uploads)
- Phase 5: SEO, responsiveness pass, deployment docs
