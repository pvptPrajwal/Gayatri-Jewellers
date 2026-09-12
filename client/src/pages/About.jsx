import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gem, ShieldCheck, Users, Award } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import Seo from '../components/common/Seo';
import { fetchSiteSettings } from '../services/siteSettingsService';
import { optimizedImage } from '../utils/cloudinary';

const About = () => {
  // Admin-editable images — fall back to placeholders until an admin
  // uploads real photos from /admin/site-images.
  const [heroImage, setHeroImage] = useState(null);
  const [workshopImage, setWorkshopImage] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings()
      .then((settings) => {
        if (!mounted) return;
        if (settings?.aboutHeroImage?.url) setHeroImage(settings.aboutHeroImage.url);
        if (settings?.aboutWorkshopImage?.url) setWorkshopImage(settings.aboutWorkshopImage.url);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Seo
        title="About Us"
        description="The story behind Gayatri Jewellers — craftsmanship, quality and trust in every piece."
        path="/about"
      />
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
        <img
          src={optimizedImage(heroImage, 1600) || "https://picsum.photos/seed/gayatri-about-hero/1600/800"}
          alt="Gayatri Jewellers craftsmanship"
          className="h-full w-full object-cover"
          fetchpriority="high"
        />
        <div className="absolute inset-0 flex items-end bg-charcoal/40">
          <div className="container-page pb-10 text-ivory">
            <p className="section-label text-gold-light">OUR STORY</p>
            <h1 className="mt-2 font-display text-5xl">Crafted with Care</h1>
          </div>
        </div>
      </div>

      <div className="container-page py-6">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />
      </div>

      <section className="container-page grid grid-cols-1 gap-10 py-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">How We Started</h2>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
            Gayatri Jewellers is a trusted name in Chhatrapati Sambhajinagar for handcrafted gold and
            diamond jewellery, built on honest pricing and uncompromising purity.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
            Every piece that leaves our workshop is checked for quality and finish, so what you take
            home is something worth keeping for years to come.
          </p>
          <p className="mt-4 text-xs italic text-charcoal-soft/70">
            [Placeholder copy — replace with your shop's real founding story, year, and journey.]
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden bg-sand">
          <img
            src={optimizedImage(workshopImage, 800) || "https://picsum.photos/seed/gayatri-workshop/800/600"}
            alt="Gayatri Jewellers workshop"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="container-page grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Trust', desc: 'Transparent pricing, no hidden making charges.' },
            { icon: Gem, title: 'Quality', desc: 'Every stone and setting checked before it ships.' },
            { icon: Users, title: 'Transparency', desc: 'Purity and pricing explained, never assumed.' },
            { icon: Award, title: 'Satisfaction', desc: 'Lifetime exchange and dedicated after-care.' },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <v.icon size={26} strokeWidth={1.2} className="mx-auto text-gold" />
              <h3 className="mt-3 font-display text-xl">{v.title}</h3>
              <p className="mt-2 text-sm text-charcoal-soft">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center font-display text-3xl">Our Craftsmanship</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {['Design', 'Making', 'Quality Check', 'Final Polish'].map((step, idx) => (
            <div key={step} className="border-t-2 border-gold pt-4">
              <p className="text-xs text-charcoal-soft">Step {idx + 1}</p>
              <h3 className="mt-1 font-display text-xl">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-charcoal py-16 text-center text-ivory">
        <h2 className="font-display text-3xl">Come See the Showroom</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ivory/70">
          Visit us in Chhatrapati Sambhajinagar to meet the team and see pieces in person.
        </p>
        <Link to="/contact" className="btn-gold mt-6 inline-flex">
          Visit Our Store
        </Link>
      </section>
    </div>
  );
};

export default About;
