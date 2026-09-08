import { createSlice } from '@reduxjs/toolkit';
import {
  fetchServerWishlist,
  mergeServerWishlist,
  addServerWishlistItem,
  removeServerWishlistItem,
} from '../../services/wishlistService';

const loadLocalWishlist = () => {
  try {
    const raw = localStorage.getItem('rj_wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistLocal = (items) => localStorage.setItem('rj_wishlist', JSON.stringify(items));

// Normalizes a server product object (from the wishlist API's populated
// Product refs) into the same shape the UI already expects.
const normalizeServerItem = (p) => ({
  productId: p._id,
  name: p.name,
  slug: p.slug,
  image: p.mainImage?.url,
  finalPrice: p.finalPrice,
  metal: p.metal,
  purity: p.purity,
});

const initialState = {
  items: loadLocalWishlist(), // { productId, name, slug, image, finalPrice, metal, purity }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems(state, action) {
      state.items = action.payload;
      persistLocal(state.items);
    },
    toggleWishlistLocal(state, action) {
      const item = action.payload;
      const exists = state.items.find((i) => i.productId === item.productId);
      if (exists) {
        state.items = state.items.filter((i) => i.productId !== item.productId);
      } else {
        state.items.push(item);
      }
      persistLocal(state.items);
    },
    removeFromWishlistLocal(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persistLocal(state.items);
    },
  },
});

export const { setWishlistItems, toggleWishlistLocal, removeFromWishlistLocal } = wishlistSlice.actions;

export const toggleWishlist = (item) => async (dispatch, getState) => {
  const alreadyIn = getState().wishlist.items.some((i) => i.productId === item.productId);
  dispatch(toggleWishlistLocal(item));
  const { token } = getState().auth;
  if (!token) return;
  try {
    const items = alreadyIn
      ? await removeServerWishlistItem(item.productId)
      : await addServerWishlistItem(item.productId);
    dispatch(setWishlistItems(items.map(normalizeServerItem)));
  } catch {
    // ignore background sync failure
  }
};

export const removeFromWishlist = (productId) => async (dispatch, getState) => {
  dispatch(removeFromWishlistLocal(productId));
  const { token } = getState().auth;
  if (!token) return;
  try {
    const items = await removeServerWishlistItem(productId);
    dispatch(setWishlistItems(items.map(normalizeServerItem)));
  } catch {
    // ignore
  }
};

// Called on login and app load: merges local guest wishlist into the
// server wishlist, then makes the server the source of truth.
export const initWishlist = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  if (!token) return;
  const localIds = getState().wishlist.items.map((i) => i.productId);
  try {
    const items =
      localIds.length > 0 ? await mergeServerWishlist(localIds) : await fetchServerWishlist();
    dispatch(setWishlistItems(items.map(normalizeServerItem)));
  } catch {
    // stay on local wishlist if the server sync fails
  }
};

export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((i) => i.productId === productId);

export default wishlistSlice.reducer;
