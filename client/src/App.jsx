import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import { loadCurrentUser } from './features/auth/authSlice';

import Home from './pages/Home';
import About from './pages/About';
import Collections from './pages/Collections';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import NewArrivals from './pages/NewArrivals';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCollections from './pages/admin/AdminCollections';
import AdminCustomers from './pages/admin/AdminCustomers';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('rj_token');
    if (token) dispatch(loadCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/offers" element={<ComingSoon title="Offers" description="Festive offers and making-charge discounts are being finalized." />} />
        <Route path="/gold-rate" element={<ComingSoon title="Today's Gold Rate" description="Live gold and silver rates land in the next build phase." />} />
        <Route path="/contact" element={<ComingSoon title="Contact Us" description="Our contact form and store map are being connected in the next build phase." />} />
        <Route path="/faq" element={<ComingSoon title="FAQ" description="Frequently asked questions are being compiled." />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProductList />} />
        <Route path="products/add" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>
    </Routes>
  );
}

export default App;
