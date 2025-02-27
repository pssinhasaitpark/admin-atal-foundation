import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

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
    try {
      const response = await api.put(`/gallery/${type}/${id}`, updatedItem, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  }
);

export const addGalleryItem = createAsyncThunk(
  "gallery/addGalleryItem",
  async ({ galleryId, formData, type }) => {
    try {
      const response = await api.put(
        `/gallery/${type}/${galleryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { galleryId, type, updatedGallery: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add item");
    }
  }
);
export const deleteGalleryItem = createAsyncThunk(
  "gallery/deleteGalleryItem",
  async ({ galleryId, fileUrl, type }) => {
    try {
      const payload =
        type === "image"
          ? { remove_images: [fileUrl] }
          : { remove_videos: [fileUrl] };

      const response = await api.put(`/gallery/${type}/${galleryId}`, payload);

      return { galleryId, fileUrl, type, updatedGallery: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete item");
    }
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
      .addCase(addGalleryItem.fulfilled, (state, action) => {
        const { galleryId, type, updatedGallery } = action.payload;

        if (type === "image" && state.gallery_image?._id === galleryId) {
          state.gallery_image.images = updatedGallery.images;
        } else if (type === "video" && state.gallery_video?._id === galleryId) {
          state.gallery_video.videos = updatedGallery.videos;
        }
      })
      .addCase(addGalleryItem.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        const { galleryId, fileUrl, type } = action.payload;

        if (type === "image" && state.gallery_image?._id === galleryId) {
          state.gallery_image.images = state.gallery_image.images.filter(
            (img) => img !== fileUrl
          );
        } else if (type === "video" && state.gallery_video?._id === galleryId) {
          state.gallery_video.videos = state.gallery_video.videos.filter(
            (vid) => vid !== fileUrl
          );
        }
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default gallerySlice.reducer;
