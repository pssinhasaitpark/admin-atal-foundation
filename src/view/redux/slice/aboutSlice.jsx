import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

// Fetch About Us Data from Backend
export const fetchAboutData = createAsyncThunk(
  "about/fetchAboutData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/about");
      return response.data || { data: [] };
    } catch (error) {
      console.error("Error fetching about data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update About Us Data to Backend
export const saveAboutDataToBackend = createAsyncThunk(
  "about/saveAboutDataToBackend",
  async ({ id, aboutData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", aboutData.title);
      formData.append("description", aboutData.description?.trim() || "No description provided");

      aboutData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      if (aboutData.removeImages?.length > 0) {
        formData.append("removeImages", JSON.stringify(aboutData.removeImages));
      }

      const endpoint = id ? `/about/update?id=${id}` : "/about/create";
      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data || {};
    } catch (error) {
      console.error("Error saving about data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.data = action.payload.data || [];
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;
