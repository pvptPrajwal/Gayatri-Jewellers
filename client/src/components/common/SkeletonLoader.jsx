const ProductCardSkeleton = () => (
  <div className="flex flex-col">
    <div className="skeleton aspect-square w-full" />
    <div className="skeleton mt-3 h-3 w-2/3" />
    <div className="skeleton mt-2 h-3 w-1/3" />
    <div className="skeleton mt-3 h-4 w-1/2" />
  </div>
);

const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default SkeletonGrid;
