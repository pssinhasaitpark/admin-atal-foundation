import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./view/pages/auth/Login/Login";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout";
import PrivateRoute from "./view/routes/PrivateRoute";
import {
  Home,
  Dashboard,
  Events,
  Gallery,
  PeopleBehind,
  Members,
  SupportSpeak,
  UserOpinion,
  Registration,
  Messages,
  ContactUs,
  Profile,
} from "./view/pages/index.js";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/peoplebehind" element={<PeopleBehind />} />
        <Route path="/members" element={<Members />} />
        <Route path="/supportspeak" element={<SupportSpeak />} />
        <Route path="/useropinion" element={<UserOpinion />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/message" element={<Messages />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
