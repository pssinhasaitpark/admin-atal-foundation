import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Assuming axios instance is set up in 'api.js'

// Thunks for fetching and updating the gallery data
export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async () => {
    const response = await api.get("/gallery");
    return response.data.galleries[0];
  }
);

export const updateGalleryItem = createAsyncThunk(
  "gallery/updateGalleryItem",
  async ({ id, updatedItem, type }) => {
    const response = await api.put(`/gallery/${type}/${id}`, updatedItem);
    return response.data;
  }
);

export const addGalleryItem = createAsyncThunk(
  "gallery/addGalleryItem",
  async (formData) => {
    const response = await api.post("/gallery/create", formData);
    return response.data;
  }
);

export const deleteGalleryItem = createAsyncThunk(
  "gallery/deleteGalleryItem",
  async ({ id, type }) => {
    const response = await api.delete(`/gallery/${type}/${id}`);
    return response.data;
  }
);

// Gallery slice
const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    gallery_image: {},
    gallery_video: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery_image = action.payload.gallery_image;
        state.gallery_video = action.payload.gallery_video;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateGalleryItem.fulfilled, (state, action) => {
        const { type, id, title, description } = action.payload;
        if (type === "image") {
          const updatedImages = state.gallery_image.images.map((img) =>
            img.id === id ? { ...img, title, description } : img
          );
          state.gallery_image.images = updatedImages;
        } else if (type === "video") {
          const updatedVideos = state.gallery_video.videos.map((vid) =>
            vid.id === id ? { ...vid, title, description } : vid
          );
          state.gallery_video.videos = updatedVideos;
        }
      });
  },
});

export default gallerySlice.reducer;
