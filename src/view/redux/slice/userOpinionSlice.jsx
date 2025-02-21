import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "User Opinions",
  opinions: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch User Opinions from Backend
export const fetchUserOpinions = createAsyncThunk(
  "userOpinion/fetchUserOpinions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user-opinions");
      return response.data.userOpinions || [];
    } catch (error) {
      console.error("Error fetching user opinions:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update User Opinions
export const saveUserOpinions = createAsyncThunk(
  "userOpinion/saveUserOpinions",
  async ({ id, userOpinions }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user-opinions/create?id=${id || ""}`, {
        title: userOpinions.title,
        opinions: userOpinions.opinions,
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving user opinions:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userOpinionSlice = createSlice({
  name: "userOpinion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserOpinions.fulfilled, (state, action) => {
      state.opinions = action.payload;
    });
  },
});

export default userOpinionSlice.reducer;
