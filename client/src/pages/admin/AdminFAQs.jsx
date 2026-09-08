import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../services/miscService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const CATEGORIES = ['General', 'Jewellery', 'Orders', 'Shipping', 'Returns & Exchange', 'Payment', 'Custom Jewellery'];
const emptyForm = { question: '', answer: '', category: 'General', isActive: true };

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    fetchFAQs({ all: 'true' })
      .then(setFaqs)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, isActive: faq.isActive });
    setEditingId(faq._id);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateFAQ(editingId, form);
        toast.success('FAQ updated');
      } else {
        await createFAQ(form);
        toast.success('FAQ created');
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
      await deleteFAQ(toDelete._id);
      toast.success('FAQ deleted');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">FAQs</h1>
        <button type="button" onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 divide-y divide-sand-dark/60 border-y border-sand-dark/60">
          {faqs.map((faq) => (
            <div key={faq._id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{faq.question}</p>
                <p className="text-xs text-charcoal-soft">{faq.category} · {faq.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button type="button" onClick={() => openEdit(faq)} className="text-charcoal-soft hover:text-gold-deep">
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => setToDelete(faq)} className="text-charcoal-soft hover:text-maroon">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <form onSubmit={handleSave} className="w-full max-w-lg bg-ivory p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Question</label>
                <input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Answer</label>
                <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} rows={3} className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-field">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
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
        title="Delete this FAQ?"
        description={toDelete ? `"${toDelete.question}" will be removed.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default AdminFAQs;
