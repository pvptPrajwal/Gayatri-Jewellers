import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const ComingSoon = ({ title, description }) => (
  <div className="container-page flex min-h-[55vh] flex-col items-center justify-center text-center">
    <Sparkles size={32} strokeWidth={1.2} className="text-gold" />
    <h1 className="mt-4 font-display text-3xl">{title}</h1>
    <p className="mt-2 max-w-sm text-sm text-charcoal-soft">
      {description || 'This section is being finished in the next build phase.'}
    </p>
    <Link to="/shop" className="btn-outline mt-6">
      Continue Shopping
    </Link>
  </div>
);

export default ComingSoon;
