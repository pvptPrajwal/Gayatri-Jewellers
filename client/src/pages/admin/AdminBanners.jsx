import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '../../services/offerBannerService';
import { SingleImageUploader } from '../../components/admin/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const emptyForm = { title: '', subtitle: '', image: null, link: '', buttonText: 'Shop Now', isActive: true };

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    fetchBanners({ all: 'true' })
      .then(setBanners)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (banner) => {
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      buttonText: banner.buttonText || 'Shop Now',
      isActive: banner.isActive,
    });
    setEditingId(banner._id);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image?.url) {
      toast.error('Please upload a banner image');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateBanner(editingId, form);
        toast.success('Banner updated');
      } else {
        await createBanner(form);
        toast.success('Banner created');
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
      await deleteBanner(toDelete._id);
      toast.success('Banner deleted');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Banners</h1>
        <button type="button" onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Banner
        </button>
      </div>
      <p className="mt-2 text-xs text-charcoal-soft">
        Banners appear as a rotating strip on the Home page, in display order.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {banners.map((banner) => (
            <div key={banner._id} className="flex items-center gap-3 border border-sand-dark bg-ivory p-4">
              <div className="h-16 w-24 shrink-0 overflow-hidden bg-sand">
                {banner.image?.url && <img src={banner.image.url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{banner.title || '(no title)'}</p>
                <p className="text-xs text-charcoal-soft">{banner.isActive ? 'Active' : 'Inactive'} · order {banner.displayOrder}</p>
              </div>
              <button type="button" onClick={() => openEdit(banner)} className="text-charcoal-soft hover:text-gold-deep">
                <Pencil size={16} />
              </button>
              <button type="button" onClick={() => setToDelete(banner)} className="text-charcoal-soft hover:text-maroon">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-charcoal/50 p-4">
          <form onSubmit={handleSave} className="my-8 w-full max-w-md bg-ivory p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">{editingId ? 'Edit Banner' : 'Add Banner'}</h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-xs text-charcoal-soft">Image</label>
                <SingleImageUploader value={form.image} onChange={(img) => setForm((f) => ({ ...f, image: img }))} folder="gayatri-jewellers/banners" />
              </div>
              <div>
                <label htmlFor="banner-title" className="mb-1 block text-xs text-charcoal-soft">Title (optional)</label>
                <input id="banner-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label htmlFor="banner-subtitle" className="mb-1 block text-xs text-charcoal-soft">Subtitle (optional)</label>
                <input id="banner-subtitle" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label htmlFor="banner-link" className="mb-1 block text-xs text-charcoal-soft">Link (e.g. /shop or a full URL)</label>
                <input id="banner-link" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} className="input-field" placeholder="/shop?category=..." />
              </div>
              <div>
                <label htmlFor="banner-button-text" className="mb-1 block text-xs text-charcoal-soft">Button Text</label>
                <input id="banner-button-text" value={form.buttonText} onChange={(e) => setForm((f) => ({ ...f, buttonText: e.target.value }))} className="input-field" />
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
        title="Delete this banner?"
        description="It will be removed from the Home page immediately."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default AdminBanners;
