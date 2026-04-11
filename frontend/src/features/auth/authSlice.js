import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("user");
// Support both 'userToken' (current) and legacy 'token' key
const tokenFromStorage =
  localStorage.getItem("userToken") || localStorage.getItem("token");

const initialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage || null,
  isAuthenticated: !!tokenFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("userToken", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
      localStorage.removeItem("token"); // clean up legacy key
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
