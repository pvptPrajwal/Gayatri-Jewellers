import { useId, useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage, uploadImages } from '../../services/uploadService';

// Single image uploader — for category/collection cover images or a product main image
export const SingleImageUploader = ({ value, onChange, folder }) => {
  // Each instance needs its own DOM id — a page like Site Images renders
  // several of these at once, and a shared hardcoded id meant every
  // "Upload image" label pointed at whichever input came first in the DOM.
  const inputId = useId();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const image = await uploadImage(file, folder);
      onChange(image);
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id={inputId} />
      {value?.url ? (
        <div className="relative h-40 w-40 overflow-hidden border border-sand-dark">
          <img src={value.url} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ivory/90"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-sand-dark text-charcoal-soft hover:border-gold"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-xs">{uploading ? 'Uploading…' : 'Upload image'}</span>
        </label>
      )}
    </div>
  );
};

// Multi-image uploader — for product gallery images
export const MultiImageUploader = ({ values = [], onChange, folder }) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const images = await uploadImages(files, folder);
      onChange([...values, ...images]);
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (idx) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {values.map((img, idx) => (
          <div key={img.publicId || idx} className="relative h-24 w-24 overflow-hidden border border-sand-dark">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-ivory/90"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" id={inputId} />
        <label
          htmlFor={inputId}
          className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-sand-dark text-charcoal-soft hover:border-gold"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-[10px]">{uploading ? 'Uploading…' : 'Add images'}</span>
        </label>
      </div>
    </div>
  );
};
