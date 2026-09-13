const categories = [
  { name: 'Rings', description: 'Elegant rings for every occasion', displayOrder: 1 },
  { name: 'Earrings', description: 'Handcrafted earrings in gold and diamond', displayOrder: 2 },
  { name: 'Necklace', description: 'Statement necklaces and chains', displayOrder: 3 },
  { name: 'Bangles', description: 'Traditional and modern bangles', displayOrder: 4 },
  { name: 'Bracelets', description: 'Delicate bracelets for daily wear', displayOrder: 5 },
  { name: 'Mangalsutra', description: 'Sacred mangalsutras with fine craftsmanship', displayOrder: 6 },
];

const collections = [
  { name: 'Gold Collection', description: 'Timeless 22K and 18K gold jewellery', isFeatured: true, displayOrder: 1 },
  { name: 'Diamond Collection', description: 'Certified diamonds set in fine gold', isFeatured: true, displayOrder: 2 },
  { name: 'Bridal Collection', description: 'Heirloom pieces for your big day', isFeatured: true, displayOrder: 3 },
  { name: 'Daily Wear', description: 'Lightweight jewellery for everyday elegance', isFeatured: true, displayOrder: 4 },
  { name: 'Silver Collection', description: 'Sterling silver jewellery', displayOrder: 5 },
  { name: 'Traditional Collection', description: 'Classic South Indian and Kundan designs', displayOrder: 6 },
  { name: 'Contemporary Collection', description: 'Modern minimal designs', displayOrder: 7 },
  { name: 'Special / Festival Collection', description: 'Curated pieces for festive occasions', displayOrder: 8 },
];

