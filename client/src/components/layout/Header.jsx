import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { selectCartCount } from '../../features/cart/cartSlice';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/collections', label: 'Collections' },
  { to: '/shop', label: 'Shop' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/offers', label: 'Offers' },
  { to: '/gold-rate', label: 'Gold Rate' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/faq', label: 'FAQ' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-sand-dark/70 bg-ivory/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Gayatri Jewellers" className="h-10 w-10 sm:h-12 sm:w-12" />
          <span className="font-display text-xl tracking-wide text-charcoal sm:text-2xl">
            Gayatri <span className="text-gold-deep">Jewellers</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[13px] tracking-wide transition-colors hover:text-gold-deep ${
                  isActive ? 'text-gold-deep' : 'text-charcoal'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setSearchOpen((s) => !s)} aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/wishlist" className="relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] text-ivory">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-deep text-[10px] text-ivory">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to={isAuthenticated ? '/account' : '/login'} aria-label="Account">
            <User size={20} />
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-sand-dark/70 bg-ivory">
          <form onSubmit={handleSearchSubmit} className="container-page flex items-center gap-3 py-3">
            <Search size={18} className="text-charcoal-soft" />
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for rings, necklaces, earrings…"
              className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal-soft/60 focus:outline-none"
            />
          </form>
        </div>
      )}

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
};

export default Header;
