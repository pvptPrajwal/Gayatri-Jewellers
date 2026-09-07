import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, fetchCurrentUser, logoutUser } from '../../services/authService';

const storedUser = (() => {
  try {
    const raw = localStorage.getItem('rj_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  user: storedUser,
  token: localStorage.getItem('rj_token') || null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const persistSession = (token, user) => {
  if (token) localStorage.setItem('rj_token', token);
  if (user) localStorage.setItem('rj_user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('rj_token');
  localStorage.removeItem('rj_user');
};

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await registerUser(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await loginUser(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loadCurrentUser = createAsyncThunk('auth/loadCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const user = await fetchCurrentUser();
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutUser();
  } catch {
    // ignore network errors on logout; we clear local session regardless
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistSession(action.payload.token, action.payload.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistSession(action.payload.token, action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        persistSession(null, action.payload);
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        clearSession();
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        clearSession();
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
