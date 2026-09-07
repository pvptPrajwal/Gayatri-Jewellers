const LoadingSpinner = ({ label = 'Loading…', className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-sand-dark border-t-gold" />
    <p className="text-sm text-charcoal-soft">{label}</p>
  </div>
);

export default LoadingSpinner;
