import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { fetchOrderById } from '../services/orderService';
import { formatINR } from '../utils/formatCurrency';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchOrderById(id)
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading order…" />;
  if (notFound || !order) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Order not found"
          action={<Link to="/account/orders" className="btn-primary mt-2">Back to My Orders</Link>}
        />
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'My Orders', to: '/account/orders' }, { label: order.orderNumber }]}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-3xl">Order {order.orderNumber}</h1>
        <span className="text-sm text-charcoal-soft">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
        </span>
      </div>

      {/* Status timeline */}
      <div className="mt-10 flex items-center justify-between overflow-x-auto pb-4">
        {STATUS_FLOW.map((status, idx) => (
          <div key={status} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs ${
                  idx <= currentIndex ? 'bg-pine text-ivory' : 'bg-sand text-charcoal-soft'
                }`}
              >
                {idx < currentIndex ? <Check size={16} /> : idx + 1}
              </div>
              <span className={`whitespace-nowrap text-xs ${idx <= currentIndex ? 'text-charcoal' : 'text-charcoal-soft'}`}>
                {STATUS_LABELS[status]}
              </span>
            </div>
            {idx < STATUS_FLOW.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${idx < currentIndex ? 'bg-pine' : 'bg-sand-dark'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-display text-xl">Items</h2>
          <div className="mt-4 divide-y divide-sand-dark/60 border-y border-sand-dark/60">
            {order.orderItems.map((item) => (
              <div key={item.product} className="flex items-center gap-4 py-4">
                <img src={item.image} alt={item.name} className="h-16 w-16 object-cover" />
                <div className="flex-1">
                  <p className="font-display text-lg">{item.name}</p>
                  <p className="text-xs text-charcoal-soft">SKU: {item.sku} · Qty: {item.quantity}</p>
                </div>
                <p className="text-sm">{formatINR(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-fit space-y-6">
          <div className="border border-sand-dark p-5">
            <h3 className="font-display text-lg">Shipping Address</h3>
            <p className="mt-2 text-sm text-charcoal-soft">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
              {order.shippingAddress.phone}
            </p>
          </div>
          <div className="border border-sand-dark p-5">
            <h3 className="font-display text-lg">Payment</h3>
            <p className="mt-2 text-sm text-charcoal-soft">
              Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}<br />
              Status: {order.paymentStatus}
            </p>
            <div className="mt-3 flex justify-between border-t border-sand-dark/60 pt-3 text-base font-medium">
              <span>Total</span>
              <span>{formatINR(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
