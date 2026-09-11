import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '../services/authService';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl">Reset Password</h1>
        <p className="mt-2 text-center text-sm text-charcoal-soft">
          Enter your account email and we'll send you a reset link.
        </p>

        {submitted ? (
          <div className="mt-8 text-center">
            <p className="text-sm text-charcoal-soft">
              If an account with that email exists, a reset link has been sent. Please check your inbox.
            </p>
            <Link to="/login" className="btn-outline mt-6 inline-flex">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label htmlFor="forgot-email" className="mb-1 block text-xs text-charcoal-soft">Email</label>
              <input id="forgot-email" type="email" {...register('email')} className="input-field" placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-maroon">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending…' : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-charcoal-soft">
              <Link to="/login" className="text-gold-deep hover:underline">Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
