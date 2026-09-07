const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
    {Icon && <Icon size={40} strokeWidth={1.2} className="text-gold" />}
    <h3 className="font-display text-2xl text-charcoal">{title}</h3>
    {description && <p className="max-w-sm text-sm text-charcoal-soft">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
