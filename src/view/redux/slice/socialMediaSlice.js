import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Fetch all social media links
export const fetchSocialMedia = createAsyncThunk(
  "socialMedia/fetch",
  async () => {
    const response = await api.get("/social-media");
    return response.data;
  }
);

// Update existing social media links
export const updateSocialMedia = createAsyncThunk(
  "socialMedia/update",
  async ({ id, updatedLinks }) => {
    const response = await api.patch(`/social-media/${id}`, updatedLinks);
    return response.data;
  }
);

// Add new social media links
export const addSocialMedia = createAsyncThunk(
  "socialMedia/add",
  async (newLinks) => {
    const response = await api.post("/social-media", newLinks);
    return response.data;
  }
);

const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState: {
    links: null,
    id: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?._id) {
          state.id = action.payload._id;
          state.links = action.payload;
        } else {
          state.links = null;
          state.id = null;
        }
      })
      .addCase(fetchSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSocialMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(updateSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSocialMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload;
        state.id = action.payload._id;
      })
      .addCase(addSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default socialMediaSlice.reducer;
