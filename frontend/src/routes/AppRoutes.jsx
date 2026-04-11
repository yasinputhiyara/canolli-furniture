import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import ProfilePage from "../pages/ProfilePage";
import OrderSuccess from "../pages/OrderSuccess";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products.jsx";
import AddProduct from "../pages/admin/AddProduct.jsx";
import EditProduct from "../pages/admin/EditProduct.jsx";
import Users from "../pages/admin/Users.jsx";
import AdminOrders from "../pages/admin/Orders.jsx";
import Categories from "../pages/admin/Categories.jsx";
import AdminRoute from "./AdminRoutes";
import Toast from "../components/layout/Toast.jsx";

const AppRoutes = () => {
  return (
    <>
      <Toast />
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        {/* Shop Route */}
        <Route
          path="/shop"
          element={
            <MainLayout>
              <Shop />
            </MainLayout>
          }
        />

        {/* Product Details Route */}
        <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          }
        />

        {/* cart Route */}
        <Route
          path="/cart"
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />

        {/* checkout Route */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Checkout />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrderSuccess />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* order Details Route */}
        {/* order Details Route / Redirected to new Profile hub */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Login Route - redirect if already authenticated */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <MainLayout>
                <Login />
              </MainLayout>
            </GuestRoute>
          }
        />

        {/* 404 NOTFOUND  */}
        <Route path="*" element={<NotFound />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/add"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <Categories />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
