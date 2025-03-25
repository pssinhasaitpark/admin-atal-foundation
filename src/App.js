import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./view/pages/auth/Login/Login";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout";
import PrivateRoute from "./view/routes/PrivateRoute";
import {
  // Home,
  Dashboard,
  Events,
  Gallery,
  AboutUs,
  Members,
  Messages,
  ContactUs,
  Profile,
  Subscribers,
  SocialMedia,
  OurProgrammes,
  NewsPage,
  SupportSpeak,
  Registration,
  Books,
  AudioFiles,
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
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/members" element={<Members />} />
        <Route path="/message" element={<Messages />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route path="/socialMedia" element={<SocialMedia />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/support-speakers" element={<SupportSpeak />} />
        <Route path="/register-user" element={<Registration />} />
        <Route path="/books" element={<Books />} />
        <Route path="/audios" element={<AudioFiles />} />

        {/* Our Programmes Routes */}
        <Route path="/ourProgrammes" element={<OurProgrammes />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
