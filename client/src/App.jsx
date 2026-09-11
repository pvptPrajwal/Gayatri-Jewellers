import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import { loadCurrentUser } from './features/auth/authSlice';
import { initCart } from './features/cart/cartSlice';
import { initWishlist } from './features/wishlist/wishlistSlice';

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
import ForgotPassword from './pages/ForgotPassword';
import Account from './pages/Account';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import GoldRate from './pages/GoldRate';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Offers from './pages/Offers';
import NotFound from './pages/NotFound';

// Admin pages are lazy-loaded: this code is only downloaded when someone
// actually visits /admin, so regular customers never pay for its weight.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminCollections = lazy(() => import('./pages/admin/AdminCollections'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminGoldRate = lazy(() => import('./pages/admin/AdminGoldRate'));
const AdminFAQs = lazy(() => import('./pages/admin/AdminFAQs'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminSiteImages = lazy(() => import('./pages/admin/AdminSiteImages'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('rj_token');
    if (token) {
      dispatch(loadCurrentUser());
      dispatch(initCart());
      dispatch(initWishlist());
    }
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
        <Route path="/offers" element={<Offers />} />
        <Route path="/gold-rate" element={<GoldRate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin — wrapped in Suspense since these pages load on demand */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProductList />
            </Suspense>
          }
        />
        <Route
          path="products/add"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProductForm />
            </Suspense>
          }
        />
        <Route
          path="products/:id/edit"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProductForm />
            </Suspense>
          }
        />
        <Route
          path="categories"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCategories />
            </Suspense>
          }
        />
        <Route
          path="collections"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCollections />
            </Suspense>
          }
        />
        <Route
          path="orders"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminOrders />
            </Suspense>
          }
        />
        <Route
          path="enquiries"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminEnquiries />
            </Suspense>
          }
        />
        <Route
          path="gold-rate"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminGoldRate />
            </Suspense>
          }
        />
        <Route
          path="faqs"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminFAQs />
            </Suspense>
          }
        />
        <Route
          path="offers"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminOffers />
            </Suspense>
          }
        />
        <Route
          path="banners"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminBanners />
            </Suspense>
          }
        />
        <Route
          path="customers"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCustomers />
            </Suspense>
          }
        />
        <Route
          path="site-images"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminSiteImages />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;