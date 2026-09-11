import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../features/auth/authSlice';
import { initCart } from '../features/cart/cartSlice';
import { initWishlist } from '../features/wishlist/wishlistSlice';

const schema = yup.object({
  identifier: yup.string().required('Email or phone is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name.split(' ')[0]}!`);
      dispatch(initCart());
      dispatch(initWishlist());
      const redirectTo = location.state?.from || (result.payload.user.role === 'ADMIN' ? '/account' : '/account');
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-charcoal-soft">Sign in to your Gayatri Jewellers account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label htmlFor="login-identifier" className="mb-1 block text-xs text-charcoal-soft">Email or Phone</label>
            <input id="login-identifier" type="text" {...register('identifier')} className="input-field" placeholder="you@example.com" />
            {errors.identifier && <p className="mt-1 text-xs text-maroon">{errors.identifier.message}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="mb-1 block text-xs text-charcoal-soft">Password</label>
              <Link to="/forgot-password" className="text-xs text-gold-deep hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input id="login-password" type="password" {...register('password')} className="input-field" placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-xs text-maroon">{errors.password.message}</p>}
          </div>
          <label className="flex items-center gap-2 text-xs text-charcoal-soft">
            <input type="checkbox" className="accent-gold" /> Remember Me
          </label>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-soft">
          New here?{' '}
          <Link to="/register" className="text-gold-deep hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
