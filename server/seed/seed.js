require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Product = require('../models/Product');

const { categories, collections, productTemplates } = require('./data');

const PLACEHOLDER_IMG = (seed) => ({
  url: `https://picsum.photos/seed/${seed}/800/800`,
  publicId: '',
  alt: 'Jewellery product image',
});

const run = async () => {
  await connectDB();

  const destroy = process.argv.includes('-d');

  if (destroy) {
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Collection.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('All collections cleared.');
    await mongoose.connection.close();
    process.exit(0);
  }

  // Clear existing data for a clean, repeatable seed
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Collection.deleteMany({}),
    Product.deleteMany({}),
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
      makingCharges: tpl.makingCharges,
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
