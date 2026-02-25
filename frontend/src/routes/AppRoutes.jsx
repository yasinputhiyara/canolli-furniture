import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
const AppRoutes = () => {
  return (
    <Routes>
         {/* Home Route */}
      <Route path="/" element= { 
        <MainLayout>
            <Home />
        </MainLayout>
        } />

       {/* Shop Route */} 
      <Route path="/shop" element= { 
        <MainLayout>
            <Shop />
        </MainLayout>
        } />

         {/* Product Details Route */}
      <Route path="/product/:id" element= { 
        <MainLayout>
            <ProductDetails />
        </MainLayout>
        } />


         {/* Product Details Route */}
      <Route path="/cart" element= { 
        <MainLayout>
            <Cart />
        </MainLayout>
        } />

        {/* 404 NOTFOUND  */}
        <Route path="*" element={< NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
