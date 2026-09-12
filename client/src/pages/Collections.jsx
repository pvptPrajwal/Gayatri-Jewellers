import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollections } from '../services/catalogService';
import SkeletonGrid from '../components/common/SkeletonLoader';
import Breadcrumb from '../components/common/Breadcrumb';
import Seo from '../components/common/Seo';
import { optimizedImage } from '../utils/cloudinary';

const imgSeed = (name) => `https://picsum.photos/seed/col-${encodeURIComponent(name)}/700/500`;

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections()
      .then(setCollections)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10">
      <Seo
        title="Collections"
        description="Explore curated jewellery collections from Gayatri Jewellers — Gold, Diamond, Bridal, Daily Wear and more."
        path="/collections"
      />
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />
      <h1 className="mt-4 font-display text-4xl">Our Collections</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal-soft">
        Curated edits, from festive Kundan to minimal daily wear — each collection handpicked by our design team.
      </p>

      <div className="mt-10">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((col) => (
              <Link key={col._id} to={`/shop?collection=${col._id}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-sand">
                  <img
                    src={optimizedImage(col.image?.url, 500) || imgSeed(col.name)}
                    alt={col.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-display text-xl">{col.name}</h3>
                <p className="mt-1 text-sm text-charcoal-soft">{col.description}</p>
                <span className="mt-2 inline-block text-xs tracking-wide text-gold-deep">Explore Collection →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
