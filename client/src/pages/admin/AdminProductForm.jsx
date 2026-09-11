import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { fetchProductById, createProduct, updateProduct } from '../../services/productService';
import { fetchCategories, fetchCollections } from '../../services/catalogService';
import { SingleImageUploader, MultiImageUploader } from '../../components/admin/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const METALS = ['Gold', 'Silver', 'Platinum', 'Diamond', 'Rose Gold', 'White Gold'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];

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
  basePrice: yup.number().typeError('Enter a number').positive().required('Base price is required'),
  makingCharges: yup.number().typeError('Enter a number').min(0).default(0),
  discount: yup.number().typeError('Enter a number').min(0).max(100).default(0),
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
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [flags, setFlags] = useState({ isNewArrival: false, isBestSeller: false, isFeatured: false });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    Promise.all([fetchCategories({ all: 'true' }), fetchCollections({ all: 'true' })]).then(([cats, cols]) => {
      setCategories(cats);
      setCollections(cols);
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
          basePrice: p.basePrice,
          makingCharges: p.makingCharges,
          discount: p.discount,
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

  const onSubmit = async (formData) => {
    if (!mainImage) {
      toast.error('Please upload a main product image');
      return;
    }
    setSaving(true);
    const payload = {
      ...formData,
      diamondWeight: formData.diamondWeight || 0,
      makingCharges: formData.makingCharges || 0,
      discount: formData.discount || 0,
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
          <Field label="Base Price (₹)" error={errors.basePrice}>
            <input type="number" {...register('basePrice')} className="input-field" />
          </Field>
          <Field label="Making Charges (₹)" error={errors.makingCharges}>
            <input type="number" {...register('makingCharges')} className="input-field" />
          </Field>
          <Field label="Discount (%)" error={errors.discount}>
            <input type="number" {...register('discount')} className="input-field" />
          </Field>
          <p className="col-span-2 text-xs text-charcoal-soft">
            Final price is calculated automatically on save: (base + making) − discount%.
          </p>
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
