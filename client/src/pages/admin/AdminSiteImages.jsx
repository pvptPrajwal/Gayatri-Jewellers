import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchSiteSettings, updateSiteSettings } from '../../services/siteSettingsService';
import { SingleImageUploader } from '../../components/admin/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSiteImages = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImage, setHeroImage] = useState(null);
  const [footerLogo, setFooterLogo] = useState(null);

  useEffect(() => {
    fetchSiteSettings()
      .then((settings) => {
        setHeroImage(settings.heroImage?.url ? settings.heroImage : null);
        setFooterLogo(settings.footerLogo?.url ? settings.footerLogo : null);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings({ heroImage, footerLogo });
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
        Update the Home page hero banner and the Footer logo shown across the whole site.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-10">
        <div>
          <h3 className="font-display text-lg">Home Page — Hero Banner</h3>
          <p className="mt-1 text-xs text-charcoal-soft">
            Shown on the right side of the Home page hero section. Recommended: portrait image, at least 900×1100px.
          </p>
          <div className="mt-3">
            <SingleImageUploader value={heroImage} onChange={setHeroImage} folder="gayatri-jewellers/site" />
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg">Footer — Logo</h3>
          <p className="mt-1 text-xs text-charcoal-soft">
            Shown next to "Gayatri Jewellers" in the site footer. Recommended: square image, at least 200×200px.
          </p>
          <div className="mt-3">
            <SingleImageUploader value={footerLogo} onChange={setFooterLogo} folder="gayatri-jewellers/site" />
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
