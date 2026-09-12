require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const FAQ = require('../models/FAQ');
const GoldRate = require('../models/GoldRate');
const Offer = require('../models/Offer');
const Banner = require('../models/Banner');

const { categories, collections, productTemplates, faqs, offers, banners } = require('./data');

const PLACEHOLDER_IMG = (seed) => ({
  url: `https://picsum.photos/seed/${seed}/800/800`,
  publicId: '',
  alt: 'Jewellery product image',
});

const run = async () => {
  // Safety guard: this script wipes Users/Categories/Collections/Products/
  // FAQs/GoldRates/Offers/Banners unconditionally. That's fine against a
  // fresh dev database, but catastrophic if ever run against a live store
  // by habit or muscle memory. Require an explicit opt-in once NODE_ENV is
  // production.
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== 'true') {
    console.error(
      '\nRefusing to run: NODE_ENV=production and ALLOW_PROD_SEED is not set to "true".\n' +
        'This script deletes existing Users, Categories, Collections, Products, FAQs,\n' +
        'Gold Rates, Offers and Banners before recreating them. If you really mean to\n' +
        'reset a production database, re-run with ALLOW_PROD_SEED=true set explicitly.\n'
    );
    process.exit(1);
  }

  await connectDB();

  const destroy = process.argv.includes('-d');

  if (destroy) {
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Collection.deleteMany({}),
      Product.deleteMany({}),
      FAQ.deleteMany({}),
      GoldRate.deleteMany({}),
      Offer.deleteMany({}),
      Banner.deleteMany({}),
    ]);
    console.log('All collections cleared.');
    await mongoose.connection.close();
    process.exit(0);
  }

  // Clear existing data for a clean, repeatable seed
  // Note: Cart, Wishlist (on User), Order, Enquiry and Review data is left
  // untouched by design — re-seeding shouldn't wipe real transactional data
  // that may have been created against these same product/category IDs in
  // a previous run. Delete those collections manually if you need a fully
  // clean slate.
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Collection.deleteMany({}),
    Product.deleteMany({}),
    FAQ.deleteMany({}),
    GoldRate.deleteMany({}),
    Offer.deleteMany({}),
    Banner.deleteMany({}),
  ]);

  // --- Users ---
  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || 'Store Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@gayatrijewellers.test',
    phone: process.env.SEED_ADMIN_PHONE || '9999999999',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    role: 'ADMIN',
  });

  const customer = await User.create({
    name: process.env.SEED_CUSTOMER_NAME || 'Demo Customer',
    email: process.env.SEED_CUSTOMER_EMAIL || 'customer@gayatrijewellers.test',
    phone: process.env.SEED_CUSTOMER_PHONE || '8888888888',
    password: process.env.SEED_CUSTOMER_PASSWORD || 'Customer@12345',
    role: 'CUSTOMER',
  });

  console.log(`Created admin user: ${admin.email}`);
  console.log(`Created demo customer: ${customer.email}`);

  // --- Categories ---
  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(createdCategories.map((c) => [c.name, c._id]));
  console.log(`Created ${createdCategories.length} categories.`);

  // --- Collections ---
  const createdCollections = await Collection.insertMany(collections);
  const collectionMap = Object.fromEntries(createdCollections.map((c) => [c.name, c._id]));
  console.log(`Created ${createdCollections.length} collections.`);

  // --- Gold Rate (seeded before Products: rate-linked products compute
  // their finalPrice from the current gold rate on creation, so the rate
  // must already exist) ---
  await GoldRate.create({
    rate24k: 7250,
    rate22k: 6645,
    rate18k: 5438,
    silverRate: 92,
    isCurrent: true,
  });
  console.log('Created initial gold rate entry.');

  // --- Products ---
  const productDocs = productTemplates.map((tpl, idx) => {
    const sku = `RJ-${String(idx + 1).padStart(4, '0')}`;
    return {
      name: tpl.name,
      sku,
      description: tpl.description,
      shortDescription: tpl.shortDescription,
      tags: [tpl.categoryName.toLowerCase(), tpl.metal.toLowerCase()],
      category: categoryMap[tpl.categoryName],
      collection: collectionMap[tpl.collectionName],
      mainImage: PLACEHOLDER_IMG(sku),
      images: [PLACEHOLDER_IMG(`${sku}-1`), PLACEHOLDER_IMG(`${sku}-2`), PLACEHOLDER_IMG(`${sku}-3`)],
      metal: tpl.metal,
      purity: tpl.purity,
      grossWeight: tpl.grossWeight,
      netWeight: tpl.netWeight,
      diamondWeight: tpl.diamondWeight || 0,
      stoneType: tpl.stoneType || '',
      size: tpl.size || '',
      basePrice: tpl.basePrice,
      rateType: tpl.rateType || 'NONE',
      marginType: tpl.marginType || 'PERCENTAGE',
      marginValue: tpl.marginValue || 0,
      gstPercent: tpl.gstPercent ?? 3,
      makingCharges: tpl.makingCharges || 0,
      discount: tpl.discount || 0,
      stockQuantity: tpl.stockQuantity,
      gender: tpl.gender,
      occasion: tpl.occasion || [],
      isNewArrival: !!tpl.isNewArrival,
      isBestSeller: !!tpl.isBestSeller,
      isFeatured: !!tpl.isFeatured,
      rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 50) + 3,
      seo: {
        metaTitle: tpl.name,
        metaDescription: tpl.shortDescription,
      },
    };
  });

  // Use .create() (not insertMany) so pre-save hooks (slug, finalPrice, stockStatus) run
  const createdProducts = [];
  for (const doc of productDocs) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.create(doc);
    createdProducts.push(product);
  }
  console.log(`Created ${createdProducts.length} products.`);

  // --- FAQs ---
  await FAQ.insertMany(faqs);
  console.log(`Created ${faqs.length} FAQs.`);

  // --- Offers ---
  await Offer.insertMany(offers);
  console.log(`Created ${offers.length} offers.`);

  // --- Banners ---
  await Banner.insertMany(banners);
  console.log(`Created ${banners.length} banners.`);

  console.log('\nSeed complete. Demo credentials:');
  console.log(`  Admin    -> email: ${admin.email} / password: ${process.env.SEED_ADMIN_PASSWORD || 'Admin@12345'}`);
  console.log(`  Customer -> email: ${customer.email} / password: ${process.env.SEED_CUSTOMER_PASSWORD || 'Customer@12345'}`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
