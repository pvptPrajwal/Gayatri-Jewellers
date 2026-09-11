import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

const links = [
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

const MobileMenu = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-ivory p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl">Menu</span>
          <button type="button" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `border-b border-sand-dark/60 py-3 text-sm ${isActive ? 'text-gold-deep' : 'text-charcoal'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
