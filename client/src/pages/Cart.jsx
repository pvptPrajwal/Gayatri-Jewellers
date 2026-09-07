import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { removeFromCart, updateQuantity, selectCartSubtotal } from '../features/cart/cartSlice';
import { formatINR } from '../utils/formatCurrency';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();

  const estimatedCharges = items.length > 0 ? 0 : 0; // shipping is complimentary per announcement bar
  const total = subtotal + estimatedCharges;

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Explore our collections and add a piece you love."
          action={
            <Link to="/shop" className="btn-primary mt-2">
              Continue Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <h1 className="mt-4 font-display text-4xl">Shopping Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-sand-dark/60">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-6">
              <Link to={`/product/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden bg-sand">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link to={`/product/${item.slug}`} className="font-display text-lg text-charcoal">
                      {item.name}
                    </Link>
                    <p className="text-xs text-charcoal-soft">
                      {item.metal} · {item.purity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-charcoal">{formatINR(item.finalPrice * item.quantity)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-sand-dark">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                      disabled={item.quantity <= 1}
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center"
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(removeFromCart(item.productId));
                      toast.success('Removed from cart');
                    }}
                    className="flex items-center gap-1 text-xs text-maroon hover:underline"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="h-fit border border-sand-dark p-6">
          <h2 className="font-display text-xl">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-charcoal-soft">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-soft">
              <span>Estimated Charges</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between border-t border-sand-dark/60 pt-2 text-base font-medium text-charcoal">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
          <button type="button" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </button>
          <Link to="/shop" className="mt-3 block text-center text-xs text-charcoal-soft hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
