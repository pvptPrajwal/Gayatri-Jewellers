import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/catalogService';
import { SingleImageUploader } from '../../components/admin/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const emptyForm = { name: '', description: '', image: null, isActive: true };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    fetchCategories({ all: 'true' })
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description, image: cat.image, isActive: cat.isActive });
    setEditingId(cat._id);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
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
      await deleteCategory(toDelete._id);
      toast.success('Category deleted');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Categories</h1>
        <button type="button" onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat._id} className="border border-sand-dark bg-ivory p-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden bg-sand">
                  {cat.image?.url && <img src={cat.image.url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{cat.name}</p>
                  <p className="text-xs text-charcoal-soft">{cat.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <button type="button" onClick={() => openEdit(cat)} aria-label={`Edit ${cat.name}`} className="text-charcoal-soft hover:text-gold-deep">
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => setToDelete(cat)} aria-label={`Delete ${cat.name}`} className="text-charcoal-soft hover:text-maroon">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <form onSubmit={handleSave} className="w-full max-w-md bg-ivory p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">{editingId ? 'Edit Category' : 'Add Category'}</h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="category-name" className="mb-1 block text-xs text-charcoal-soft">Name</label>
                <input
                  id="category-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="category-description" className="mb-1 block text-xs text-charcoal-soft">Description</label>
                <textarea
                  id="category-description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-charcoal-soft">Image</label>
                <SingleImageUploader
                  value={form.image}
                  onChange={(img) => setForm((f) => ({ ...f, image: img }))}
                  folder="gayatri-jewellers/categories"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="accent-gold"
                />
                Active (visible on storefront)
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="btn-outline flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this category?"
        description={toDelete ? `"${toDelete.name}" will be removed. Products already assigned to it will keep the reference.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default AdminCategories;
