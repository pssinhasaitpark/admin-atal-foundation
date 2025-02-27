import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Initial State
const initialState = {
  data: [],
  status: "idle",
  error: null,
};

// Fetch About Data
export const fetchAboutData = createAsyncThunk(
  "about/fetchAboutData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/about");
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update About Data
export const saveAboutDataToBackend = createAsyncThunk(
  "about/saveAboutDataToBackend",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/about", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a Section
// export const updateSection = createAsyncThunk(
//   "about/updateSection",
//   async ({ aboutId, sectionId, data }, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(
//         `/about/${aboutId}/sections/${sectionId}`,
//         data
//       );
//       return { aboutId, sectionId, updatedSection: response.data };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
export const updateSection = createAsyncThunk(
  "about/updateSection",
  async ({ aboutId, sectionId, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/about/${aboutId}/sections/${sectionId}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }, // Ensure correct headers
        }
      );
      return { aboutId, sectionId, updatedSection: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a Section
export const deleteSection = createAsyncThunk(
  "about/deleteSection",
  async ({ aboutId, sectionId }, { rejectWithValue }) => {
    try {
      await api.delete(`/about/${aboutId}/sections/${sectionId}`);
      return { aboutId, sectionId };
    } catch (error) {
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
      .addCase(saveAboutDataToBackend.fulfilled, (state, action) => {
        state.data = [action.payload]; // Updating entire about data
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const { aboutId, sectionId, updatedSection } = action.payload;
        const about = state.data.find((item) => item._id === aboutId);
        if (about) {
          const sectionIndex = about.sections.findIndex(
            (sec) => sec._id === sectionId
          );
          if (sectionIndex !== -1) {
            about.sections[sectionIndex] = updatedSection;
          }
        }
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        const { aboutId, sectionId } = action.payload;
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
