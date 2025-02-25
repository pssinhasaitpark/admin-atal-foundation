// src/store/programmesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Adjust the import path as necessary

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for fetching programmes
export const fetchProgrammes = createAsyncThunk(
  "programmes/fetchProgrammes",
  async (category) => {
    const response = await api.get(`/programmes/${category}`); // Adjust the endpoint as necessary
    return response.data;
  }
);

// Async thunk for adding a programme
export const addProgramme = createAsyncThunk(
  "programmes/addProgramme",
  async (programme) => {
    const response = await api.post("/programmes", programme); // Adjust the endpoint as necessary
    return response.data;
  }
);

// Async thunk for updating a programme
export const updateProgramme = createAsyncThunk(
  "programmes/updateProgramme",
  async (programme) => {
    const response = await api.put(`/programmes/${programme.id}`, programme); // Adjust the endpoint as necessary
    return response.data;
  }
);

// Async thunk for deleting a programme
export const deleteProgramme = createAsyncThunk(
  "programmes/deleteProgramme",
  async (id) => {
    await api.delete(`/programmes/${id}`); // Adjust the endpoint as necessary
    return id;
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
      .addCase(fetchProgrammes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProgrammes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProgrammes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProgramme.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProgramme.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProgramme.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearError } = programmesSlice.actions;

export default programmesSlice.reducer;
