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
    </Routes>
  );
};

export default AppRoutes;
