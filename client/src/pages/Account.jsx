import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogOut, Heart, ShoppingBag, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';
import Breadcrumb from '../components/common/Breadcrumb';
import ChangePasswordForm from '../components/common/ChangePasswordForm';

const Account = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const cartCount = useSelector((state) => state.cart.items.length);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} />
      <h1 className="mt-4 font-display text-4xl">Welcome, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-charcoal-soft">{user?.email} · {user?.phone}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="border border-sand-dark p-6 text-center">
          <User size={22} className="mx-auto text-gold" />
          <p className="mt-2 text-xs text-charcoal-soft">Account Type</p>
          <p className="font-display text-lg">{user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}</p>
        </div>
        <Link to="/wishlist" className="border border-sand-dark p-6 text-center transition-colors hover:border-gold">
          <Heart size={22} className="mx-auto text-gold" />
          <p className="mt-2 text-xs text-charcoal-soft">Wishlist</p>
          <p className="font-display text-lg">{wishlistCount} items</p>
        </Link>
        <Link to="/cart" className="border border-sand-dark p-6 text-center transition-colors hover:border-gold">
          <ShoppingBag size={22} className="mx-auto text-gold" />
          <p className="mt-2 text-xs text-charcoal-soft">Cart</p>
          <p className="font-display text-lg">{cartCount} items</p>
        </Link>
      </div>

      <div className="mt-10 border border-sand-dark p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Recent Orders</h2>
          <Link to="/account/orders" className="text-xs text-gold-deep hover:underline">View All</Link>
        </div>
        <p className="mt-2 text-sm text-charcoal-soft">
          View your order history and track delivery status.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ChangePasswordForm />
        <button type="button" onClick={handleLogout} className="btn-outline">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
