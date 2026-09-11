import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOffers, createOffer, updateOffer, deleteOffer } from '../../services/offerBannerService';
import { SingleImageUploader } from '../../components/admin/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const DISCOUNT_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage Off' },
  { value: 'FLAT', label: 'Flat Amount Off' },
  { value: 'MAKING_CHARGE_OFF', label: 'Making Charge % Off' },
];

const emptyForm = {
  title: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  code: '',
  image: null,
  validTill: '',
  termsAndConditions: '',
  isActive: true,
};

const toDateInputValue = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    fetchOffers({ all: 'true' })
      .then(setOffers)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (offer) => {
    setForm({
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      code: offer.code || '',
      image: offer.image,
      validTill: toDateInputValue(offer.validTill),
      termsAndConditions: offer.termsAndConditions || '',
      isActive: offer.isActive,
    });
    setEditingId(offer._id);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.discountValue || !form.validTill) {
      toast.error('Title, description, discount value and valid-till date are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, discountValue: Number(form.discountValue) };
      if (editingId) {
        await updateOffer(editingId, payload);
        toast.success('Offer updated');
      } else {
        await createOffer(payload);
        toast.success('Offer created');
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOffer(toDelete._id);
      toast.success('Offer deleted');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Offers</h1>
        <button type="button" onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Offer
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 divide-y divide-sand-dark/60 border-y border-sand-dark/60">
          {offers.map((offer) => (
            <div key={offer._id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{offer.title}</p>
                <p className="text-xs text-charcoal-soft">
                  {offer.discountType.replace(/_/g, ' ')} · {offer.discountValue}
                  {offer.discountType === 'FLAT' ? '₹' : '%'} · Valid till{' '}
                  {new Date(offer.validTill).toLocaleDateString('en-IN')} ·{' '}
                  {offer.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button type="button" onClick={() => openEdit(offer)} className="text-charcoal-soft hover:text-gold-deep">
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => setToDelete(offer)} className="text-charcoal-soft hover:text-maroon">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-charcoal/50 p-4">
          <form onSubmit={handleSave} className="my-8 w-full max-w-lg bg-ivory p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">{editingId ? 'Edit Offer' : 'Add Offer'}</h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="offer-title" className="mb-1 block text-xs text-charcoal-soft">Title</label>
                <input id="offer-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label htmlFor="offer-description" className="mb-1 block text-xs text-charcoal-soft">Description</label>
                <textarea id="offer-description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="offer-discount-type" className="mb-1 block text-xs text-charcoal-soft">Discount Type</label>
                  <select id="offer-discount-type" value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))} className="input-field">
                    {DISCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="offer-discount-value" className="mb-1 block text-xs text-charcoal-soft">Discount Value</label>
                  <input id="offer-discount-value" type="number" value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="offer-code" className="mb-1 block text-xs text-charcoal-soft">Coupon Code (optional)</label>
                  <input id="offer-code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-field" />
                </div>
                <div>
                  <label htmlFor="offer-valid-till" className="mb-1 block text-xs text-charcoal-soft">Valid Till</label>
                  <input id="offer-valid-till" type="date" value={form.validTill} onChange={(e) => setForm((f) => ({ ...f, validTill: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div>
                <label htmlFor="offer-terms" className="mb-1 block text-xs text-charcoal-soft">Terms &amp; Conditions</label>
                <textarea id="offer-terms" value={form.termsAndConditions} onChange={(e) => setForm((f) => ({ ...f, termsAndConditions: e.target.value }))} rows={2} className="input-field" />
              </div>
              <div>
                <label className="mb-2 block text-xs text-charcoal-soft">Image</label>
                <SingleImageUploader value={form.image} onChange={(img) => setForm((f) => ({ ...f, image: img }))} folder="gayatri-jewellers/offers" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-gold" />
                Active (visible on storefront)
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
              <button type="button" onClick={() => setFormOpen(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this offer?"
        description={toDelete ? `"${toDelete.title}" will be removed from the storefront.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default AdminOffers;
