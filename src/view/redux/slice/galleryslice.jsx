import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Assuming API instance is configured

// Fetch Gallery Data
export const fetchGallery = createAsyncThunk("gallery/fetchGallery", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/gallery`);
    console.log("response:",response)
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch gallery");
  }
});

// Save Gallery Data (Images & Videos)
export const saveGalleryToBackend = createAsyncThunk("gallery/saveGallery", async (galleryData, { rejectWithValue }) => {
  try {
    const response = await api.post(`/gallery/create`, galleryData);
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to save gallery");
  }
});

// Delete Image or Video
export const deleteGalleryItem = createAsyncThunk("gallery/deleteGalleryItem", async ({ id, type }, { rejectWithValue }) => {
  try {
    await api.delete(`/gallery/${type}/${id}`);
    return { id, type };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete item");
  }
});

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    gallery_image: { title: "", description: "", images: [] },
    gallery_video: { title: "", description: "", videos: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => { state.loading = true; })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery_image = action.payload.gallery_image || { title: "", description: "", images: [] };
        state.gallery_video = action.payload.gallery_video || { title: "", description: "", videos: [] };
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveGalleryToBackend.fulfilled, (state, action) => {
        state.gallery_image = action.payload.gallery_image;
        state.gallery_video = action.payload.gallery_video;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        if (action.payload.type === "image") {
          state.gallery_image.images = state.gallery_image.images.filter((img) => img._id !== action.payload.id);
        } else {
          state.gallery_video.videos = state.gallery_video.videos.filter((vid) => vid._id !== action.payload.id);
        }
      });
  },
});

export default gallerySlice.reducer;
