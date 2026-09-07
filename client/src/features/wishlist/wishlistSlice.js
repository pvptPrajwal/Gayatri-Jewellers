import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
  try {
    const raw = localStorage.getItem('rj_wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (items) => localStorage.setItem('rj_wishlist', JSON.stringify(items));

const initialState = {
  items: loadWishlist(), // { productId, name, slug, image, finalPrice, metal, purity }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const item = action.payload;
      const exists = state.items.find((i) => i.productId === item.productId);
      if (exists) {
        state.items = state.items.filter((i) => i.productId !== item.productId);
      } else {
        state.items.push(item);
      }
      persist(state.items);
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;

export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((i) => i.productId === productId);

export default wishlistSlice.reducer;
