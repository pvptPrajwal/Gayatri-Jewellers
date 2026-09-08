import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Gem,
  FolderTree,
  Layers,
  Users,
  ShoppingBag,
  MessageSquare,
  Coins,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { logout } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Gem },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/collections', label: 'Collections', icon: Layers },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/gold-rate', label: 'Gold Rate', icon: Coins },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F1] font-sans text-charcoal">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-sand-dark bg-charcoal px-4 text-ivory lg:hidden">
        <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span className="font-display text-lg">Gayatri Jewellers Admin</span>
        <div className="w-5" />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal text-ivory transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="flex items-center gap-2 font-display text-xl">
            <img src="/logo.png" alt="Gayatri Jewellers" className="h-8 w-8" />
            Gayatri <span className="text-gold-light">Admin</span>
          </span>
          <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-gold-deep text-ivory' : 'text-ivory/70 hover:bg-ivory/10 hover:text-ivory'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-ivory/10 p-4">
          <p className="truncate text-xs text-ivory/60">{user?.name}</p>
          <p className="truncate text-xs text-ivory/40">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-xs text-ivory/70 hover:text-gold-light"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-charcoal/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Content */}
      <main className="flex-1 pt-14 lg:pt-0">
        <div className="mx-auto max-w-6xl p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
