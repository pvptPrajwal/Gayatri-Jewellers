const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');

const STATIC_PATHS = [
  '', 'about', 'collections', 'shop', 'new-arrivals', 'offers',
  'gold-rate', 'contact', 'faq',
];

const escapeXml = (str = '') =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const urlEntry = (siteUrl, path, lastmod, priority = '0.7') => `
  <url>
    <loc>${escapeXml(`${siteUrl}/${path}`)}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <priority>${priority}</priority>
  </url>`;

// @desc    Dynamically generated sitemap.xml covering static pages,
//          active products, categories and collections
// @route   GET /sitemap.xml
// @access  Public
const getSitemap = asyncHandler(async (req, res) => {
  const siteUrl = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');

  const [products, categories, collections] = await Promise.all([
    Product.find({ isActive: true }).select('slug updatedAt'),
    Category.find({ isActive: true }).select('_id updatedAt'),
    Collection.find({ isActive: true }).select('_id updatedAt'),
  ]);

  const entries = [
    ...STATIC_PATHS.map((p) => urlEntry(siteUrl, p, null, p === '' ? '1.0' : '0.8')),
    ...products.map((p) => urlEntry(siteUrl, `product/${p.slug}`, p.updatedAt, '0.9')),
    ...categories.map((c) => urlEntry(siteUrl, `shop?category=${c._id}`, c.updatedAt, '0.6')),
    ...collections.map((c) => urlEntry(siteUrl, `shop?collection=${c._id}`, c.updatedAt, '0.6')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

module.exports = { getSitemap };
