// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../axios/axios";

// // Fetch the gallery data
// export const fetchGallery = createAsyncThunk(
//   "gallery/fetchGallery",
//   async () => {
//     const response = await api.get("/gallery");
//     return response.data.galleries[0]; // Adjust based on your API response structure
//   }
// );

// // Create a new gallery
// export const createGallery = createAsyncThunk(
//   "gallery/createGallery",
//   async (galleryData, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.post("/gallery/create", galleryData, {
//         headers: {
//           "Content-Type": "multipart/form-data", // Adjust if you're sending FormData
//         },
//       });
//       await dispatch(fetchGallery()); // Fetch the updated gallery list
//       return response.data; // Return the created gallery data if needed
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Failed to create gallery"
//       );
//     }
//   }
// );

// // Update an existing gallery item
// export const updateGalleryItem = createAsyncThunk(
//   "gallery/updateGalleryItem",
//   async ({ id, updatedItem, type }, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.put(`/gallery/${type}/${id}`, updatedItem, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       await dispatch(fetchGallery());
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Update failed");
//     }
//   }
// );

// // Add a new gallery item
// export const addGalleryItem = createAsyncThunk(
//   "gallery/addGalleryItem",
//   async ({ galleryId, formData, type }, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.put(
//         `/gallery/${type}/${galleryId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       await dispatch(fetchGallery());
//       return { galleryId, type, updatedGallery: response.data };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to add item");
//     }
//   }
// );

// // Delete a gallery item
// export const deleteGalleryItem = createAsyncThunk(
//   "gallery/deleteGalleryItem",
//   async ({ galleryId, fileUrl, type }, { rejectWithValue, dispatch }) => {
//     try {
//       const payload =
//         type === "image"
//           ? { remove_images: [fileUrl] }
//           : { remove_videos: [fileUrl] };

//       const response = await api.put(`/gallery/${type}/${galleryId}`, payload);
//       await dispatch(fetchGallery());
//       return { galleryId, fileUrl, type, updatedGallery: response.data };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to delete item");
//     }
//   }
// );

// // Gallery slice
// const gallerySlice = createSlice({
//   name: "gallery",
//   initialState: {
//     gallery_image: {},
//     gallery_video: {},
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Gallery
//       .addCase(fetchGallery.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchGallery.fulfilled, (state, action) => {
//         state.loading = false;
//         state.gallery_image = action.payload?.gallery_image || {};
//         state.gallery_video = action.payload?.gallery_video || {};
//       })
//       .addCase(fetchGallery.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })

//       // Create Gallery
//       .addCase(createGallery.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createGallery.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null; // Clear any previous errors
//       })
//       .addCase(createGallery.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })

//       // Update Gallery Item
//       .addCase(updateGalleryItem.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateGalleryItem.fulfilled, (state, action) => {
//         state.loading = false;
//         // Optionally handle the updated gallery item
//       })
//       .addCase(updateGalleryItem.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })

//       // Add Gallery Item
//       .addCase(addGalleryItem.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(addGalleryItem.fulfilled, (state, action) => {
//         state.loading = false;
//         const { galleryId, type, updatedGallery } = action.payload;

//         if (type === "image" && state.gallery_image?._id === galleryId) {
//           state.gallery_image.images = updatedGallery.images;
//         } else if (type === "video" && state.gallery_video?._id === galleryId) {
//           state.gallery_video.videos = updatedGallery.videos;
//         }
//       })
//       .addCase(addGalleryItem.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })

//       // Delete Gallery Item
//       .addCase(deleteGalleryItem.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteGalleryItem.fulfilled, (state, action) => {
//         state.loading = false;
//         const { galleryId, fileUrl, type } = action.payload;

//         if (type === "image" && state.gallery_image?._id === galleryId) {
//           state.gallery_image.images = state.gallery_image.images.filter(
//             (img) => img !== fileUrl
//           );
//         } else if (type === "video" && state.gallery_video?._id === galleryId) {
//           state.gallery_video.videos = state.gallery_video.videos.filter(
//             (vid) => vid !== fileUrl
//           );
//         }
//       })
//       .addCase(deleteGalleryItem.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default gallerySlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Fetch the gallery data
export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async () => {
    const response = await api.get("/gallery");
    return response.data.galleries[0]; // Adjust based on your API response structure
  }
);

// Create a new gallery
export const createGallery = createAsyncThunk(
  "gallery/createGallery",
  async (galleryData, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();

      // Add image gallery details if provided
      if (galleryData.gallery_image_title) {
        formData.append("gallery_image_title", galleryData.gallery_image_title);
      }
      if (galleryData.gallery_image_description) {
        formData.append(
          "gallery_image_description",
          galleryData.gallery_image_description
        );
      }
      if (galleryData.images) {
        galleryData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Add video gallery details if provided
      if (galleryData.gallery_video_title) {
        formData.append("gallery_video_title", galleryData.gallery_video_title);
      }
      if (galleryData.gallery_video_description) {
        formData.append(
          "gallery_video_description",
          galleryData.gallery_video_description
        );
      }
      if (galleryData.videos) {
        galleryData.videos.forEach((video) => {
          formData.append("videos", video);
        });
      }

      const response = await api.post("/gallery/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await dispatch(fetchGallery()); // Fetch the updated gallery list
      return response.data; // Return the created gallery data if needed
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create gallery"
      );
    }
  }
);

// Update an existing gallery item
export const updateGalleryItem = createAsyncThunk(
  "gallery/updateGalleryItem",
  async ({ id, updatedItem, type }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/gallery/${type}/${id}`, updatedItem, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await dispatch(fetchGallery());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// Add a new gallery item
export const addGalleryItem = createAsyncThunk(
  "gallery/addGalleryItem",
  async ({ galleryId, formData, type }, { rejectWithValue, dispatch }) => {
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
      await dispatch(fetchGallery());
      return { galleryId, type, updatedGallery: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add item");
    }
  }
);

// Delete a gallery item
export const deleteGalleryItem = createAsyncThunk(
  "gallery/deleteGalleryItem",
  async ({ galleryId, fileUrl, type }, { rejectWithValue, dispatch }) => {
    try {
      const payload =
        type === "image"
          ? { remove_images: [fileUrl] }
          : { remove_videos: [fileUrl] };

      const response = await api.put(`/gallery/${type}/${galleryId}`, payload);
      await dispatch(fetchGallery());
      return { galleryId, fileUrl, type, updatedGallery: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete item");
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
      // Fetch Gallery
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery_image = action.payload?.gallery_image || {};
        state.gallery_video = action.payload?.gallery_video || {};
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Gallery
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null; // Clear any previous errors
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Gallery Item
      .addCase(updateGalleryItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGalleryItem.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle the updated gallery item
      })
      .addCase(updateGalleryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add Gallery Item
      .addCase(addGalleryItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGalleryItem.fulfilled, (state, action) => {
        state.loading = false;
        const { galleryId, type, updatedGallery } = action.payload;

        if (type === "image" && state.gallery_image?._id === galleryId) {
          state.gallery_image.images = updatedGallery.images;
        } else if (type === "video" && state.gallery_video?._id === galleryId) {
          state.gallery_video.videos = updatedGallery.videos;
        }
      })
      .addCase(addGalleryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Gallery Item
      .addCase(deleteGalleryItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.loading = false;
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
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default gallerySlice.reducer;
