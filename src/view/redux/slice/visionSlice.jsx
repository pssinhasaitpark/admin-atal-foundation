import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Vision",
  visionContent: "",
  status: "idle",
  error: null,
};

export const saveVisionToBackend = createAsyncThunk(
  "vision/saveVisionToBackend",
  async (visionData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post("/vision/create", visionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

export const fetchVisionData = createAsyncThunk(
  "vision/fetchVisionData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/vision");
      return response.data.visions[0];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch data"
      );
    }
  }
);

const visionSlice = createSlice({
  name: "vision",
  initialState,
  reducers: {
    updateVision: (state, action) => {
      state.title = action.payload.title;
      state.visionContent = action.payload.visionContent;
    },
    clearVisionText: (state) => {
      state.visionContent = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVisionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload.heading;
        state.visionContent = action.payload.text;
        state.image = action.payload.image;
      })
      .addCase(fetchVisionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveVisionToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveVisionToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload.heading;
        state.visionContent = action.payload.text;
      })
      .addCase(saveVisionToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateVision, clearVisionText } = visionSlice.actions;
export default visionSlice.reducer;
