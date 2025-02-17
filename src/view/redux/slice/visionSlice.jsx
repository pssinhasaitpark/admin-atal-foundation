import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Initial state setup
const initialState = {
  title: "Vision",
  visionContent: "",
  status: "idle",
  error: null,
};

// Async thunk to save vision data to the backend
export const saveVisionToBackend = createAsyncThunk(
  "vision/saveVisionToBackend",
  async (visionData, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Make the API call and include the token in Authorization header
      const response = await api.post("/vision/create", visionData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for handling files
          Authorization: `${token}`, // Add token to headers
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const visionSlice = createSlice({
  name: "vision",
  initialState,
  reducers: {
    updateVision: (state, action) => {
      state.title = action.payload.title;
      state.visionContent = action.payload.visionContent;
    },
    clearVisionText: (state) => {
      state.visionContent = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveVisionToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveVisionToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload.title;
        state.visionContent = action.payload.visionContent;
      })
      .addCase(saveVisionToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateVision, clearVisionText } = visionSlice.actions;
export default visionSlice.reducer;
