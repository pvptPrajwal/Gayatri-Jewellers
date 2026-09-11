import { useEffect, useState } from 'react';
import { fetchGoldRates } from '../services/miscService';
import Breadcrumb from '../components/common/Breadcrumb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatINR } from '../utils/formatCurrency';
import Seo from '../components/common/Seo';

const GoldRate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoldRates(30)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10">
      <Seo
        title="Today's Gold Rate"
        description="Today's published gold and silver rates per gram from Gayatri Jewellers."
        path="/gold-rate"
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: "Today's Gold Rate" }]} />
      <h1 className="mt-4 font-display text-4xl">Today's Gold Rate</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal-soft">
        Published rates per gram, updated by our team. Final jewellery pricing includes making charges.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : !data?.current ? (
        <p className="mt-10 text-sm text-charcoal-soft">Rates haven't been published yet — check back soon.</p>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <RateCard label="24K Gold" value={data.current.rate24k} />
            <RateCard label="22K Gold" value={data.current.rate22k} highlight />
            <RateCard label="18K Gold" value={data.current.rate18k} />
            <RateCard label="Silver" value={data.current.silverRate} />
          </div>
          <p className="mt-3 text-xs text-charcoal-soft">
            Last updated: {new Date(data.current.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>

          <div className="mt-12">
            <h2 className="font-display text-2xl">Rate History</h2>
            <div className="mt-4 overflow-x-auto border border-sand-dark">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="border-b border-sand-dark bg-sand text-xs text-charcoal-soft">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">24K</th>
                    <th className="px-4 py-3">22K</th>
                    <th className="px-4 py-3">18K</th>
                    <th className="px-4 py-3">Silver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-dark/60">
                  {data.history.map((r) => (
                    <tr key={r._id}>
                      <td className="px-4 py-3">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">{formatINR(r.rate24k)}</td>
                      <td className="px-4 py-3">{formatINR(r.rate22k)}</td>
                      <td className="px-4 py-3">{formatINR(r.rate18k)}</td>
                      <td className="px-4 py-3">{formatINR(r.silverRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-xs text-charcoal-soft">
            Disclaimer: Rates shown are indicative and per gram, subject to change without notice. Final
            billed price includes applicable making charges, GST, and any certification costs. Please
            confirm the exact rate with our store before purchase.
          </p>
        </>
      )}
    </div>
  );
};

const RateCard = ({ label, value, highlight }) => (
  <div className={`border p-5 text-center ${highlight ? 'border-gold bg-gold/5' : 'border-sand-dark bg-ivory'}`}>
    <p className="text-xs text-charcoal-soft">{label}</p>
    <p className="mt-2 font-display text-2xl">{formatINR(value)}</p>
    <p className="text-[10px] text-charcoal-soft">per gram</p>
  </div>
);

export default GoldRate;
