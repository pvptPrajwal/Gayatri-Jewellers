import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag, HelpCircle, Truck, RefreshCw, ShieldCheck } from 'lucide-react';
import { fetchProductBySlug } from '../services/productService';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../features/wishlist/wishlistSlice';
import { formatINR } from '../utils/formatCurrency';
import Breadcrumb from '../components/common/Breadcrumb';
import Rating from '../components/common/Rating';
import ProductGrid from '../components/common/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const isWishlisted = useSelector(selectIsWishlisted(product?._id));

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setNotFound(false);
    fetchProductBySlug(slug)
      .then(({ product: p, relatedProducts }) => {
        if (!mounted) return;
        setProduct(p);
        setRelated(relatedProducts);
        setActiveImage(0);
        window.scrollTo({ top: 0 });
      })
      .catch(() => {
        if (mounted) setNotFound(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <LoadingSpinner label="Loading product…" className="min-h-[60vh]" />;

  if (notFound || !product) {
    return (
      <EmptyState
        title="Product not found"
        description="This piece may have sold out or the link is incorrect."
        action={
          <Link to="/shop" className="btn-primary mt-2">
            Back to Shop
          </Link>
        }
      />
    );
  }

  const gallery = [product.mainImage, ...(product.images || [])].filter(Boolean);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.mainImage?.url,
        finalPrice: product.finalPrice,
        metal: product.metal,
        purity: product.purity,
        stockQuantity: product.stockQuantity,
      })
    );
    toast.success('Added to cart');
  };

  const handleWishlist = () => {
    dispatch(
      toggleWishlist({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.mainImage?.url,
        finalPrice: product.finalPrice,
        metal: product.metal,
        purity: product.purity,
      })
    );
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: product.category?.name || 'Product', to: `/shop?category=${product.category?._id}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden bg-sand">
            <img
              src={gallery[activeImage]?.url}
              alt={gallery[activeImage]?.alt || product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-3">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={`aspect-square overflow-hidden bg-sand ${
                  activeImage === idx ? 'ring-2 ring-gold' : ''
                }`}
              >
                <img src={img.url} alt={img.alt || product.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs tracking-wide text-charcoal-soft">SKU: {product.sku}</p>
          <h1 className="mt-1 font-display text-4xl">{product.name}</h1>
          <div className="mt-2">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>

          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-medium text-charcoal">{formatINR(product.finalPrice)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-charcoal-soft line-through">
                {formatINR(product.basePrice + product.makingCharges)}
              </span>
            )}
          </p>
          <p
            className={`mt-1 text-xs ${
              product.stockStatus === 'OUT_OF_STOCK' ? 'text-maroon' : 'text-pine'
            }`}
          >
            {product.stockStatus === 'IN_STOCK' && 'In Stock — ready to ship'}
            {product.stockStatus === 'LOW_STOCK' && `Only ${product.stockQuantity} left in stock`}
            {product.stockStatus === 'OUT_OF_STOCK' && 'Currently out of stock'}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-charcoal-soft">{product.shortDescription}</p>

          {/* Specifications */}
          <div className="mt-6 grid grid-cols-2 gap-y-2 border-y border-sand-dark/60 py-5 text-sm">
            <Spec label="Metal" value={product.metal} />
            <Spec label="Purity" value={product.purity} />
            <Spec label="Gross Weight" value={`${product.grossWeight} g`} />
            <Spec label="Net Weight" value={`${product.netWeight} g`} />
            {product.diamondWeight > 0 && <Spec label="Diamond Weight" value={`${product.diamondWeight} ct`} />}
            {product.stoneType && <Spec label="Stone" value={product.stoneType} />}
            {product.size && <Spec label="Size" value={product.size} />}
            <Spec label="Gender" value={product.gender} />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'OUT_OF_STOCK'}
              className="btn-primary flex-1"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button type="button" onClick={handleWishlist} className="btn-outline">
              <Heart size={16} className={isWishlisted ? 'fill-maroon text-maroon' : ''} />
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <Link to="/contact" className="btn-outline">
              <HelpCircle size={16} /> Enquire Now
            </Link>
          </div>

          {/* Info strip */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoItem icon={ShieldCheck} label="BIS certified purity" />
            <InfoItem icon={Truck} label="Insured, tracked delivery" />
            <InfoItem icon={RefreshCw} label="15-day easy exchange" />
          </div>

          <div className="mt-8">
            <h3 className="font-display text-xl">Product Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{product.description}</p>
          </div>
        </div>
      </div>

      {related?.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-3xl">You May Also Like</h2>
          <div className="mt-8">
            <ProductGrid products={related} isLoading={false} />
          </div>
        </div>
      )}
    </div>
  );
};

const Spec = ({ label, value }) => (
  <div className="text-charcoal-soft">
    {label}: <span className="text-charcoal">{value}</span>
  </div>
);

const InfoItem = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-xs text-charcoal-soft">
    <Icon size={16} className="text-gold" />
    {label}
  </div>
);

export default ProductDetails;
