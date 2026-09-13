import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { fetchProductById, createProduct, updateProduct } from '../../services/productService';
import { fetchCategories, fetchCollections } from '../../services/catalogService';
import { fetchGoldRates } from '../../services/miscService';
import { SingleImageUploader, MultiImageUploader } from '../../components/admin/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatINR } from '../../utils/formatCurrency';

const METALS = ['Gold', 'Silver', 'Platinum', 'Diamond', 'Rose Gold', 'White Gold'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];
const RATE_TYPES = [
  { value: 'NONE', label: 'Manual Price (no live rate)' },
  { value: '24K', label: '24K Gold Rate' },
  { value: '22K', label: '22K Gold Rate' },
  { value: '18K', label: '18K Gold Rate' },
  { value: 'SILVER', label: 'Silver Rate' },
];
const RATE_FIELD_MAP = { '24K': 'rate24k', '22K': 'rate22k', '18K': 'rate18k', SILVER: 'silverRate' };

const schema = yup.object({
  name: yup.string().required('Product name is required'),
  sku: yup.string().required('SKU is required'),
  description: yup.string().required('Description is required'),
  shortDescription: yup.string(),
  category: yup.string().required('Category is required'),
  collection: yup.string(),
  metal: yup.string().required('Metal is required'),
  purity: yup.string().required('Purity is required'),
  grossWeight: yup.number().typeError('Enter a number').positive().required('Gross weight is required'),
  netWeight: yup.number().typeError('Enter a number').positive().required('Net weight is required'),
  diamondWeight: yup.number().typeError('Enter a number').min(0).default(0),
  stoneType: yup.string(),
  size: yup.string(),
  rateType: yup.string().oneOf(['NONE', '24K', '22K', '18K', 'SILVER']).required(),
  basePrice: yup.number().typeError('Enter a number').min(0).when('rateType', {
    is: 'NONE',
    then: (s) => s.positive('Enter the manual rate for this product').required('Rate is required when not linked to a live gold/silver rate'),
    otherwise: (s) => s.notRequired(),
  }),
  marginType: yup.string().oneOf(['PERCENTAGE', 'FLAT']).required(),
  marginValue: yup.number().typeError('Enter a number').min(0).required('Margin is required (enter 0 if none)'),
  gstPercent: yup.number().typeError('Enter a number').min(0).max(100).required('GST % is required (enter 0 if exempt)'),
  discountAppliesTo: yup.string().oneOf(['MARGIN', 'FINAL_AMOUNT']).required(),
  discountType: yup.string().oneOf(['PERCENTAGE', 'FLAT']).required(),
  discountValue: yup.number().typeError('Enter a number').min(0).required('Discount is required (enter 0 if none)'),
  stockQuantity: yup.number().typeError('Enter a number').min(0).required('Stock quantity is required'),
  gender: yup.string().required(),
  tags: yup.string(),
  occasion: yup.string(),
});

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [goldRate, setGoldRate] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [flags, setFlags] = useState({ isNewArrival: false, isBestSeller: false, isFeatured: false });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { rateType: 'NONE', marginType: 'PERCENTAGE', marginValue: 0, gstPercent: 3, discountAppliesTo: 'FINAL_AMOUNT', discountType: 'PERCENTAGE', discountValue: 0 },
  });

  const rateType = watch('rateType');
  const basePrice = watch('basePrice');
  const marginType = watch('marginType');
  const marginValue = watch('marginValue');
  const gstPercent = watch('gstPercent');
  const discountAppliesTo = watch('discountAppliesTo');
  const discountType = watch('discountType');
  const discountValue = watch('discountValue');
  const grossWeight = watch('grossWeight');

  useEffect(() => {
    Promise.all([
      fetchCategories({ all: 'true' }),
      fetchCollections({ all: 'true' }),
      fetchGoldRates(1).catch(() => null),
    ]).then(([cats, cols, rates]) => {
      setCategories(cats);
      setCollections(cols);
      if (rates?.current) setGoldRate(rates.current);
    });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    fetchProductById(id)
      .then((p) => {
        reset({
          name: p.name,
          sku: p.sku,
          description: p.description,
          shortDescription: p.shortDescription,
          category: p.category?._id || p.category,
          collection: p.collection?._id || p.collection || '',
          metal: p.metal,
          purity: p.purity,
          grossWeight: p.grossWeight,
          netWeight: p.netWeight,
          diamondWeight: p.diamondWeight,
          stoneType: p.stoneType,
          size: p.size,
          rateType: p.rateType || 'NONE',
          basePrice: p.basePrice || 0,
          marginType: p.marginType || 'PERCENTAGE',
          marginValue: p.marginValue || 0,
          gstPercent: p.gstPercent ?? 3,
          discountAppliesTo: p.discountAppliesTo || 'FINAL_AMOUNT',
          discountType: p.discountType || 'PERCENTAGE',
          discountValue: p.discountValue || 0,
          stockQuantity: p.stockQuantity,
          gender: p.gender,
          tags: (p.tags || []).join(', '),
          occasion: (p.occasion || []).join(', '),
        });
        setMainImage(p.mainImage);
        setImages(p.images || []);
        setFlags({ isNewArrival: p.isNewArrival, isBestSeller: p.isBestSeller, isFeatured: p.isFeatured });
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  // Live price preview — mirrors the backend's pricing formula exactly
  // (including which of the two discount modes is selected), so the admin
  // sees the real final price before saving.
  const pricePreview = useMemo(() => {
    let rateAmount = 0;
    let ratePerGram = null;
    if (rateType && rateType !== 'NONE') {
      ratePerGram = goldRate ? goldRate[RATE_FIELD_MAP[rateType]] : null;
      rateAmount = (ratePerGram || 0) * (Number(grossWeight) || 0);
    } else {
      rateAmount = Number(basePrice) || 0;
    }
    const marginAmount =
      marginType === 'FLAT' ? Number(marginValue) || 0 : rateAmount * ((Number(marginValue) || 0) / 100);

    if (discountAppliesTo === 'MARGIN') {
      const discountAmount =
        discountType === 'FLAT' ? Number(discountValue) || 0 : marginAmount * ((Number(discountValue) || 0) / 100);
      const effectiveMargin = Math.max(0, marginAmount - discountAmount);
      const subtotal = rateAmount + effectiveMargin;
      const gstAmount = subtotal * ((Number(gstPercent) || 0) / 100);
      const finalPrice = subtotal + gstAmount;
      return { ratePerGram, rateAmount, marginAmount, discountAmount, effectiveMargin, gstAmount, grandTotal: finalPrice, finalPrice };
    }

    const subtotal = rateAmount + marginAmount;
    const gstAmount = subtotal * ((Number(gstPercent) || 0) / 100);
    const grandTotal = subtotal + gstAmount;
    const discountAmount =
      discountType === 'FLAT' ? Number(discountValue) || 0 : grandTotal * ((Number(discountValue) || 0) / 100);
    const finalPrice = Math.max(0, grandTotal - discountAmount);
    return { ratePerGram, rateAmount, marginAmount, effectiveMargin: marginAmount, gstAmount, grandTotal, discountAmount, finalPrice };
  }, [rateType, goldRate, grossWeight, basePrice, marginType, marginValue, gstPercent, discountAppliesTo, discountType, discountValue]);

  const onSubmit = async (formData) => {
    if (!mainImage) {
      toast.error('Please upload a main product image');
      return;
    }
    setSaving(true);
    const payload = {
      ...formData,
      diamondWeight: formData.diamondWeight || 0,
      basePrice: formData.rateType === 'NONE' ? formData.basePrice : 0,
      collection: formData.collection || undefined,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      occasion: formData.occasion ? formData.occasion.split(',').map((t) => t.trim()).filter(Boolean) : [],
      mainImage,
      images,
      ...flags,
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading product…" />;

  return (
    <div>
      <Link to="/admin/products" className="flex items-center gap-2 text-sm text-charcoal-soft hover:text-gold-deep">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      <h1 className="mt-3 font-display text-3xl">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-3xl space-y-8">
        {/* Basic info */}
        <FormSection title="Basic Information">
          <Field label="Product Name" error={errors.name}>
            <input {...register('name')} className="input-field" />
          </Field>
          <Field label="SKU / Product Code" error={errors.sku}>
            <input {...register('sku')} className="input-field" />
          </Field>
          <Field label="Short Description" error={errors.shortDescription}>
            <input {...register('shortDescription')} className="input-field" />
          </Field>
          <Field label="Full Description" error={errors.description} full>
            <textarea {...register('description')} rows={4} className="input-field" />
          </Field>
          <Field label="Tags (comma separated)" error={errors.tags}>
            <input {...register('tags')} className="input-field" placeholder="gold, bridal, statement" />
          </Field>
          <Field label="Occasion (comma separated)" error={errors.occasion}>
            <input {...register('occasion')} className="input-field" placeholder="Wedding, Festival" />
          </Field>
        </FormSection>

        {/* Category / Collection */}
        <FormSection title="Category & Collection">
          <Field label="Category" error={errors.category}>
            <select {...register('category')} className="input-field">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Collection">
            <select {...register('collection')} className="input-field">
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </Field>
        </FormSection>

        {/* Images */}
        <FormSection title="Product Images">
          <div className="col-span-2">
            <label className="mb-2 block text-xs text-charcoal-soft">Main Image</label>
            <SingleImageUploader value={mainImage} onChange={setMainImage} folder="gayatri-jewellers/products" />
          </div>
          <div className="col-span-2">
            <label className="mb-2 block text-xs text-charcoal-soft">Gallery Images</label>
            <MultiImageUploader values={images} onChange={setImages} folder="gayatri-jewellers/products" />
          </div>
        </FormSection>

        {/* Jewellery details */}
        <FormSection title="Jewellery Details">
          <Field label="Metal" error={errors.metal}>
            <select {...register('metal')} className="input-field">
              <option value="">Select metal</option>
              {METALS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Purity" error={errors.purity}>
            <input {...register('purity')} className="input-field" placeholder="22K / 18K / 925 Silver" />
          </Field>
          <Field label="Gross Weight (g)" error={errors.grossWeight}>
            <input type="number" step="0.01" {...register('grossWeight')} className="input-field" />
          </Field>
          <Field label="Net Weight (g)" error={errors.netWeight}>
            <input type="number" step="0.01" {...register('netWeight')} className="input-field" />
          </Field>
          <Field label="Diamond Weight (ct)" error={errors.diamondWeight}>
            <input type="number" step="0.01" {...register('diamondWeight')} className="input-field" />
          </Field>
          <Field label="Stone Type" error={errors.stoneType}>
            <input {...register('stoneType')} className="input-field" />
          </Field>
          <Field label="Size" error={errors.size}>
            <input {...register('size')} className="input-field" />
          </Field>
          <Field label="Gender" error={errors.gender}>
            <select {...register('gender')} className="input-field">
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
        </FormSection>

        {/* Pricing */}
        <FormSection title="Pricing">
          <Field label="Rate Type" error={errors.rateType} full>
            <select {...register('rateType')} className="input-field">
              {RATE_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </Field>

          {rateType === 'NONE' ? (
            <Field label="Rate — Manual Price (₹)" error={errors.basePrice} full>
              <input type="number" {...register('basePrice')} className="input-field" />
            </Field>
          ) : (
            <div className="sm:col-span-2 border border-sand-dark bg-sand/40 p-3 text-xs text-charcoal-soft">
              {goldRate ? (
                pricePreview.ratePerGram ? (
                  <>Current {rateType} rate: <strong>{formatINR(pricePreview.ratePerGram)}/g</strong> × {grossWeight || 0}g gross weight = <strong>{formatINR(pricePreview.rateAmount)}</strong></>
                ) : (
                  <>No {rateType} rate found in the current gold rate entry.</>
                )
              ) : (
                <>No gold rate has been published yet — publish one under Admin → Gold Rate first.</>
              )}
            </div>
          )}

          <Field label="Margin Type" error={errors.marginType}>
            <select {...register('marginType')} className="input-field">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FLAT">Flat Amount (₹)</option>
            </select>
          </Field>
          <Field label={marginType === 'FLAT' ? 'Margin (₹)' : 'Margin (%)'} error={errors.marginValue}>
            <input type="number" step="0.01" {...register('marginValue')} className="input-field" />
          </Field>

          <Field label="GST (%)" error={errors.gstPercent}>
            <input type="number" step="0.01" {...register('gstPercent')} className="input-field" />
          </Field>

          <Field label="Discount Applies To" error={errors.discountAppliesTo} full>
            <select {...register('discountAppliesTo')} className="input-field">
              <option value="FINAL_AMOUNT">Final Price (after Rate + Margin + GST)</option>
              <option value="MARGIN">Margin / Making Charges (before GST)</option>
            </select>
          </Field>

          <Field label="Discount Type" error={errors.discountType}>
            <select {...register('discountType')} className="input-field">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FLAT">Flat Amount (₹)</option>
            </select>
          </Field>
          <Field
            label={
              discountType === 'FLAT'
                ? 'Discount (₹)'
                : `Discount (% of ${discountAppliesTo === 'MARGIN' ? 'margin' : 'final price'})`
            }
            error={errors.discountValue}
          >
            <input type="number" step="0.01" {...register('discountValue')} className="input-field" />
          </Field>
          <p className="sm:col-span-2 text-xs text-charcoal-soft">
            {discountAppliesTo === 'MARGIN'
              ? 'Discount reduces the Margin (Making Charges) amount before GST is calculated — so GST is charged on the discounted margin.'
              : 'Discount is applied to the final amount — after Rate, Margin and GST are totalled. GST is unaffected by this discount.'}
          </p>

          <div className="sm:col-span-2 border border-gold/40 bg-gold/5 p-4">
            <p className="text-xs text-charcoal-soft">
              Rate {formatINR(pricePreview.rateAmount)}
              {discountAppliesTo === 'MARGIN' ? (
                <> + Margin {formatINR(pricePreview.effectiveMargin)} (after {formatINR(pricePreview.discountAmount)} discount)</>
              ) : (
                <> + Margin {formatINR(pricePreview.marginAmount)}</>
              )}
              {' '}+ GST {formatINR(pricePreview.gstAmount)}
              {discountAppliesTo === 'FINAL_AMOUNT' && pricePreview.discountAmount > 0 && (
                <> − Discount {formatINR(pricePreview.discountAmount)}</>
              )}
            </p>
            <p className="mt-1 font-display text-2xl text-charcoal">
              = {formatINR(pricePreview.finalPrice)}
            </p>
            <p className="mt-1 text-[11px] text-charcoal-soft">
              This is a live preview of the price customers will see (with the full breakdown table)
              on the product page. It matches exactly what the server calculates and saves.
            </p>
          </div>
        </FormSection>

        {/* Inventory */}
        <FormSection title="Inventory">
          <Field label="Stock Quantity" error={errors.stockQuantity}>
            <input type="number" {...register('stockQuantity')} className="input-field" />
          </Field>
          <p className="col-span-2 text-xs text-charcoal-soft">
            Stock status (In Stock / Low Stock / Out of Stock) updates automatically based on quantity.
          </p>
        </FormSection>

        {/* Flags */}
        <FormSection title="Visibility">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={flags.isNewArrival}
              onChange={(e) => setFlags((f) => ({ ...f, isNewArrival: e.target.checked }))}
              className="accent-gold"
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={flags.isBestSeller}
              onChange={(e) => setFlags((f) => ({ ...f, isBestSeller: e.target.checked }))}
              className="accent-gold"
            />
            Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={flags.isFeatured}
              onChange={(e) => setFlags((f) => ({ ...f, isFeatured: e.target.checked }))}
              className="accent-gold"
            />
            Featured
          </label>
        </FormSection>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Save Product'}
          </button>
          <Link to="/admin/products" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <div>
    <h2 className="mb-4 border-b border-sand-dark pb-2 font-display text-xl">{title}</h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  </div>
);

const slugifyId = (label) => `product-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const Field = ({ label, error, full, children }) => {
  const id = slugifyId(label);
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1 block text-xs text-charcoal-soft">{label}</label>
      {React.cloneElement(children, { id })}
      {error && <p className="mt-1 text-xs text-maroon">{error.message}</p>}
    </div>
  );
};

export default AdminProductForm;
