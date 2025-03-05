import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await api.get("/news");
  console.log("News:", response.data.allNews);

  return response.data.allNews;
});

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [], // Ensure this is an array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload; // Ensure this is an array
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default newsSlice.reducer;
