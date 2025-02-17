import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    userRole: localStorage.getItem("userRole") || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.userRole = action.payload.userRole;
    },
    logoutUser: (state) => {
      state.token = null;
      state.userRole = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
