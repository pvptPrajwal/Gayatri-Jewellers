import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { fetchSiteSettings } from '../../services/siteSettingsService';

const Footer = () => {
  // Admin-editable footer logo — falls back to the bundled default until
  // (or unless) an admin uploads one from /admin/site-images.
  const [footerLogo, setFooterLogo] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings()
      .then((settings) => {
        if (mounted && settings?.footerLogo?.url) setFooterLogo(settings.footerLogo.url);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
  <footer className="mt-24 border-t border-sand-dark/70 bg-charcoal text-ivory">
    <div className="container-page grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div className="flex items-center gap-2">
          <img src={footerLogo || '/logo.png'} alt="Gayatri Jewellers" className="h-10 w-10" />
          <h3 className="font-display text-2xl">
            Gayatri <span className="text-gold-light">Jewellers</span>
          </h3>
        </div>
        <p className="mt-3 text-sm text-ivory/70">
          Handcrafted gold, diamond and bridal jewellery — certified purity, timeless design.
        </p>
        <div className="mt-4 flex gap-4">
          <a
            href="https://www.instagram.com/gayatri.jewellers/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-ivory/70 hover:text-gold-light"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>

      <div>
        <h4 className="section-label text-gold-light">EXPLORE</h4>
        <ul className="mt-4 space-y-2 text-sm text-ivory/80">
          <li><Link to="/shop" className="hover:text-gold-light">Shop All</Link></li>
          <li><Link to="/collections" className="hover:text-gold-light">Collections</Link></li>
          <li><Link to="/new-arrivals" className="hover:text-gold-light">New Arrivals</Link></li>
          <li><Link to="/offers" className="hover:text-gold-light">Offers</Link></li>
          <li><Link to="/gold-rate" className="hover:text-gold-light">Today's Gold Rate</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="section-label text-gold-light">SUPPORT</h4>
        <ul className="mt-4 space-y-2 text-sm text-ivory/80">
          <li><Link to="/faq" className="hover:text-gold-light">FAQ</Link></li>
          <li><Link to="/contact" className="hover:text-gold-light">Contact Us</Link></li>
          <li><Link to="/account/orders" className="hover:text-gold-light">Track Order</Link></li>
          <li><Link to="/about" className="hover:text-gold-light">About Us</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="section-label text-gold-light">VISIT OUR STORE</h4>
        <ul className="mt-4 space-y-3 text-sm text-ivory/80">
          <li className="flex gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gold-light" />
            <span>
              Pundlik Nagar Rd, near Shivaji Maharaj Statue, Nyay Nagar, Chhatrapati Sambhajinagar,
              Maharashtra 431009
            </span>
          </li>
          <li className="flex gap-2">
            <Phone size={16} className="mt-0.5 shrink-0 text-gold-light" />
            <a href="tel:+918182839950" className="hover:text-gold-light">+91 81828 39950</a>
          </li>
          <li className="flex gap-2">
            <Mail size={16} className="mt-0.5 shrink-0 text-gold-light" />
            <a href="mailto:gayatrijewellersofficial@gmail.com" className="hover:text-gold-light break-all">
              gayatrijewellersofficial@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-ivory/10 py-5">
      <p className="container-page text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} Gayatri Jewellers. All rights reserved.
      </p>
    </div>
  </footer>
  );
};

export default Footer;
