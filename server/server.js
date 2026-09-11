require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const validateEnv = require('./config/validateEnv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const goldRateRoutes = require('./routes/goldRateRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const faqRoutes = require('./routes/faqRoutes');
const offerRoutes = require('./routes/offerRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');
const { getSitemap } = require('./controllers/sitemapController');

// Fails fast with a clear message if required/unsafe config is detected —
// see config/validateEnv.js for exactly what's checked.
validateEnv();

connectDB();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Trust the first proxy hop (Render/Railway/Vercel/Nginx/etc.) so
// req.ip, rate limiting, and secure cookies all see the real client IP
// and protocol instead of the proxy's.
if (isProd) {
  app.set('trust proxy', 1);
}

// Security & core middleware
app.use(helmet());
app.use(compression());

// CLIENT_URL supports a comma-separated list (e.g. www + non-www, or a
// staging domain alongside production) — falls back to localhost for dev.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/non-browser requests (no Origin header) and any
      // explicitly configured origin; reject everything else.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

// Access logging — verbose 'dev' format locally, leaner 'combined' format
// in production (most hosts capture stdout into their own log aggregator).
app.use(morgan(isProd ? 'combined' : 'dev'));

// Defense-in-depth: a generous ceiling across the whole API, on top of the
// stricter limiters already applied to auth and public form endpoints.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.GLOBAL_RATE_LIMIT_MAX) || 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// SEO: dynamically generated sitemap, built from live product/category/collection data
app.get('/sitemap.xml', getSitemap);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/gold-rates', goldRateRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/site-settings', siteSettingsRoutes);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
