// Maps a product's rateType to the matching field on a GoldRate document.
const RATE_FIELD_MAP = {
  '24K': 'rate24k',
  '22K': 'rate22k',
  '18K': 'rate18k',
  SILVER: 'silverRate',
};

/**
 * Final Product Price = Rate + Margin + GST
 *
 * - Rate: if the product is linked to a live gold/silver rate (rateType is
 *   not 'NONE'), Rate = (per-gram rate for that purity) × grossWeight.
 *   Otherwise Rate = the product's manually entered `basePrice`.
 * - Margin: stored exactly as the admin entered it — either a percentage
 *   of Rate, or a flat ₹ amount. Never auto-converted between the two.
 * - GST: a percentage applied on top of (Rate + Margin).
 *
 * `goldRate` is the current GoldRate document (or null if none exists yet /
 * not needed because rateType is 'NONE') — pass it in rather than querying
 * here so callers can reuse one fetched rate across many products.
 */
const computeFinalPrice = (product, goldRate) => {
  const { rateType, grossWeight, basePrice, marginType, marginValue, gstPercent } = product;

  let rateAmount;
  if (rateType && rateType !== 'NONE') {
    const perGram = goldRate ? goldRate[RATE_FIELD_MAP[rateType]] || 0 : 0;
    rateAmount = perGram * (grossWeight || 0);
  } else {
    rateAmount = basePrice || 0;
  }

  const marginAmount =
    marginType === 'FLAT' ? marginValue || 0 : rateAmount * ((marginValue || 0) / 100);

  const subtotal = rateAmount + marginAmount;
  const gstAmount = subtotal * ((gstPercent || 0) / 100);

  return {
    rateAmount: Math.round(rateAmount * 100) / 100,
    marginAmount: Math.round(marginAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    finalPrice: Math.round((subtotal + gstAmount) * 100) / 100,
  };
};

module.exports = { computeFinalPrice, RATE_FIELD_MAP };
