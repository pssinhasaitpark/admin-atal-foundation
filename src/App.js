import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import AboutPage from "../src/view/pages/About/About";
import Login from "./view/pages/auth/Login/Login";
import Sidebar from "./view/components/SideBar/Sidebar";
import Header from "./view/components/Header/AdminHeader";
import Home from "./view/pages/Home/Home";
import OurSoul from "./view/pages/OurSoul/OurSoul";
import { Box } from "@mui/material";
import DashboardLayout from "./view/layout/DashboardLayout/DashboardLayout";
import PrivateRoute from "./view/routes/PrivateRoute";
import Vision from "./view/pages/Vision/Vision";
import Gallery from "./view/pages/Gallery/Gallery";
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
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/aboutus/our-soul" element={<OurSoul />} />
          <Route path="/aboutus/our-presence" element={<OurSoul />} />
          <Route path="/aboutus/people-behind" element={<OurSoul />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/mission" element={<OurSoul />} />
          <Route path="/programmes" element={<OurSoul />} />
          <Route path="/programmes/education" element={<OurSoul />} />
          <Route path="/programmes/healthcare" element={<OurSoul />} />
          <Route path="/programmes/livelihood" element={<OurSoul />} />
          <Route path="/programmes/empowerment" element={<OurSoul />} />
          <Route path="/programmes/privileged-children" element={<OurSoul />} />
          <Route path="/programmes/outreach" element={<OurSoul />} />
          <Route path="/programmes/civic-driven-change" element={<OurSoul />} />
          <Route
            path="/programmes/social-entrepreneurship"
            element={<OurSoul />}
          />
          <Route path="/programmes/support-programme" element={<OurSoul />} />
          <Route
            path="/programmes/special-interventions"
            element={<OurSoul />}
          />
          <Route path="/involved" element={<OurSoul />} />
          <Route path="/involved/registration" element={<OurSoul />} />
          <Route path="/involved/members" element={<OurSoul />} />
          <Route path="/involved/supporters-speak" element={<OurSoul />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/message" element={<OurSoul />} />
          <Route path="/settings/setingsample1" element={<OurSoul />} />
        </Route>

        {/* Catch-all for 404 (if needed) */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
