import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCartFromDB,
  addItemToCartDB,
  updateItemInCartDB,
  removeItemFromCartDB,
  clearCartInDB,
} from "../../services/cartService";

// ── Helper: map DB cart → flat items array used by UI ──────────────────────
function mapCartItems(cart) {
  if (!cart || !cart.items) return [];
  return cart.items.map((item) => {
    const p = item.product || {};
    return {
      id: p._id || item.product,
      name: p.name || "",
      price: item.price,
      image: (p.images && p.images[0]) || "",
      quantity: item.quantity,
    };
  });
}

// ── Async Thunks ────────────────────────────────────────────────────────────

export const loadCart = createAsyncThunk("cart/loadCart", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchCartFromDB();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load cart");
  }
});

export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await addItemToCartDB(productId, quantity);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateQuantityThunk = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await updateItemInCartDB(productId, quantity);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update cart");
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await removeItemFromCartDB(productId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove item");
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await clearCartInDB();
      return { items: [], totalAmount: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear cart");
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Used for local-only reset (e.g. on logout)
    resetCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const fulfilled = (state, action) => {
      state.loading = false;
      state.items = mapCartItems(action.payload);
      state.totalAmount = action.payload?.totalAmount || 0;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(loadCart.pending, pending)
      .addCase(loadCart.fulfilled, fulfilled)
      .addCase(loadCart.rejected, rejected)

      .addCase(addToCartThunk.pending, pending)
      .addCase(addToCartThunk.fulfilled, fulfilled)
      .addCase(addToCartThunk.rejected, rejected)

      .addCase(updateQuantityThunk.pending, pending)
      .addCase(updateQuantityThunk.fulfilled, fulfilled)
      .addCase(updateQuantityThunk.rejected, rejected)

      .addCase(removeFromCartThunk.pending, pending)
      .addCase(removeFromCartThunk.fulfilled, fulfilled)
      .addCase(removeFromCartThunk.rejected, rejected)

      .addCase(clearCartThunk.pending, pending)
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
      })
      .addCase(clearCartThunk.rejected, rejected);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;