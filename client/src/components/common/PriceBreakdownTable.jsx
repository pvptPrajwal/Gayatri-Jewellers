import { formatINR } from '../../utils/formatCurrency';
import { optimizedImage } from '../../utils/cloudinary';

// breakdown (from computeFinalPrice on the server, or mirrored client-side):
//   { ratePerGram, rateAmount, marginAmount, effectiveMargin, discountAmount,
//     gstAmount, grandTotal, finalPrice }
// product: needs metal, purity, mainImage, netWeight, marginType, marginValue,
//   gstPercent, discountType, discountValue, discountAppliesTo
const PriceBreakdownTable = ({ product, breakdown }) => {
  if (!product || !breakdown) return null;

  const onMargin = product.discountAppliesTo === 'MARGIN';
  const hasDiscount = breakdown.discountAmount > 0;
  const marginLabel = product.marginType === 'FLAT' ? 'Making Charges' : `Making Charges (${product.marginValue}%)`;
  const discountLabel =
    product.discountType === 'FLAT' ? `₹${product.discountValue}` : `${product.discountValue}%`;
  // Sub Total reflects the margin AFTER a margin-stage discount (if any) —
  // GST is calculated on this, matching the server's formula exactly.
  const subTotal = breakdown.rateAmount + (onMargin ? breakdown.effectiveMargin : breakdown.marginAmount);

  const DiscountRow = () => (
    <tr>
      <td className="px-4 py-4 text-charcoal-soft">Discount {onMargin ? '(on Making Charges)' : '(on Final Amount)'}</td>
      <td className="px-4 py-4 text-charcoal-soft">-</td>
      <td className="px-4 py-4 text-charcoal-soft">-</td>
      <td className="px-4 py-4 text-maroon">{discountLabel}</td>
      <td className="px-4 py-4 text-right text-maroon">−{formatINR(breakdown.discountAmount)}</td>
    </tr>
  );

  return (
    <div className="overflow-x-auto border border-sand-dark">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-sand-dark bg-sand/40 text-[10px] tracking-wide text-charcoal-soft">
            <th className="px-4 py-3 font-normal">PRODUCT DETAILS</th>
            <th className="px-4 py-3 font-normal">RATE</th>
            <th className="px-4 py-3 font-normal">WEIGHT</th>
            <th className="px-4 py-3 font-normal">DISCOUNT</th>
            <th className="px-4 py-3 text-right font-normal">VALUE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-dark/60">
          <tr>
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                {product.mainImage?.url && (
                  <img
                    src={optimizedImage(product.mainImage.url, 60)}
                    alt={product.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-charcoal">{product.metal}</p>
                  <p className="text-xs text-charcoal-soft">{product.purity}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-4">
              {breakdown.ratePerGram ? `${formatINR(breakdown.ratePerGram)}/g` : '—'}
            </td>
            <td className="px-4 py-4">{product.netWeight}g</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-right">{formatINR(breakdown.rateAmount)}</td>
          </tr>

          <tr>
            <td className="px-4 py-4 text-charcoal-soft">{marginLabel}</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-right">{formatINR(breakdown.marginAmount)}</td>
          </tr>

          {/* Margin-stage discount: reduces Making Charges before GST is calculated */}
          {hasDiscount && onMargin && <DiscountRow />}

          <tr>
            <td className="px-4 py-4 text-charcoal-soft">Sub Total</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-charcoal-soft">{product.netWeight}g Net Wt.</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-right">{formatINR(subTotal)}</td>
          </tr>

          <tr>
            <td className="px-4 py-4 text-charcoal-soft">GST{product.gstPercent ? ` (${product.gstPercent}%)` : ''}</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-charcoal-soft">-</td>
            <td className="px-4 py-4 text-right">{formatINR(breakdown.gstAmount)}</td>
          </tr>

          {/* Final-amount discount: taken off the grand total after GST */}
          {hasDiscount && !onMargin && <DiscountRow />}

          <tr className="bg-sand/40">
            <td className="px-4 py-4 font-display text-lg text-charcoal" colSpan={4}>
              Grand Total
            </td>
            <td className="px-4 py-4 text-right font-display text-lg text-charcoal">
              {formatINR(breakdown.finalPrice)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PriceBreakdownTable;
