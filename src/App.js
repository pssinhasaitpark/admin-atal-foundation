import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./view/pages/auth/Login/Login";
import Sidebar from "./view/components/SideBar/Sidebar";
import Header from "./view/components/Header/AdminHeader";
import Home from "./view/pages/Home/Home";
import { Box } from "@mui/material";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout";
import PrivateRoute from "./view/routes/PrivateRoute";
// import OurSoul from "./view/pages/OurSoul/OurSoul";
// import AboutPage from "../src/view/pages/About/About";
// import Vision from "./view/pages/Vision/Vision";

import {
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

function AppLayout({ children }) {
  const location = useLocation();
  const hideSidebarAndHeader = ["/login", "/signup"].includes(
    location.pathname
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "84vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {!hideSidebarAndHeader && <Sidebar />}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {!hideSidebarAndHeader && <Header />}
        <Box sx={{ flexGrow: 1, p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AppLayout>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Private routes wrapped with PrivateRoute */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
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
          {/* <Route path="/aboutus" element={<AboutPage />} /> */}
        </Route>

        {/* Catch-all for 404 (if needed) */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
