import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton = ({ phone = '918182839950' }) => (
  <a
    href={`https://wa.me/${phone}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-pine text-ivory shadow-lg transition-transform hover:scale-105"
  >
    <MessageCircle size={22} />
  </a>
);

export const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-ivory shadow-lg transition-transform hover:scale-105"
    >
      <ArrowUp size={18} />
    </button>
  );
};
