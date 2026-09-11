const WEAK_JWT_SECRETS = [
  'replace_this_with_a_long_random_secret_string',
  'secret',
  'changeme',
  '',
];

const KNOWN_DEMO_PASSWORDS = ['Admin@12345', 'Customer@12345'];

// Runs once at server startup. In development, missing/weak values only
// warn (so local setup keeps working with the .env.example defaults). In
// production, the same problems stop the server from starting at all —
// better to fail loudly at deploy time than silently ship an insecure API.
const validateEnv = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const errors = [];
  const warnings = [];

  const required = ['MONGO_URI', 'JWT_SECRET'];
  required.forEach((key) => {
    if (!process.env[key]) errors.push(`${key} is not set.`);
  });

  if (process.env.JWT_SECRET && WEAK_JWT_SECRETS.includes(process.env.JWT_SECRET)) {
    errors.push('JWT_SECRET is still set to a placeholder value from .env.example.');
  }
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    (isProd ? errors : warnings).push(
      'JWT_SECRET is shorter than 32 characters — use a longer random string.'
    );
  }

  if (isProd && !process.env.CLIENT_URL) {
    errors.push('CLIENT_URL is not set — required in production so CORS is not left wide open.');
  }
  if (isProd && !process.env.SITE_URL) {
    warnings.push('SITE_URL is not set — the sitemap will contain localhost URLs.');
  }

  const cloudinaryVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const cloudinaryConfigured = cloudinaryVars.every(
    (k) => process.env[k] && process.env[k] !== `your_${k.split('_').slice(1).join('_').toLowerCase()}`
  );
  if (!cloudinaryConfigured) {
    warnings.push('Cloudinary is not fully configured — image uploads will be disabled.');
  }

  if (isProd) {
    const adminPass = process.env.SEED_ADMIN_PASSWORD;
    const customerPass = process.env.SEED_CUSTOMER_PASSWORD;
    if (KNOWN_DEMO_PASSWORDS.includes(adminPass) || KNOWN_DEMO_PASSWORDS.includes(customerPass)) {
      warnings.push(
        'SEED_ADMIN_PASSWORD/SEED_CUSTOMER_PASSWORD still match the known demo values. ' +
          'If this database was seeded with them, log in and change the password before going live.'
      );
    }
  }

  warnings.forEach((msg) => console.warn(`[env warning] ${msg}`));

  if (errors.length > 0) {
    console.error('\nRefusing to start: environment configuration is invalid.\n');
    errors.forEach((msg) => console.error(`  - ${msg}`));
    console.error('\nFix these in your .env file and restart.\n');
    process.exit(1);
  }
};

module.exports = validateEnv;
