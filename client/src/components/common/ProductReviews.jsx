import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProductReviews, submitReview } from '../../services/miscService';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const ProductReviews = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProductReviews(productId)
      .then(setReviews)
      .finally(() => setLoading(false));
  };

  useEffect(load, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a short review');
      return;
    }
    setSubmitting(true);
    try {
      await submitReview({ product: productId, rating, comment });
      toast.success('Thank you for your review!');
      setComment('');
      setRating(5);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 max-w-2xl">
      <h2 className="font-display text-2xl">Customer Reviews</h2>

      {loading ? (
        <p className="mt-4 text-sm text-charcoal-soft">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-4 text-sm text-charcoal-soft">No reviews yet — be the first to share your thoughts.</p>
      ) : (
        <div className="mt-4 space-y-5 divide-y divide-sand-dark/60">
          {reviews.map((r) => (
            <div key={r._id} className="pt-5 first:pt-0">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={13} className={i <= r.rating ? 'fill-gold text-gold' : 'fill-sand-dark text-sand-dark'} />
                  ))}
                </div>
                <span className="text-xs text-charcoal-soft">{r.user?.name || 'Verified Buyer'}</span>
              </div>
              <p className="mt-2 text-sm text-charcoal-soft">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-sand-dark/60 pt-6">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit}>
            <h3 className="font-display text-lg">Write a Review</h3>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" onClick={() => setRating(i)} aria-label={`Rate ${i} stars`}>
                  <Star size={22} className={i <= rating ? 'fill-gold text-gold' : 'fill-sand-dark text-sand-dark'} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience with this piece…"
              className="input-field mt-3"
            />
            <button type="submit" disabled={submitting} className="btn-outline mt-3">
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-charcoal-soft">
            <Link to="/login" className="text-gold-deep hover:underline">Log in</Link> to write a review.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
