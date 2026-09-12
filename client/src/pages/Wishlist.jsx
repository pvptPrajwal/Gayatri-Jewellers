import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, X, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { formatINR } from '../utils/formatCurrency';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import { optimizedImage } from '../utils/cloudinary';

const Wishlist = () => {
  const items = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save pieces you love to find them here later."
          action={
            <Link to="/shop" className="btn-primary mt-2">
              Explore Jewellery
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <h1 className="mt-4 font-display text-4xl">My Wishlist</h1>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.productId} className="group relative flex flex-col">
            <button
              type="button"
              onClick={() => {
                dispatch(removeFromWishlist(item.productId));
                toast.success('Removed from wishlist');
              }}
              aria-label="Remove from wishlist"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-ivory/90"
            >
              <X size={16} />
            </button>
            <Link to={`/product/${item.slug}`} className="aspect-square overflow-hidden bg-sand">
              <img src={optimizedImage(item.image, 300)} alt={item.name} className="h-full w-full object-cover" />
            </Link>
            <Link to={`/product/${item.slug}`} className="mt-3 font-display text-lg text-charcoal">
              {item.name}
            </Link>
            <p className="text-xs text-charcoal-soft">
              {item.metal} · {item.purity}
            </p>
            <p className="mt-1 text-sm font-medium">{formatINR(item.finalPrice)}</p>
            <button
              type="button"
              onClick={() => {
                dispatch(addToCart({ ...item, quantity: 1 }));
                toast.success('Added to cart');
              }}
              className="btn-outline mt-3 text-xs"
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
