import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Gayatri Jewellers';
const DEFAULT_DESCRIPTION =
  'Gayatri Jewellers — handcrafted gold, diamond and bridal jewellery in Chhatrapati Sambhajinagar. Certified purity, timeless design.';
const DEFAULT_IMAGE = '/logo.png';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

// title: page-specific title (SITE_NAME is appended automatically)
// description: page-specific meta description
// path: route path starting with '/', used to build the canonical URL
// image: absolute or root-relative image URL for social sharing
// jsonLd: optional object (or array of objects) to render as JSON-LD <script> tag(s)
// noindex: set true for pages that shouldn't be indexed (e.g. account pages)
const Seo = ({ title, description = DEFAULT_DESCRIPTION, path = '', image = DEFAULT_IMAGE, jsonLd, noindex = false }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Fine Gold & Diamond Jewellery`;
  const url = `${SITE_URL}${path}`;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const jsonLdList = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {jsonLdList.map((item, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
