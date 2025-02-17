import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authslice";
import visionReducer from "../slice/visionSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    vision: visionReducer,
  },
});

export default store;
