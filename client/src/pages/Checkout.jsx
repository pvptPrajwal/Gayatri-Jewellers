import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';
import { placeOrder } from '../services/orderService';
import { clearCart, selectCartSubtotal } from '../features/cart/cartSlice';
import { formatINR } from '../utils/formatCurrency';
import Breadcrumb from '../components/common/Breadcrumb';
import EmptyState from '../components/common/EmptyState';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number').required('Phone is required'),
  line1: yup.string().required('Address is required'),
  line2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().matches(/^[0-9]{6}$/, 'Enter a valid 6-digit pincode').required('Pincode is required'),
});

const Checkout = () => {
  const items = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add something to your cart before checking out."
          action={<Link to="/shop" className="btn-primary mt-2">Continue Shopping</Link>}
        />
      </div>
    );
  }

  const onSubmit = async (address) => {
    setPlacing(true);
    try {
      const order = await placeOrder({ shippingAddress: address, paymentMethod: 'COD' });
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/account/orders/${order._id}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-4 font-display text-4xl">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="font-display text-xl">Shipping Address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-charcoal-soft">Full Name</label>
              <input {...register('fullName')} className="input-field" />
              {errors.fullName && <p className="mt-1 text-xs text-maroon">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs text-charcoal-soft">Phone</label>
              <input {...register('phone')} className="input-field" />
              {errors.phone && <p className="mt-1 text-xs text-maroon">{errors.phone.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-charcoal-soft">Address Line 1</label>
              <input {...register('line1')} className="input-field" />
              {errors.line1 && <p className="mt-1 text-xs text-maroon">{errors.line1.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-charcoal-soft">Address Line 2 (optional)</label>
              <input {...register('line2')} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-charcoal-soft">City</label>
              <input {...register('city')} className="input-field" />
              {errors.city && <p className="mt-1 text-xs text-maroon">{errors.city.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs text-charcoal-soft">State</label>
              <input {...register('state')} className="input-field" />
              {errors.state && <p className="mt-1 text-xs text-maroon">{errors.state.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs text-charcoal-soft">Pincode</label>
              <input {...register('pincode')} className="input-field" />
              {errors.pincode && <p className="mt-1 text-xs text-maroon">{errors.pincode.message}</p>}
            </div>
          </div>

          <h2 className="pt-4 font-display text-xl">Payment Method</h2>
          <div className="border border-sand-dark p-4 text-sm">
            Cash on Delivery — pay when your order arrives. Online payment coming soon.
          </div>

          <button type="submit" disabled={placing} className="btn-primary w-full">
            {placing ? 'Placing Order…' : `Place Order — ${formatINR(subtotal)}`}
          </button>
        </form>

        <div className="h-fit border border-sand-dark p-6">
          <h2 className="font-display text-xl">Order Summary</h2>
          <div className="mt-4 divide-y divide-sand-dark/60">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between py-2 text-sm">
                <span className="max-w-[70%] truncate">{item.name} × {item.quantity}</span>
                <span>{formatINR(item.finalPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-sand-dark/60 pt-3 text-base font-medium">
            <span>Total</span>
            <span>{formatINR(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
