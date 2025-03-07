import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Support Speak",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch Support Speak Data from Backend
export const fetchSupportSpeakData = createAsyncThunk(
  "supportSpeak/fetchSupportSpeakData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/support-speak");
      return response.data.supportSpeak[0] || {};
    } catch (error) {
      console.error("Error fetching support speak data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update Support Speak Data to Backend
export const saveSupportSpeakToBackend = createAsyncThunk(
  "supportSpeak/saveSupportSpeakToBackend",
  async ({ id, supportSpeakData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", supportSpeakData.title);
      formData.append(
        "description",
        supportSpeakData.description?.trim() || "No description provided"
      );

      supportSpeakData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      if (supportSpeakData.removeImages?.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(supportSpeakData.removeImages)
        );
      }

      const endpoint = id ? `/support-speak/create?id=${id}` : "/support-speak/create";

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving support speak data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const supportSpeakSlice = createSlice({
  name: "supportSpeak",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSupportSpeakData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default supportSpeakSlice.reducer;
