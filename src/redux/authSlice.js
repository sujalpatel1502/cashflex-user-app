import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isSkipped: false,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.loading = false;
      state.isSkipped = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isSkipped = false;
    },
    skipLogin: (state) => {
      state.isSkipped = true;
      state.isLoggedIn = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, logout, skipLogin, setLoading } = authSlice.actions;
export default authSlice.reducer;
