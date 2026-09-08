import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { submitEnquiry } from '../services/miscService';
import Breadcrumb from '../components/common/Breadcrumb';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number').required('Phone is required'),
  email: yup.string().email('Enter a valid email'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
});

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await submitEnquiry(data);
      toast.success('Your enquiry has been sent — we\'ll get back to you soon.');
      setSubmitted(true);
      reset();
    } catch (err) {
      toast.error(err.message || 'Could not send your enquiry. Please try again.');
    }
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
      <h1 className="mt-4 font-display text-4xl">Contact Us</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal-soft">
        Have a question about a piece, an order, or a custom design? Reach out — we usually respond within a day.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">Get in Touch</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>Pundlik Nagar Rd, near Shivaji Maharaj Statue, Nyay Nagar, Chhatrapati Sambhajinagar, Maharashtra 431009</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
              <a href="tel:+918182839950" className="hover:text-gold-deep">+91 81828 39950</a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
              <a href="mailto:gayatrijewellersofficial@gmail.com" className="hover:text-gold-deep break-all">
                gayatrijewellersofficial@gmail.com
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>Mon–Sat: 10:30 AM – 8:30 PM · Sun: 11:00 AM – 6:00 PM</span>
            </li>
          </ul>

          <div className="mt-8 aspect-video w-full overflow-hidden border border-sand-dark">
            <iframe
              title="Store location"
              className="h-full w-full"
              loading="lazy"
              src="https://www.google.com/maps?q=Pundlik+Nagar+Rd,+Nyay+Nagar,+Chhatrapati+Sambhajinagar,+Maharashtra+431009&output=embed"
            />
          </div>
        </div>

        <div className="border border-sand-dark bg-ivory p-6">
          {submitted ? (
            <div className="py-10 text-center">
              <h3 className="font-display text-2xl">Thank you!</h3>
              <p className="mt-2 text-sm text-charcoal-soft">
                We've received your message and will get back to you shortly.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="btn-outline mt-6">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="font-display text-2xl">Send a Message</h2>
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Name</label>
                <input {...register('name')} className="input-field" />
                {errors.name && <p className="mt-1 text-xs text-maroon">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Phone</label>
                <input type="tel" inputMode="numeric" maxLength={10} {...register('phone')} className="input-field" />
                {errors.phone && <p className="mt-1 text-xs text-maroon">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Email (optional)</label>
                <input {...register('email')} className="input-field" />
                {errors.email && <p className="mt-1 text-xs text-maroon">{errors.email.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Subject</label>
                <input {...register('subject')} className="input-field" />
                {errors.subject && <p className="mt-1 text-xs text-maroon">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs text-charcoal-soft">Message</label>
                <textarea {...register('message')} rows={5} className="input-field" />
                {errors.message && <p className="mt-1 text-xs text-maroon">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