// Product templates - category/collection are attached at seed time once real IDs exist.
// Uses royalty-free placeholder jewellery imagery so the storefront is populated end-to-end.
const productTemplates = [
  {
    name: 'Classic Solitaire Diamond Ring',
    categoryName: 'Rings',
    collectionName: 'Diamond Collection',
    metal: 'Gold', purity: '18K', grossWeight: 4.2, netWeight: 3.8, diamondWeight: 0.5, stoneType: 'Diamond', size: '14',
    rateType: 'NONE', basePrice: 42000, marginType: 'PERCENTAGE', marginValue: 10, gstPercent: 3,
    discountType: 'PERCENTAGE', discountValue: 5, discountAppliesTo: 'FINAL_AMOUNT', stockQuantity: 8,
    gender: 'Women', occasion: ['Engagement', 'Wedding'],
    isNewArrival: true, isFeatured: true,
    description: 'A timeless solitaire diamond ring crafted in 18K gold, featuring a brilliant-cut certified diamond set in a classic four-prong setting.',
    shortDescription: 'Timeless 18K gold solitaire diamond ring.',
  },
  {
    name: 'Kundan Meenakari Jhumka Earrings',
    categoryName: 'Earrings',
    collectionName: 'Traditional Collection',
    metal: 'Gold', purity: '22K', grossWeight: 12.5, netWeight: 11.8, diamondWeight: 0, stoneType: 'Kundan',
    rateType: '22K', basePrice: 0, marginType: 'FLAT', marginValue: 8000, gstPercent: 3,
    discountType: 'FLAT', discountValue: 1500, discountAppliesTo: 'MARGIN', stockQuantity: 5,
    gender: 'Women', occasion: ['Festival', 'Wedding'],
    isBestSeller: true, isFeatured: true,
    description: 'Traditional Kundan Meenakari jhumkas handcrafted by master artisans in 22K gold with intricate enamel work.',
    shortDescription: 'Handcrafted 22K gold Kundan jhumkas.',
  },
  {
    name: 'Temple Design Gold Necklace',
    categoryName: 'Necklace',
    collectionName: 'Traditional Collection',
    metal: 'Gold', purity: '22K', grossWeight: 32, netWeight: 30.5, diamondWeight: 0,
    rateType: '22K', basePrice: 0, marginType: 'PERCENTAGE', marginValue: 8, gstPercent: 3, stockQuantity: 3,
    gender: 'Women', occasion: ['Wedding', 'Festival'],
    isFeatured: true,
    description: 'An exquisite temple-design necklace in 22K gold, inspired by South Indian temple architecture with intricate deity motifs.',
    shortDescription: 'Intricate 22K gold temple-design necklace.',
  },
  {
    name: 'Minimal Bar Bracelet',
    categoryName: 'Bracelets',
    collectionName: 'Daily Wear',
    metal: 'Gold', purity: '18K', grossWeight: 3.1, netWeight: 2.9, diamondWeight: 0,
    rateType: '18K', basePrice: 0, marginType: 'FLAT', marginValue: 3000, gstPercent: 3, stockQuantity: 15,
    gender: 'Women', occasion: ['Daily Wear'],
    isNewArrival: true,
    description: 'A sleek minimal bar bracelet in 18K gold, perfect for everyday elegance and easy layering.',
    shortDescription: 'Sleek everyday 18K gold bracelet.',
  },
  {
    name: 'Classic Gold Bangles (Set of 2)',
    categoryName: 'Bangles',
    collectionName: 'Gold Collection',
    metal: 'Gold', purity: '22K', grossWeight: 24, netWeight: 23.2, diamondWeight: 0, size: '2.6',
    rateType: '22K', basePrice: 0, marginType: 'PERCENTAGE', marginValue: 6, gstPercent: 3, stockQuantity: 6,
    gender: 'Women', occasion: ['Wedding', 'Daily Wear'],
    isBestSeller: true,
    description: 'A classic pair of 22K gold bangles with a smooth polished finish, versatile for daily wear or special occasions.',
    shortDescription: 'Polished 22K gold bangle set.',
  },
  {
    name: 'Diamond Drop Mangalsutra',
    categoryName: 'Mangalsutra',
    collectionName: 'Bridal Collection',
    metal: 'Gold', purity: '18K', grossWeight: 15, netWeight: 14, diamondWeight: 0.3, stoneType: 'Diamond', size: '18 inch',
    rateType: '18K', basePrice: 0, marginType: 'FLAT', marginValue: 15000, gstPercent: 3, stockQuantity: 4,
    gender: 'Women', occasion: ['Wedding'],
    isFeatured: true,
    description: 'A beautifully designed mangalsutra in 18K gold with a diamond-studded pendant on a traditional black-bead chain.',
    shortDescription: '18K gold diamond mangalsutra.',
  },
  {
    name: 'Rose Gold Stud Earrings',
    categoryName: 'Earrings',
    collectionName: 'Contemporary Collection',
    metal: 'Rose Gold', purity: '18K', grossWeight: 1.8, netWeight: 1.7, diamondWeight: 0.1, stoneType: 'Diamond',
    rateType: '18K', basePrice: 0, marginType: 'FLAT', marginValue: 5000, gstPercent: 3, stockQuantity: 20,
    gender: 'Women', occasion: ['Daily Wear', 'Office Wear'],
    isNewArrival: true,
    description: 'Contemporary rose gold stud earrings with a single sparkling diamond, ideal for daily and office wear.',
    shortDescription: 'Everyday rose gold diamond studs.',
  },
  {
    name: 'Silver Oxidised Choker',
    categoryName: 'Necklace',
    collectionName: 'Silver Collection',
    metal: 'Silver', purity: '925 Silver', grossWeight: 28, netWeight: 27, diamondWeight: 0,
    rateType: 'SILVER', basePrice: 0, marginType: 'FLAT', marginValue: 3500, gstPercent: 3, stockQuantity: 12,
    gender: 'Women', occasion: ['Festival', 'Casual'],
    isNewArrival: true,
    description: 'A statement oxidised silver choker with traditional motifs, perfect for festive and ethnic outfits.',
    shortDescription: 'Statement oxidised silver choker.',
  },
];

