import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import visionReducer from "../slice/visionSlice";
import galleryReducer from "../slice/galleryslice";
import eventReducer from "../slice/eventSlice";
import profileReducer from "../slice/profileSlice";
import contactReducer from "../slice/contactusSlice";
import messageReducer from "../slice/messageSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    vision: visionReducer,
    gallery: galleryReducer,
    events: eventReducer,
    profile: profileReducer,
    contact: contactReducer,
    message: messageReducer,
  },
});

export default store;
