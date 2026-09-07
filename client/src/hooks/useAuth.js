import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, status } = useSelector((state) => state.auth);
  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'ADMIN',
    status,
  };
};
