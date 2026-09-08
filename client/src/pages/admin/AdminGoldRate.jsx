import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchGoldRates, createGoldRate } from '../../services/miscService';
import { formatINR } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const emptyForm = { rate24k: '', rate22k: '', rate18k: '', silverRate: '' };

const AdminGoldRate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchGoldRates(20)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => v === '')) {
      toast.error('All four rates are required');
      return;
    }
    setSaving(true);
    try {
      await createGoldRate({
        rate24k: Number(form.rate24k),
        rate22k: Number(form.rate22k),
        rate18k: Number(form.rate18k),
        silverRate: Number(form.silverRate),
      });
      toast.success('Gold rate updated');
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-3xl">Gold Rate</h1>

      {data?.current && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <RateCard label="24K" value={data.current.rate24k} />
          <RateCard label="22K" value={data.current.rate22k} />
          <RateCard label="18K" value={data.current.rate18k} />
          <RateCard label="Silver" value={data.current.silverRate} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg border border-sand-dark bg-ivory p-6">
        <h2 className="font-display text-xl">Publish New Rate</h2>
        <p className="mt-1 text-xs text-charcoal-soft">This becomes the current rate shown on the storefront.</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {[
            ['rate24k', '24K Rate (₹/g)'],
            ['rate22k', '22K Rate (₹/g)'],
            ['rate18k', '18K Rate (₹/g)'],
            ['silverRate', 'Silver Rate (₹/g)'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-xs text-charcoal-soft">{label}</label>
              <input
                type="number"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="input-field"
              />
            </div>
          ))}
        </div>
        <button type="submit" disabled={saving} className="btn-primary mt-4">
          {saving ? 'Publishing…' : 'Publish Rate'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="font-display text-xl">History</h2>
        <div className="mt-4 overflow-x-auto border border-sand-dark bg-ivory">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand-dark text-xs text-charcoal-soft">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">24K</th>
                <th className="px-4 py-3">22K</th>
                <th className="px-4 py-3">18K</th>
                <th className="px-4 py-3">Silver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-dark/60">
              {data?.history.map((r) => (
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
    </div>
  );
};

const RateCard = ({ label, value }) => (
  <div className="border border-sand-dark bg-ivory p-4 text-center">
    <p className="text-xs text-charcoal-soft">{label}</p>
    <p className="mt-1 font-display text-xl">{formatINR(value)}</p>
  </div>
);

export default AdminGoldRate;
