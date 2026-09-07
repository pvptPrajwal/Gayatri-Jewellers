const ConfirmDialog = ({ open, title, description, confirmLabel = 'Confirm', onConfirm, onCancel, danger = true }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
      <div className="w-full max-w-sm bg-ivory p-6">
        <h3 className="font-display text-xl">{title}</h3>
        {description && <p className="mt-2 text-sm text-charcoal-soft">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-3 text-sm text-ivory ${danger ? 'bg-maroon hover:bg-maroon/90' : 'bg-charcoal hover:bg-gold-deep'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
