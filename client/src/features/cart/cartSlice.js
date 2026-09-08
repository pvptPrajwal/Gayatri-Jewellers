import { createSlice } from '@reduxjs/toolkit';
import {
  fetchServerCart,
  mergeServerCart,
  addServerCartItem,
  updateServerCartItem,
  removeServerCartItem,
  clearServerCart,
} from '../../services/cartService';

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem('rj_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistLocal = (items) => localStorage.setItem('rj_cart', JSON.stringify(items));

const initialState = {
  items: loadLocalCart(), // { productId, name, slug, image, finalPrice, metal, purity, quantity, stockQuantity }
  status: 'idle',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload;
      persistLocal(state.items);
    },
    addItemLocal(state, action) {
      const item = action.payload;
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + (item.quantity || 1), existing.stockQuantity || 99);
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      persistLocal(state.items);
    },
    updateQuantityLocal(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = Math.max(1, Math.min(quantity, item.stockQuantity || 99));
      persistLocal(state.items);
    },
    removeItemLocal(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persistLocal(state.items);
    },
    clearCartLocal(state) {
      state.items = [];
      persistLocal(state.items);
    },
  },
});

export const { setCartItems, addItemLocal, updateQuantityLocal, removeItemLocal, clearCartLocal } = cartSlice.actions;

// --- Thunks: update local state immediately, sync to backend for logged-in users ---

export const addToCart = (item) => async (dispatch, getState) => {
  dispatch(addItemLocal(item));
  const { token } = getState().auth;
  if (!token) return;
  try {
    const items = await addServerCartItem(item.productId, item.quantity || 1);
    dispatch(setCartItems(items));
  } catch {
    // background sync failed silently; local state still reflects the add
  }
};

export const updateQuantity = ({ productId, quantity }) => async (dispatch, getState) => {
  dispatch(updateQuantityLocal({ productId, quantity }));
  const { token } = getState().auth;
  if (!token) return;
  try {
    const items = await updateServerCartItem(productId, quantity);
    dispatch(setCartItems(items));
  } catch {
    // ignore
  }
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
  dispatch(removeItemLocal(productId));
  const { token } = getState().auth;
  if (!token) return;
  try {
    const items = await removeServerCartItem(productId);
    dispatch(setCartItems(items));
  } catch {
    // ignore
  }
};

export const clearCart = () => async (dispatch, getState) => {
  dispatch(clearCartLocal());
  const { token } = getState().auth;
  if (!token) return;
  try {
    await clearServerCart();
  } catch {
    // ignore
  }
};

// Called on login and on app load (if a token exists): merges any local
// guest cart into the server cart, then makes the server the source of truth.
export const initCart = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  if (!token) return;
  const localItems = getState().cart.items;
  try {
    const items = localItems.length > 0 ? await mergeServerCart(localItems) : await fetchServerCart();
    dispatch(setCartItems(items));
  } catch {
    // stay on local cart if the server sync fails (e.g. offline)
  }
};

export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0);

export default cartSlice.reducer;
