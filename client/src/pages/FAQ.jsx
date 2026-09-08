import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchFAQs } from '../services/miscService';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchFAQs()
      .then(setFaqs)
      .finally(() => setLoading(false));
  }, []);

  const grouped = faqs.reduce((acc, faq) => {
    (acc[faq.category] = acc[faq.category] || []).push(faq);
    return acc;
  }, {});

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
      <h1 className="mt-4 font-display text-4xl">Frequently Asked Questions</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal-soft">
        Answers to common questions about purity, orders, shipping, and returns.
      </p>

      <div className="mt-10 max-w-3xl">
        {loading ? (
          <LoadingSpinner />
        ) : faqs.length === 0 ? (
          <EmptyState title="No FAQs yet" description="Check back soon." />
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-10">
              <h2 className="section-label mb-4">{category.toUpperCase()}</h2>
              <div className="divide-y divide-sand-dark/60 border-t border-b border-sand-dark/60">
                {items.map((faq) => (
                  <div key={faq._id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className="font-display text-lg">{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-gold-deep transition-transform ${openId === faq._id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openId === faq._id && (
                      <p className="pb-4 text-sm leading-relaxed text-charcoal-soft">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQ;
