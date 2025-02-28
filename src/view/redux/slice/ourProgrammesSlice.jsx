import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Ensure this is correctly configured

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for fetching programmes
export const fetchProgrammes = createAsyncThunk(
  "programmes/fetchProgrammes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/our-programme");
      return response.data.ourProgrammes || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching programmes"
      );
    }
  }
);

// Async thunk for adding a programme
export const addProgramme = createAsyncThunk(
  "programmes/addProgramme",
  async (programmeData, { rejectWithValue, dispatch }) => {
    try {
      await api.post("/our-programme", programmeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchProgrammes()); // ✅ Fetch updated data after adding
      return null; // No need to return anything explicitly
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding programme");
    }
  }
);

// Async thunk for updating a programme
export const updateProgramme = createAsyncThunk(
  "programmes/updateProgramme",
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      await api.put(`/our-programme/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchProgrammes()); // ✅ Fetch updated data after updating
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating programme"
      );
    }
  }
);

// Async thunk for deleting a programme
export const deleteProgramme = createAsyncThunk(
  "programmes/deleteProgramme",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/our-programme/${id}`);
      await dispatch(fetchProgrammes()); // ✅ Fetch updated data after deleting
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error deleting programme"
      );
    }
  }
);

const programmesSlice = createSlice({
  name: "programmes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Programmes
      .addCase(fetchProgrammes.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(fetchProgrammes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProgrammes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Programme (No Need to Modify State, We Fetch New Data)
      .addCase(addProgramme.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProgramme.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Programme (No Need to Modify State, We Fetch New Data)
      .addCase(updateProgramme.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProgramme.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Programme (No Need to Modify State, We Fetch New Data)
      .addCase(deleteProgramme.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProgramme.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = programmesSlice.actions;
export default programmesSlice.reducer;
