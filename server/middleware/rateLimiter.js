const rateLimit = require('express-rate-limit');

/**
 * Limiter for public forms that don't require login (enquiry/contact form,
 * newsletter signup, etc). These are the easiest targets for bots since
 * anyone can hit them without an account — keep the limit tight.
 *
 * Override via env vars if a specific route needs a different threshold:
 *   FORM_RATE_LIMIT_WINDOW_MIN, FORM_RATE_LIMIT_MAX
 */
const publicFormLimiter = rateLimit({
  windowMs: (Number(process.env.FORM_RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000,
  max: Number(process.env.FORM_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions from this device. Please try again later.',
  },
});

module.exports = { publicFormLimiter };