const faqs = [
  { question: 'How do I know my jewellery is genuine gold?', answer: 'Every piece is BIS hallmarked and comes with a purity certificate.', category: 'Jewellery', displayOrder: 1 },
  { question: 'What is the difference between 22K and 18K gold?', answer: '22K gold is 91.6% pure and ideal for traditional jewellery; 18K is 75% pure, more durable, and better suited to pieces with stone-setting.', category: 'Jewellery', displayOrder: 2 },
  { question: 'How can I track my order?', answer: 'Once your order ships, you can track its status from My Account > My Orders.', category: 'Orders', displayOrder: 1 },
  { question: 'Can I cancel or modify my order?', answer: 'Orders can be modified or cancelled within 24 hours of placement by contacting our support team.', category: 'Orders', displayOrder: 2 },
  { question: 'Do you offer free shipping?', answer: 'Yes, all orders include complimentary insured shipping across India.', category: 'Shipping', displayOrder: 1 },
  { question: 'How long does delivery take?', answer: 'Most orders are delivered within 5-7 business days; made-to-order bridal pieces may take 2-3 weeks.', category: 'Shipping', displayOrder: 2 },
  { question: 'What is your exchange policy?', answer: 'We offer a 15-day easy exchange on all unworn pieces with original packaging and invoice.', category: 'Returns & Exchange', displayOrder: 1 },
  { question: 'Do you buy back old gold?', answer: 'Yes, we offer gold exchange at the day\'s published rate — visit our store with the piece and a valid ID.', category: 'Returns & Exchange', displayOrder: 2 },
  { question: 'What payment methods do you accept?', answer: 'We accept cash on delivery and all major UPI, debit and credit cards for online payment.', category: 'Payment', displayOrder: 1 },
  { question: 'Can I get a custom design made?', answer: 'Yes — bring your design or reference image to our store and our design team will create a custom quote.', category: 'Custom Jewellery', displayOrder: 1 },
];

const now = new Date();
const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

const offers = [
  {
    title: 'Festive Gold Rush',
    description: 'Celebrate the season with 10% off making charges on all gold jewellery.',
    discountType: 'MAKING_CHARGE_OFF',
    discountValue: 10,
    validTill: daysFromNow(30),
    termsAndConditions: 'Valid on gold jewellery only. Cannot be combined with other offers. Valid while stocks last.',
    displayOrder: 1,
  },
  {
    title: 'Bridal Bonanza',
    description: 'Flat 5% off on the Bridal Collection — because your big day deserves it.',
    discountType: 'PERCENTAGE',
    discountValue: 5,
    code: 'BRIDAL5',
    validTill: daysFromNow(45),
    termsAndConditions: 'Applicable only on Bridal Collection pieces. One code per order.',
    displayOrder: 2,
  },
  {
    title: 'Silver Saver',
    description: 'Flat ₹500 off on silver jewellery purchases above ₹5,000.',
    discountType: 'FLAT',
    discountValue: 500,
    validTill: daysFromNow(20),
    termsAndConditions: 'Minimum purchase of ₹5,000 on Silver Collection required.',
    displayOrder: 3,
  },
];

const banners = [
  {
    title: 'Festive Collection is Here',
    subtitle: 'Handcrafted gold and diamond pieces for the season of celebration',
    image: { url: 'https://picsum.photos/seed/gayatri-banner-1/1600/600' },
    link: '/shop?isFeatured=true',
    buttonText: 'Shop Now',
    displayOrder: 1,
  },
  {
    title: 'Bridal Edit',
    subtitle: 'Heirloom pieces for your big day',
    image: { url: 'https://picsum.photos/seed/gayatri-banner-2/1600/600' },
    link: '/collections',
    buttonText: 'Explore Bridal',
    displayOrder: 2,
  },
];

module.exports = { categories, collections, productTemplates, faqs, offers, banners };
