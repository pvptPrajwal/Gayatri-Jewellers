import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Gem, Hammer, Headphones } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import { fetchCategories, fetchCollections } from '../services/catalogService';
import ProductGrid from '../components/common/ProductGrid';
import Seo from '../components/common/Seo';
import PromoBanners from '../components/common/PromoBanners';
import { fetchSiteSettings } from '../services/siteSettingsService';
import { optimizedImage } from '../utils/cloudinary';
import heroBanner from "./hero-banner.webp";

const categoryImageSeed = (name) => `https://picsum.photos/seed/cat-${encodeURIComponent(name)}/500/600`;
const collectionImageSeed = (name) => `https://picsum.photos/seed/col-${encodeURIComponent(name)}/700/500`;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Admin-editable images — fall back to bundled/placeholder defaults until
  // (or unless) an admin uploads one from /admin/site-images.
  const [heroImage, setHeroImage] = useState(null);
  const [storeImage, setStoreImage] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cats, cols, newRes, bestRes, settings] = await Promise.all([
          fetchCategories(),
          fetchCollections(),
          fetchProducts({ isNewArrival: true, limit: 8, sort: 'newest' }),
          fetchProducts({ isBestSeller: true, limit: 8, sort: 'featured' }),
          fetchSiteSettings().catch(() => null),
        ]);
        if (!mounted) return;
        setCategories(cats);
        setCollections(cols.filter((c) => c.isFeatured));
        setNewArrivals(newRes.products);
        setBestSellers(bestRes.products);
        if (settings?.heroImage?.url) setHeroImage(settings.heroImage.url);
        if (settings?.storeImage?.url) setStoreImage(settings.storeImage.url);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Seo
        description="Gayatri Jewellers — handcrafted gold, diamond and bridal jewellery in Chhatrapati Sambhajinagar. BIS hallmarked purity, lifetime exchange."
        path="/"
      />
      {/* Hero */}
      <section className="container-page grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="section-label">HANDCRAFTED WITH TRUST</p>
          <h1 className="mt-3 max-w-lg font-display text-5xl leading-[1.1] text-charcoal sm:text-6xl">
            Jewellery made to be <em className="not-italic text-gold-deep">handed down.</em>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-charcoal-soft">
            Certified gold and diamond pieces from Gayatri Jewellers, Chhatrapati Sambhajinagar.
            Every piece carries BIS hallmark purity and a lifetime exchange promise.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary">Shop the Collection</Link>
            <Link to="/collections" className="btn-outline">Explore Collections</Link>
          </div>
        </div>
        <div className="aspect-[4/5] w-full overflow-hidden bg-sand">
          <img
            src={optimizedImage(heroImage, 900) || heroBanner}
            alt="Featured bridal jewellery"
            className="h-full w-full object-cover"
            fetchpriority="high"
          />
        </div>
      </section>

      <PromoBanners />

      {/* Shop by category */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between">
          <div>
            <p className="section-label">CATEGORIES</p>
            <h2 className="mt-2 font-display text-3xl">Shop by Category</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/shop?category=${cat._id}`} className="group text-center">
              <div className="aspect-square overflow-hidden bg-sand">
                <img
                  src={optimizedImage(cat.image?.url, 200) || categoryImageSeed(cat.name)}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-xs text-charcoal">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured collections */}
      <section className="bg-sand py-14">
        <div className="container-page">
          <p className="section-label">CURATED FOR YOU</p>
          <h2 className="mt-2 font-display text-3xl">Featured Collections</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {collections.map((col) => (
              <Link key={col._id} to={`/shop?collection=${col._id}`} className="group relative block overflow-hidden">
                <div className="aspect-[7/5] w-full overflow-hidden">
                  <img
                    src={optimizedImage(col.image?.url, 500) || collectionImageSeed(col.name)}
                    alt={col.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-ivory">
                  <h3 className="font-display text-2xl">{col.name}</h3>
                  <p className="mt-1 text-xs tracking-wide">Explore Collection →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between">
          <div>
            <p className="section-label">JUST IN</p>
            <h2 className="mt-2 font-display text-3xl">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="text-xs tracking-wide text-gold-deep hover:underline">
            View All
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={newArrivals} isLoading={loading} emptyTitle="New arrivals coming soon" />
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-sand py-14">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">CUSTOMER FAVOURITES</p>
              <h2 className="mt-2 font-display text-3xl">Best Sellers</h2>
            </div>
            <Link to="/shop" className="text-xs tracking-wide text-gold-deep hover:underline">
              Shop All
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={bestSellers} isLoading={loading} emptyTitle="Best sellers coming soon" />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-page py-16">
        <p className="section-label text-center">WHY GAYATRI JEWELLERS </p>
        <h2 className="mt-2 text-center font-display text-3xl">Why Choose Us</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Gem, title: 'Certified Purity', desc: 'Every piece BIS hallmarked and independently certified.' },
            { icon: Hammer, title: 'Master Craftsmanship', desc: 'Hand-finished by karigars with generations of expertise.' },
            { icon: ShieldCheck, title: 'Lifetime Exchange', desc: 'Trade up anytime at transparent, published gold rates.' },
            { icon: Headphones, title: 'Dedicated Service', desc: 'Personal styling and after-sales care, in-store or online.' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <item.icon size={28} strokeWidth={1.2} className="mx-auto text-gold" />
              <h3 className="mt-4 font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-charcoal-soft">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visit our store */}
      <section className="bg-charcoal py-16 text-ivory">
        <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="section-label text-gold-light">VISIT US</p>
            <h2 className="mt-2 font-display text-3xl">Visit Our Store</h2>
            <p className="mt-4 max-w-md text-sm text-ivory/70">
              Step into our showroom for a personal consultation with our design team —
              walk-ins welcome, appointments preferred for bridal collections.
            </p>
            <div className="mt-6 space-y-1 text-sm text-ivory/80">
              <p>Pundlik Nagar Rd, near Shivaji Maharaj Statue, Nyay Nagar,</p>
              <p>Chhatrapati Sambhajinagar, Maharashtra 431009</p>
              <p>Mon–Sat: 10:30 AM – 8:30 PM · Sun: 11:00 AM – 6:00 PM</p>
            </div>
            <Link to="/contact" className="btn-gold mt-6 inline-flex">
              Get Directions
            </Link>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={optimizedImage(storeImage, 800) || "https://picsum.photos/seed/gayatri-store/800/600"}
              alt="Gayatri Jewellers showroom"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
