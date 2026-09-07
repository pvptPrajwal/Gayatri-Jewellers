import { Star } from 'lucide-react';

const Rating = ({ value = 0, count, size = 14 }) => {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= rounded ? 'fill-gold text-gold' : 'fill-sand-dark text-sand-dark'}
          />
        ))}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs text-charcoal-soft">({count})</span>
      )}
    </div>
  );
};

export default Rating;
