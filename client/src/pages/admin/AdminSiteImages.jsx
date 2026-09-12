import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchSiteSettings, updateSiteSettings } from '../../services/siteSettingsService';
import { SingleImageUploader } from '../../components/admin/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSiteImages = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImage, setHeroImage] = useState(null);
  const [storeImage, setStoreImage] = useState(null);
  const [aboutHeroImage, setAboutHeroImage] = useState(null);
  const [aboutWorkshopImage, setAboutWorkshopImage] = useState(null);

  useEffect(() => {
    fetchSiteSettings()
      .then((settings) => {
        setHeroImage(settings.heroImage?.url ? settings.heroImage : null);
        setStoreImage(settings.storeImage?.url ? settings.storeImage : null);
        setAboutHeroImage(settings.aboutHeroImage?.url ? settings.aboutHeroImage : null);
        setAboutWorkshopImage(settings.aboutWorkshopImage?.url ? settings.aboutWorkshopImage : null);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings({
        heroImage,
        storeImage,
        aboutHeroImage,
        aboutWorkshopImage,
      });
      toast.success('Site images updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-3xl">Site Images</h1>
      <p className="mt-2 text-xs text-charcoal-soft">
        Update every image on the Home page and About Us page.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-10">
        <div>
          <p className="section-label">Home Page</p>
        </div>

        <div>
          <h3 className="font-display text-lg">Hero Banner</h3>
          <p className="mt-1 text-xs text-charcoal-soft">
            Shown on the right side of the Home page hero section. Recommended: portrait image, at least 900×1100px.
          </p>
          <div className="mt-3">
            <SingleImageUploader value={heroImage} onChange={setHeroImage} folder="gayatri-jewellers/site" />
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg">"Visit Our Store" Photo</h3>
          <p className="mt-1 text-xs text-charcoal-soft">
            Shown in the showroom section near the bottom of the Home page. Recommended: landscape image, at least 800×600px.
          </p>
          <div className="mt-3">
            <SingleImageUploader value={storeImage} onChange={setStoreImage} folder="gayatri-jewellers/site" />
          </div>
        </div>

        <div className="border-t border-sand-dark pt-8">
          <p className="section-label">About Us Page</p>
        </div>

        <div>
          <h3 className="font-display text-lg">Page Banner</h3>
          <p className="mt-1 text-xs text-charcoal-soft">
            The wide banner at the top of the About Us page. Recommended: landscape image, at least 1600×800px.
          </p>
          <div className="mt-3">
            <SingleImageUploader value={aboutHeroImage} onChange={setAboutHeroImage} folder="gayatri-jewellers/site" />
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg">"How We Started" Photo</h3>
          <p className="mt-1 text-xs text-charcoal-soft">
            Shown next to the founding story on the About Us page. Recommended: 4:3 image, at least 800×600px.
          </p>
          <div className="mt-3">
            <SingleImageUploader value={aboutWorkshopImage} onChange={setAboutWorkshopImage} folder="gayatri-jewellers/site" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminSiteImages;
