// Maps a product's rateType to the matching field on a GoldRate document.
const RATE_FIELD_MAP = {
  '24K': 'rate24k',
  '22K': 'rate22k',
  '18K': 'rate18k',
  SILVER: 'silverRate',
};

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Final Product Price, computed one of two ways depending on
 * `discountAppliesTo`:
 *
 * discountAppliesTo = 'MARGIN' (discount on Making Charges):
 *   effectiveMargin = Margin − Discount
 *   Final Price = Rate + effectiveMargin + GST
 *   (GST is calculated AFTER the discount reduces the margin — the
 *   discount changes what GST is charged on.)
 *
 * discountAppliesTo = 'FINAL_AMOUNT' (discount on final price, default):
 *   Grand Total = Rate + Margin + GST
 *   Final Price = Grand Total − Discount
 *   (GST is calculated on the full Rate + Margin first; the discount is
 *   taken off the total afterwards and does not affect the GST amount.)
 *
 * In both cases:
 * - Rate: if the product is linked to a live gold/silver rate (rateType is
 *   not 'NONE'), Rate = (per-gram rate for that purity) × grossWeight.
 *   Otherwise Rate = the product's manually entered `basePrice`.
 * - Margin: stored exactly as the admin entered it — percentage of Rate,
 *   or a flat ₹ amount. Never auto-converted between the two.
 * - Discount: stored exactly as entered — percentage (of Margin or of the
 *   final total, depending on discountAppliesTo), or a flat ₹ amount.
 *   Never auto-converted between the two.
 *
 * `goldRate` is the current GoldRate document (or null if none exists yet /
 * not needed because rateType is 'NONE') — pass it in rather than querying
 * here so callers can reuse one fetched rate across many products.
 */
const computeFinalPrice = (product, goldRate) => {
  const {
    rateType,
    grossWeight,
    basePrice,
    marginType,
    marginValue,
    gstPercent,
    discountType,
    discountValue,
    discountAppliesTo,
  } = product;

  let rateAmount;
  if (rateType && rateType !== 'NONE') {
    const perGram = goldRate ? goldRate[RATE_FIELD_MAP[rateType]] || 0 : 0;
    rateAmount = perGram * (grossWeight || 0);
  } else {
    rateAmount = basePrice || 0;
  }

  const marginAmount =
    marginType === 'FLAT' ? marginValue || 0 : rateAmount * ((marginValue || 0) / 100);

  if (discountAppliesTo === 'MARGIN') {
    const discountAmount =
      discountType === 'FLAT' ? discountValue || 0 : marginAmount * ((discountValue || 0) / 100);
    const effectiveMargin = Math.max(0, marginAmount - discountAmount);
    const subtotal = rateAmount + effectiveMargin;
    const gstAmount = subtotal * ((gstPercent || 0) / 100);
    const finalPrice = subtotal + gstAmount;

    return {
      rateAmount: round2(rateAmount),
      marginAmount: round2(marginAmount),
      discountAmount: round2(discountAmount),
      effectiveMargin: round2(effectiveMargin),
      gstAmount: round2(gstAmount),
      grandTotal: round2(finalPrice), // no separate pre-discount grand total in this mode
      finalPrice: round2(finalPrice),
    };
  }

  // discountAppliesTo === 'FINAL_AMOUNT' (default)
  const subtotal = rateAmount + marginAmount;
  const gstAmount = subtotal * ((gstPercent || 0) / 100);
  const grandTotal = subtotal + gstAmount; // before discount

  const discountAmount =
    discountType === 'FLAT' ? discountValue || 0 : grandTotal * ((discountValue || 0) / 100);

  const finalPrice = Math.max(0, grandTotal - discountAmount);

  return {
    rateAmount: round2(rateAmount),
    marginAmount: round2(marginAmount),
    effectiveMargin: round2(marginAmount),
    gstAmount: round2(gstAmount),
    grandTotal: round2(grandTotal),
    discountAmount: round2(discountAmount),
    finalPrice: round2(finalPrice),
  };
};

module.exports = { computeFinalPrice, RATE_FIELD_MAP };
