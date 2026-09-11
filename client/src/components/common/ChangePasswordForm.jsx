import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import { changePassword } from '../../services/authService';

const schema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(8, 'New password must be at least 8 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm your new password'),
});

const ChangePasswordForm = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success('Password updated successfully');
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not update password');
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-outline">
        <KeyRound size={16} /> Change Password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm border border-sand-dark bg-ivory p-6">
      <h3 className="font-display text-lg">Change Password</h3>
      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="current-password" className="mb-1 block text-xs text-charcoal-soft">Current Password</label>
          <input id="current-password" type="password" {...register('currentPassword')} className="input-field" />
          {errors.currentPassword && <p className="mt-1 text-xs text-maroon">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label htmlFor="new-password" className="mb-1 block text-xs text-charcoal-soft">New Password</label>
          <input id="new-password" type="password" {...register('newPassword')} className="input-field" />
          {errors.newPassword && <p className="mt-1 text-xs text-maroon">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label htmlFor="confirm-new-password" className="mb-1 block text-xs text-charcoal-soft">Confirm New Password</label>
          <input id="confirm-new-password" type="password" {...register('confirmPassword')} className="input-field" />
          {errors.confirmPassword && <p className="mt-1 text-xs text-maroon">{errors.confirmPassword.message}</p>}
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
          {isSubmitting ? 'Updating…' : 'Update Password'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-outline flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
