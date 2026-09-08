import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchMyOrders, updateOrderStatus } from '../../services/orderService';
import { formatINR } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const AdminOrders = () => {
  const [result, setResult] = useState({ orders: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    fetchMyOrders({ page, limit: 15, status: statusFilter || undefined })
      .then(setResult)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (order, status) => {
    try {
      await updateOrderStatus(order._id, status);
      toast.success(`Order marked ${status}`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border border-sand-dark bg-ivory px-3 py-2 text-xs"
        >
          <option value="">All statuses</option>
          {STATUS_FLOW.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-sand-dark bg-ivory">
        {loading ? (
          <LoadingSpinner />
        ) : result.orders.length === 0 ? (
          <EmptyState title="No orders yet" />
        ) : (
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand-dark text-xs text-charcoal-soft">
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-dark/60">
              {result.orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{order.user?.name}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">{formatINR(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gold/10 px-2 py-1 text-[10px] text-gold-deep">{order.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="border border-sand-dark bg-ivory px-2 py-1 text-xs"
                    >
                      {STATUS_FLOW.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
    </div>
  );
};

export default AdminOrders;
