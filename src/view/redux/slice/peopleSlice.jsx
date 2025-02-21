import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "People Behind",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch People Data from Backend
export const fetchPeopleData = createAsyncThunk(
  "people/fetchPeopleData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/people");
      return response.data.people[0] || {};
    } catch (error) {
      console.error("Error fetching people data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update People Data to Backend
export const savePeopleToBackend = createAsyncThunk(
  "people/savePeopleToBackend",
  async ({ id, peopleData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", peopleData.title);

      // Ensure description is properly trimmed
      formData.append(
        "description",
        peopleData.description?.trim() || "No description provided"
      );

      // Append only image files (not URLs)
      peopleData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      // Ensure `removeImages` is only appended if it has values
      if (peopleData.removeImages?.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(peopleData.removeImages)
        );
      }

      const endpoint = id ? `/people/create?id=${id}` : "/people/create";

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving people data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPeopleData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default peopleSlice.reducer;
