import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register as registerUser } from '../features/auth/authSlice';
import { initCart } from '../features/cart/cartSlice';
import { initWishlist } from '../features/wishlist/wishlistSlice';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number')
    .required('Phone is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully');
      dispatch(initCart());
      dispatch(initWishlist());
      navigate('/account', { replace: true });
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl">Create Account</h1>
        <p className="mt-2 text-center text-sm text-charcoal-soft">Join Gayatri Jewellers for a personalized experience</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-charcoal-soft">Full Name</label>
            <input type="text" {...field('name')} className="input-field" placeholder="Priya Sharma" />
            {errors.name && <p className="mt-1 text-xs text-maroon">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-charcoal-soft">Email</label>
            <input type="email" {...field('email')} className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-maroon">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-charcoal-soft">Phone</label>
            <input type="tel" {...field('phone')} className="input-field" placeholder="9876543210" />
            {errors.phone && <p className="mt-1 text-xs text-maroon">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-charcoal-soft">Password</label>
            <input type="password" {...field('password')} className="input-field" placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-xs text-maroon">{errors.password.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-charcoal-soft">Confirm Password</label>
            <input type="password" {...field('confirmPassword')} className="input-field" placeholder="••••••••" />
            {errors.confirmPassword && <p className="mt-1 text-xs text-maroon">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-soft">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-deep hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
