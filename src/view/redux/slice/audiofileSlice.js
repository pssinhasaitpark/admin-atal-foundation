import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Fetch Audio
export const fetchAudio = createAsyncThunk(
  "audiolist/fetchAudio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/audio-quote");
      return response.data.data[0];
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Add a new audio
export const addAudio = createAsyncThunk(
  "audiolist/addAudio",
  async (audioData, { rejectWithValue }) => {
    try {
      const response = await api.post("/audio-quote", audioData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update an audio
export const updateAudioData = createAsyncThunk(
  "audiolist/updateAudioData",
  async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/audio-quote/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchAudio());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update an audio section
export const updateAudioSection = createAsyncThunk(
  "audiolist/updateAudioSection",
  async ({ id, section_id, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(
        `/audio-quote/${id}/sections/${section_id}`,
        updatedData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(fetchAudio());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Delete an audio section
export const deleteAudio = createAsyncThunk(
  "audiolist/deleteAudio",
  async ({ id, section_id }, { rejectWithValue }) => {
    try {
      await api.delete(`/audio-quote/${id}/sections/${section_id}`);
      return { id, section_id };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Audio Slice
const audioSlice = createSlice({
  name: "audiolist",
  initialState: {
    audio: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Audio
      .addCase(fetchAudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAudio.fulfilled, (state, action) => {
        state.loading = false;
        state.audio = action.payload;
      })
      .addCase(fetchAudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Audio
      .addCase(addAudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAudio.fulfilled, (state, action) => {
        state.loading = false;
        state.audio = action.payload;
      })
      .addCase(addAudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Audio Data
      .addCase(updateAudioData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAudioData.fulfilled, (state, action) => {
        state.loading = false;
        state.audio = action.payload;
      })
      .addCase(updateAudioData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Audio Section
      .addCase(updateAudioSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAudioSection.fulfilled, (state, action) => {
        state.loading = false;
        if (state.audio && state.audio._id === action.payload._id) {
          state.audio = action.payload;
        }
      })
      .addCase(updateAudioSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Audio Section
      .addCase(deleteAudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAudio.fulfilled, (state, action) => {
        state.loading = false;
        if (state.audio && state.audio.audio_section) {
          state.audio.audio_section = state.audio.audio_section.filter(
            (section) => section._id !== action.payload.section_id
          );
        }
      })
      .addCase(deleteAudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default audioSlice.reducer;
