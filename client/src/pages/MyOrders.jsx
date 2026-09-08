import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { fetchMyOrders } from '../services/orderService';
import { formatINR } from '../utils/formatCurrency';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

const STATUS_STYLE = {
  PENDING: 'bg-gold/10 text-gold-deep',
  CONFIRMED: 'bg-gold/10 text-gold-deep',
  PROCESSING: 'bg-gold/10 text-gold-deep',
  SHIPPED: 'bg-pine/10 text-pine',
  DELIVERED: 'bg-pine/10 text-pine',
};

const MyOrders = () => {
  const [result, setResult] = useState({ orders: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchMyOrders({ page, limit: 10 })
      .then(setResult)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My Account', to: '/account' }, { label: 'My Orders' }]} />
      <h1 className="mt-4 font-display text-4xl">My Orders</h1>

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner />
        ) : result.orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Once you place an order, it'll show up here."
            action={<Link to="/shop" className="btn-primary mt-2">Start Shopping</Link>}
          />
        ) : (
          <div className="divide-y divide-sand-dark/60 border-y border-sand-dark/60">
            {result.orders.map((order) => (
              <Link
                key={order._id}
                to={`/account/orders/${order._id}`}
                className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-sand/40"
              >
                <div>
                  <p className="font-display text-lg">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal-soft">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {order.orderItems.length} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-[10px] ${STATUS_STYLE[order.status]}`}>{order.status}</span>
                  <span className="text-sm font-medium">{formatINR(order.totalPrice)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default MyOrders;
