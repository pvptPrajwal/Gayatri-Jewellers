import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBanners } from '../../services/offerBannerService';
import { optimizedImage } from '../../utils/cloudinary';

const isExternal = (link) => /^https?:\/\//.test(link || '');

const PromoBanners = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchBanners().then(setBanners);
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[index];
  const content = (
    <>
      <img src={optimizedImage(banner.image?.url, 1600)} alt={banner.title || 'Promotional banner'} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex flex-col items-start justify-center gap-2 p-5 text-ivory sm:gap-3 sm:p-8 lg:p-12">
        {banner.title && <h2 className="max-w-md font-display text-2xl sm:text-3xl lg:text-4xl">{banner.title}</h2>}
        {banner.subtitle && <p className="max-w-xs text-xs text-ivory/80 sm:max-w-md sm:text-sm">{banner.subtitle}</p>}
        {banner.buttonText && (
          <span className="btn-gold mt-1 inline-flex text-xs sm:mt-2 sm:text-sm">{banner.buttonText}</span>
        )}
      </div>
    </>
  );

  return (
    <section className="container-page py-8">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/6] lg:aspect-[16/5]">
        {isExternal(banner.link) ? (
          <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
            {content}
          </a>
        ) : (
          <Link to={banner.link || '/shop'} className="block h-full w-full">
            {content}
          </Link>
        )}

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ivory/80 text-charcoal"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % banners.length)}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ivory/80 text-charcoal"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {banners.map((b, i) => (
                <button
                  key={b._id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  className={`h-1.5 w-6 ${i === index ? 'bg-gold' : 'bg-ivory/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PromoBanners;
