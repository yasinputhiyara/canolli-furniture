import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSclice";
import cartReducer from "../features/cart/cartSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart : cartReducer,
  },
});
