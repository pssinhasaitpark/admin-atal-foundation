import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import visionReducer from "../slice/visionSlice";
import galleryReducer from "../slice/galleryslice";
import eventReducer from "../slice/eventSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    vision: visionReducer,
    gallery: galleryReducer,
    events: eventReducer,
  },
});

export default store;
