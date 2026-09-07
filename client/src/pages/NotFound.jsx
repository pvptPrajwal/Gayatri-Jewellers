import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
    <p className="font-display text-8xl text-gold">404</p>
    <h1 className="mt-4 font-display text-3xl">Page Not Found</h1>
    <p className="mt-2 max-w-sm text-sm text-charcoal-soft">
      The page you're looking for doesn't exist or may have moved.
    </p>
    <Link to="/" className="btn-primary mt-6">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
