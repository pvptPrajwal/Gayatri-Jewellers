import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts, deleteProduct } from '../../services/productService';
import { formatINR } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const STATUS_STYLE = {
  IN_STOCK: 'bg-pine/10 text-pine',
  LOW_STOCK: 'bg-gold/10 text-gold-deep',
  OUT_OF_STOCK: 'bg-maroon/10 text-maroon',
};

const AdminProductList = () => {
  const [result, setResult] = useState({ products: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    fetchProducts({ search, page, limit: 10, sort: 'newest' })
      .then(setResult)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(toDelete._id);
      toast.success('Product deleted');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Products</h1>
        <Link to="/admin/products/add" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-sm items-center gap-2 border border-sand-dark bg-ivory px-3 py-2">
        <Search size={16} className="text-charcoal-soft" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </form>

      <div className="mt-6 overflow-x-auto border border-sand-dark bg-ivory">
        {loading ? (
          <LoadingSpinner />
        ) : result.products.length === 0 ? (
          <EmptyState title="No products found" description="Try a different search or add your first product." />
        ) : (
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand-dark text-xs text-charcoal-soft">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-dark/60">
              {result.products.map((p) => (
                <tr key={p._id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.mainImage?.url} alt="" className="h-10 w-10 object-cover" />
                    <span className="max-w-[160px] truncate">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft">{p.sku}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{p.category?.name}</td>
                  <td className="px-4 py-3">{formatINR(p.finalPrice)}</td>
                  <td className="px-4 py-3">{p.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-[10px] ${STATUS_STYLE[p.stockStatus]}`}>
                      {p.stockStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link to={`/admin/products/${p._id}/edit`} aria-label="Edit product" className="text-charcoal-soft hover:text-gold-deep">
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setToDelete(p)}
                        aria-label="Delete product"
                        className="text-charcoal-soft hover:text-maroon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this product?"
        description={toDelete ? `"${toDelete.name}" will be permanently removed from the store.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default AdminProductList;
