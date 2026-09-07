import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// items: [{ label, to }] — last item has no `to` (current page)
const Breadcrumb = ({ items }) => (
  <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-charcoal-soft">
    {items.map((item, idx) => (
      <span key={idx} className="flex items-center gap-1.5">
        {idx > 0 && <ChevronRight size={12} />}
        {item.to ? (
          <Link to={item.to} className="hover:text-gold-deep">
            {item.label}
          </Link>
        ) : (
          <span className="text-charcoal">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
