import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const raw = localStorage.getItem('rj_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (items) => localStorage.setItem('rj_cart', JSON.stringify(items));

const initialState = {
  items: loadCart(), // { productId, name, slug, image, finalPrice, metal, purity, quantity, stockQuantity }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + (item.quantity || 1), existing.stockQuantity || 99);
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      persist(state.items);
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stockQuantity || 99));
      }
      persist(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0);

export default cartSlice.reducer;
