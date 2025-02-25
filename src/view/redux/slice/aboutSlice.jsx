// src/redux/slice/aboutSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

// Fetch About Us Data
export const fetchAboutData = createAsyncThunk(
  "about/fetchAboutData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/about");
      console.log("Response:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching about data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update About Us Data
export const saveAboutDataToBackend = createAsyncThunk(
  "about/saveAboutDataToBackend",
  async (formData, { rejectWithValue }) => {
    try {
      const id = formData.get("id");

      const endpoint = id ? `/about/${id}` : "/about/";
      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a specific section
export const updateSection = createAsyncThunk(
  "about/updateSection",
  async ({ aboutId, sectionId, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/about/${aboutId}/sections/${sectionId}`,
        data
      );
      return { aboutId, sectionId, updatedSection: response.data };
    } catch (error) {
      console.error("Error updating section:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a specific section
export const deleteSection = createAsyncThunk(
  "about/deleteSection",
  async (sectionId, { rejectWithValue }) => {
    try {
      await api.delete(`/about/${sectionId}`);
      return sectionId;
    } catch (error) {
      console.error("Error deleting section:", error);
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
        state.data = action.payload;
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(saveAboutDataToBackend.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const { aboutId, sectionId, updatedSection } = action.payload;
        const aboutIndex = state.data.findIndex(
          (about) => about._id === aboutId
        );
        if (aboutIndex !== -1) {
          const sectionIndex = state.data[aboutIndex].sections.findIndex(
            (section) => section._id === sectionId
          );
          if (sectionIndex !== -1) {
            state.data[aboutIndex].sections[sectionIndex] = updatedSection;
          }
        }
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        const sectionId = action.payload;
        state.data = state.data.map((about) => ({
          ...about,
          sections: about.sections.filter(
            (section) => section._id !== sectionId
          ),
        }));
      });
  },
});

export default aboutSlice.reducer;
