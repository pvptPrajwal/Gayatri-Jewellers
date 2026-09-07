import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center border border-sand-dark text-charcoal disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pageNumbers.map((p, idx) => {
        const prev = pageNumbers[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && <span className="text-charcoal-soft">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-9 w-9 items-center justify-center text-sm transition-colors ${
                p === page ? 'bg-charcoal text-ivory' : 'border border-sand-dark text-charcoal hover:border-gold'
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center border border-sand-dark text-charcoal disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
