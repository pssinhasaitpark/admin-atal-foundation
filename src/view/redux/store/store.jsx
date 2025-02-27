import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import visionReducer from "../slice/visionSlice";
import galleryReducer from "../slice/galleryslice";
import eventReducer from "../slice/eventSlice";
import profileReducer from "../slice/profileSlice";
import contactReducer from "../slice/contactusSlice";
import messageReducer from "../slice/messageSlice";
import aboutReducer from "../slice/aboutSlice";
import membersReducer from "../slice/membersSlice";
import supportSpeakReducer from "../slice/supportSpeakSlice";
import userOpinionReducer from "../slice/userOpinionSlice";
import registrationReducer from "../slice/registrationSlice";
import subscribersReducer from "../slice/subscribersSlice";
import programmesReducer from "../slice/ourProgrammesSlice";
import socialMediaReducer from "../slice/socialMediaSlice"; // Import the new slice
import dashboardReducer from "../slice/dashboardSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    vision: visionReducer,
    gallery: galleryReducer,
    events: eventReducer,
    profile: profileReducer,
    contact: contactReducer,
    message: messageReducer,
    about: aboutReducer,
    members: membersReducer,
    supportSpeak: supportSpeakReducer,
    userOpinion: userOpinionReducer,
    registration: registrationReducer,
    subscribers: subscribersReducer,
    programmes: programmesReducer,
    socialMedia: socialMediaReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
