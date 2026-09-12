import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { toggleWishlist, selectIsWishlisted } from '../../features/wishlist/wishlistSlice';
import { formatINR } from '../../utils/formatCurrency';
import { optimizedImage } from '../../utils/cloudinary';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product._id));

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: optimizedImage(product.mainImage?.url, 300),
        finalPrice: product.finalPrice,
        metal: product.metal,
        purity: product.purity,
      })
    );
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link to={`/product/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-sand">
        {product.mainImage?.url ? (
          <img
            src={optimizedImage(product.mainImage.url, 500)}
            alt={product.mainImage.alt || product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-charcoal-soft">No image</div>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-ivory/90 transition-colors hover:bg-ivory"
        >
          <Heart size={16} className={isWishlisted ? 'fill-maroon text-maroon' : 'text-charcoal'} />
        </button>

        {product.isNewArrival && (
          <span className="absolute left-3 top-3 bg-pine px-2 py-1 text-[10px] tracking-widest2 text-ivory">
            NEW
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col">
        <p className="text-xs text-charcoal-soft">{product.category?.name}</p>
        <h3 className="mt-0.5 truncate font-display text-lg text-charcoal">{product.name}</h3>
        <p className="text-xs text-charcoal-soft">
          {product.metal} · {product.purity}
          {product.grossWeight ? ` · ${product.grossWeight}g` : ''}
        </p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-medium text-charcoal">{formatINR(product.finalPrice)}</span>
          <span className="text-[10px] text-charcoal-soft">incl. GST</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
