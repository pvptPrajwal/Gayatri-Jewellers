import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';

const schema = yup.object({
  identifier: yup.string().required('Email or phone is required'),
  password: yup.string().required('Password is required'),
});

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { status } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      if (result.payload.user.role !== 'ADMIN') {
        toast.error('This account does not have admin access');
        return;
      }
      toast.success('Welcome back');
      navigate('/admin', { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm rounded-sm bg-ivory p-8">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Gayatri Jewellers" className="h-14 w-14" />
          <h1 className="mt-3 font-display text-2xl text-charcoal">Gayatri Jewellers Admin</h1>
          <p className="mt-1 text-xs text-charcoal-soft">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-charcoal-soft">Email or Phone</label>
            <input type="text" {...register('identifier')} className="input-field" placeholder="admin@gayatrijewellers.test" />
            {errors.identifier && <p className="mt-1 text-xs text-maroon">{errors.identifier.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs text-charcoal-soft">Password</label>
            <input type="password" {...register('password')} className="input-field" placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-xs text-maroon">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Signing in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
