import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import { fetchCategories, fetchCollections } from '../services/catalogService';
import ProductGrid from '../components/common/ProductGrid';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';

const METALS = ['Gold', 'Silver', 'Platinum', 'Diamond', 'Rose Gold', 'White Gold'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [result, setResult] = useState({ products: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      collection: searchParams.get('collection') || '',
      metal: searchParams.get('metal') || '',
      gender: searchParams.get('gender') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || 'featured',
      page: Number(searchParams.get('page')) || 1,
    }),
    [searchParams]
  );

  useEffect(() => {
    Promise.all([fetchCategories(), fetchCollections()]).then(([cats, cols]) => {
      setCategories(cats);
      setCollections(cols);
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    fetchProducts({ ...params, limit: 12 })
      .then((data) => {
        if (mounted) setResult(data);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [filters]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const activeFilterCount = ['category', 'collection', 'metal', 'gender', 'minPrice', 'maxPrice'].filter(
    (k) => filters[k]
  ).length;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />
      <div className="mt-4 flex items-end justify-between">
        <h1 className="font-display text-4xl">Shop</h1>
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex items-center gap-2 border border-sand-dark px-4 py-2 text-xs tracking-wide lg:hidden"
        >
          <SlidersHorizontal size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-sm font-medium">Filters</span>
            <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <X size={18} />
            </button>
          </div>

          <FilterGroup title="Category">
            {categories.map((c) => (
              <FilterRadio
                key={c._id}
                label={c.name}
                checked={filters.category === c._id}
                onChange={() => updateFilter('category', filters.category === c._id ? '' : c._id)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Collection">
            {collections.map((c) => (
              <FilterRadio
                key={c._id}
                label={c.name}
                checked={filters.collection === c._id}
                onChange={() => updateFilter('collection', filters.collection === c._id ? '' : c._id)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Metal">
            {METALS.map((m) => (
              <FilterRadio
                key={m}
                label={m}
                checked={filters.metal === m}
                onChange={() => updateFilter('metal', filters.metal === m ? '' : m)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Gender">
            {GENDERS.map((g) => (
              <FilterRadio
                key={g}
                label={g}
                checked={filters.gender === g}
                onChange={() => updateFilter('gender', filters.gender === g ? '' : g)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Price Range (₹)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={filters.minPrice}
                onBlur={(e) => updateFilter('minPrice', e.target.value)}
                className="input-field text-xs"
              />
              <span className="text-charcoal-soft">–</span>
              <input
                type="number"
                placeholder="Max"
                defaultValue={filters.maxPrice}
                onBlur={(e) => updateFilter('maxPrice', e.target.value)}
                className="input-field text-xs"
              />
            </div>
          </FilterGroup>

          {activeFilterCount > 0 && (
            <button type="button" onClick={clearFilters} className="mt-4 text-xs text-maroon hover:underline">
              Clear all filters
            </button>
          )}
        </aside>

        {/* Products */}
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-sand-dark/70 pb-4">
            <p className="text-sm text-charcoal-soft">{result.total} pieces</p>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="border border-sand-dark bg-ivory px-3 py-2 text-xs"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>

          <ProductGrid products={result.products} isLoading={loading} />

          <Pagination
            page={result.page}
            pages={result.pages}
            onPageChange={(p) => updateFilter('page', String(p))}
          />
        </div>
      </div>
    </div>
  );
};

const FilterGroup = ({ title, children }) => (
  <div className="mb-6 border-b border-sand-dark/60 pb-6">
    <h4 className="mb-3 text-xs tracking-widest2 text-charcoal-soft">{title.toUpperCase()}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const FilterRadio = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
    <input type="checkbox" checked={checked} onChange={onChange} className="accent-gold" />
    {label}
  </label>
);

export default Shop;
