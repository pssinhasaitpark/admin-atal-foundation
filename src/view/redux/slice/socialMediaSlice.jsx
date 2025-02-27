import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Fetch all social media links
export const fetchSocialMedia = createAsyncThunk(
  "socialMedia/fetch",
  async () => {
    const response = await api.get("/social-media");
    // console.log("Fetched Social Media Data:", response.data);
    return response.data; // Assuming it contains the full object including _id
  }
);

// Update social media links (entire object)
export const updateSocialMedia = createAsyncThunk(
  "socialMedia/update",
  async ({ id, updatedLinks }) => {
    // console.log("Updating Social Media:", { id, updatedLinks });
    const response = await api.patch(`/social-media/${id}`, updatedLinks);
    return response.data; // Assuming backend returns the updated data
  }
);

const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState: {
    links: {}, // Stores the entire social media object
    id: null, // Stores _id separately
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
          state.error = "API response is missing _id.";
          console.error(state.error);
        }
      })
      .addCase(fetchSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSocialMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload; // Update entire object
      })
      .addCase(updateSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default socialMediaSlice.reducer;
