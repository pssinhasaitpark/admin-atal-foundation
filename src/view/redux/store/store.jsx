import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import visionReducer from "../slice/visionSlice";
import galleryReducer from "../slice/galleryslice";
import eventReducer from "../slice/eventSlice";
import profileReducer from "../slice/profileSlice";
import contactReducer from "../slice/contactusSlice";
import messageReducer from "../slice/messageSlice";
import peopleBehindReducer from "../slice/peopleSlice"
import membersReducer from "../slice/membersSlice"
import supportSpeakReducer from "../slice/supportSpeakSlice"
import userOpinionReducer from "../slice/userOpinionSlice"
import registrationReducer from "../slice/registrationSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    vision: visionReducer,
    gallery: galleryReducer,
    events: eventReducer,
    profile: profileReducer,
    contact: contactReducer,
    message: messageReducer,
    peopleBehind: peopleBehindReducer, 
    members: membersReducer, // Add Members reducer
    supportSpeak: supportSpeakReducer, // Add Support Speak reducer
    userOpinion: userOpinionReducer, // Add User Opinion reducer
    registration: registrationReducer,
  },
});

export default store;
