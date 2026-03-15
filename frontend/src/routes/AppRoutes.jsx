import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import AdminRoute from "./AdminRoutes";

const AppRoutes = () => {
  return (
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

      {/* order Details Route */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Orders />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Login Route */}
      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
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
    </Routes>
  );
};

export default AppRoutes;
