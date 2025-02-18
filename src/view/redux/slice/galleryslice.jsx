// src/redux/slice/gallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk action for saving the gallery data to the backend
export const saveGalleryToBackend = createAsyncThunk(
  "gallery/saveGalleryToBackend",
  async (galleryData, { rejectWithValue }) => {
    try {
      // Here, send the FormData to the backend API endpoint
      const response = await fetch("/api/gallery", {
        method: "POST",
        body: galleryData,
      });

      if (!response.ok) {
        throw new Error("Failed to save gallery");
      }

      const data = await response.json();
      return data; // Return the saved gallery data
    } catch (error) {
      return rejectWithValue(error.message); // Handle error
    }
  }
);

const initialState = {
  title: "",
  description: "",
  images: [],
  status: "idle", // Could be "loading", "succeeded", or "failed"
  error: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setGalleryData: (state, action) => {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.images = action.payload.images;
    },
    clearGalleryData: (state) => {
      state.title = "";
      state.description = "";
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveGalleryToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveGalleryToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Assuming the backend returns the saved gallery data
        state.title = action.payload.title;
        state.description = action.payload.description;
        state.images = action.payload.images;
      })
      .addCase(saveGalleryToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setGalleryData, clearGalleryData } = gallerySlice.actions;

export default gallerySlice.reducer;
