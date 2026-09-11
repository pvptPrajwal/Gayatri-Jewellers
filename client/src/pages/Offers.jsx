import { useEffect, useState } from 'react';
import { Tag, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOffers } from '../services/offerBannerService';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Seo from '../components/common/Seo';

const DISCOUNT_LABEL = {
  PERCENTAGE: (v) => `${v}% OFF`,
  FLAT: (v) => `₹${v} OFF`,
  MAKING_CHARGE_OFF: (v) => `${v}% OFF Making Charges`,
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers()
      .then(setOffers)
      .finally(() => setLoading(false));
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copied`);
  };

  return (
    <div className="container-page py-10">
      <Seo
        title="Offers"
        description="Current festive offers, making-charge discounts and gold exchange deals from Gayatri Jewellers."
        path="/offers"
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Offers' }]} />
      <h1 className="mt-4 font-display text-4xl">Current Offers</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal-soft">
        Festive discounts, making-charge offers and exclusive codes — updated regularly.
      </p>

      <div className="mt-10">
        {loading ? (
          <LoadingSpinner />
        ) : offers.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No active offers right now"
            description="Check back soon — new offers are added regularly."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div key={offer._id} className="flex flex-col border border-sand-dark bg-ivory">
                <div className="aspect-[16/9] w-full overflow-hidden bg-sand">
                  <img
                    src={offer.image?.url || `https://picsum.photos/seed/offer-${offer._id}/600/340`}
                    alt={offer.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="w-fit bg-maroon px-2 py-1 text-[10px] tracking-widest2 text-ivory">
                    {DISCOUNT_LABEL[offer.discountType](offer.discountValue)}
                  </span>
                  <h3 className="mt-3 font-display text-xl">{offer.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-charcoal-soft">{offer.description}</p>

                  {offer.code && (
                    <button
                      type="button"
                      onClick={() => copyCode(offer.code)}
                      className="mt-3 flex w-fit items-center gap-2 border border-dashed border-gold px-3 py-1.5 text-xs text-gold-deep"
                    >
                      <Copy size={12} /> Code: {offer.code}
                    </button>
                  )}

                  <p className="mt-3 text-xs text-charcoal-soft">
                    Valid till {new Date(offer.validTill).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>

                  {offer.termsAndConditions && (
                    <details className="mt-3 text-xs text-charcoal-soft">
                      <summary className="cursor-pointer text-gold-deep">Terms & Conditions</summary>
                      <p className="mt-2">{offer.termsAndConditions}</p>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
