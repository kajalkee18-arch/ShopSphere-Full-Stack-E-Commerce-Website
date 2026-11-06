import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import CustomerLayout from '../components/layout/CustomerLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Customer Pages
import HomePage from '../pages/customer/HomePage';
import ProductListingPage from '../pages/customer/ProductListingPage';
import ProductDetailPage from '../pages/customer/ProductDetailPage';
import CartPage from '../pages/customer/CartPage';
import WishlistPage from '../pages/customer/WishlistPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrderSuccessPage from '../pages/customer/OrderSuccessPage';
import OrderHistoryPage from '../pages/customer/OrderHistoryPage';
import ProfilePage from '../pages/customer/ProfilePage';
import LoginPage from '../pages/customer/LoginPage';
import RegisterPage from '../pages/customer/RegisterPage';
import NotFoundPage from '../pages/customer/NotFoundPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer & Public Pages (Nested under CustomerLayout) */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:idOrSlug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Customer Pages */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Dashboard Pages (Nested under AdminLayout with AdminRoute Guard) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

