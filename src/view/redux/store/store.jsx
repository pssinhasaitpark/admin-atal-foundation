// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import visionReducer from "../slice/visionSlice";
import galleryReducer from "../slice/galleryslice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    vision: visionReducer,
    gallery: galleryReducer,
  },
});

export default store;
