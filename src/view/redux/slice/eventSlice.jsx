import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  events: [],
  status: "idle",
  error: null,
};

// Fetch all events
export const fetchEventsData = createAsyncThunk(
  "events/fetchEventsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event");
      return response.data.events || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new event if no data exists
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/event", eventData);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update an event (title, description, banner)
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData, isFormData = false }) => {
    try {
      const response = await api.patch(
        `/event/${eventId}`,
        eventData,
        isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to update event";
    }
  }
);

// Update a specific event section
export const updateEventSection = createAsyncThunk(
  "events/updateEventSection",
  async ({ eventId, sectionId, sectionData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/event/${eventId}/section/${sectionId}`,
        sectionData
      );
      return { eventId, sectionId, updatedSection: response.data };
    } catch (error) {
      console.error("Error updating event section:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a specific event section
export const deleteEventSection = createAsyncThunk(
  "events/deleteEventSection",
  async (sectionId, { rejectWithValue }) => {
    try {
      await api.delete(`/event/section/${sectionId}`);
      return sectionId;
    } catch (error) {
      console.error("Error deleting event section:", error);
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
      // Fetch all events
      .addCase(fetchEventsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload;
      })
      .addCase(fetchEventsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create a new event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })

      // Update an event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const updatedEvent = action.payload;
        const index = state.events.findIndex(
          (event) => event._id === updatedEvent._id
        );
        if (index !== -1) {
          state.events[index] = updatedEvent;
        }
      })

      // Update a section inside an event
      .addCase(updateEventSection.fulfilled, (state, action) => {
        const { eventId, sectionId, updatedSection } = action.payload;
        const event = state.events.find((event) => event._id === eventId);
        if (event) {
          const sectionIndex = event.imageGroups.findIndex(
            (section) => section._id === sectionId
          );
          if (sectionIndex !== -1) {
            event.imageGroups[sectionIndex] = updatedSection;
          }
        }
      })

      // Delete a section
      .addCase(deleteEventSection.fulfilled, (state, action) => {
        state.events.forEach((event) => {
          event.imageGroups = event.imageGroups.filter(
            (section) => section._id !== action.payload
          );
        });
      });
  },
});

export default eventSlice.reducer;
