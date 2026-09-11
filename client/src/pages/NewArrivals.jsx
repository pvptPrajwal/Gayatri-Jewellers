import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';
import ProductGrid from '../components/common/ProductGrid';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';
import Seo from '../components/common/Seo';

const NewArrivals = () => {
  const [result, setResult] = useState({ products: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProducts({ isNewArrival: true, sort: 'newest', page, limit: 12 })
      .then((data) => mounted && setResult(data))
      .catch(console.error)
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <div className="container-page py-10">
      <Seo
        title="New Arrivals"
        description="The latest gold and diamond jewellery pieces from Gayatri Jewellers."
        path="/new-arrivals"
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'New Arrivals' }]} />
      <h1 className="mt-4 font-display text-4xl">New Arrivals</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal-soft">
        Fresh from the workshop — the latest pieces added to our collection.
      </p>

      <div className="mt-10">
        <ProductGrid
          products={result.products}
          isLoading={loading}
          emptyTitle="No new arrivals yet"
          emptyDescription="Check back soon — new pieces are added regularly."
        />
        <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default NewArrivals;
