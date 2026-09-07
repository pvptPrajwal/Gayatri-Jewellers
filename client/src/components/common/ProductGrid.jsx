import { Gem } from 'lucide-react';
import ProductCard from './ProductCard';
import SkeletonGrid from './SkeletonLoader';
import EmptyState from './EmptyState';

const ProductGrid = ({ products, isLoading, emptyTitle = 'No products found', emptyDescription }) => {
  if (isLoading) return <SkeletonGrid />;

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Gem}
        title={emptyTitle}
        description={emptyDescription || 'Try adjusting your filters or check back soon for new pieces.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
