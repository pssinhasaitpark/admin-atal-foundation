import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Events",
  location: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
};

export const fetchEventsData = createAsyncThunk(
  "events/fetchEventsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event");
      console.log("Fetched event Data:", response.data.events);
      return response.data.events[0] || {};
    } catch (error) {
      console.error("Error fetching events data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveEventsToBackend = createAsyncThunk(
  "events/saveEventsToBackend",
  async (eventsData, { rejectWithValue }) => {
    try {
      const response = await api.post("/event/create", eventsData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Saved events Data:", response.data.data);
      return response.data.data || {};
    } catch (error) {
      console.error("Error saving events data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Events";
        state.location = action.payload?.location || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(fetchEventsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveEventsToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveEventsToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "events";
        state.location = action.payload?.location || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(saveEventsToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
