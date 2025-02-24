// App.js
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
  AboutUs,
  Members,
  SupportSpeak,
  UserOpinion,
  Registration,
  Messages,
  ContactUs,
  Profile,
  Education,
  CivicDriven,
  Empowerment,
  Entrepreneurship,
  Healthcare,
  Livelihood,
  Privileged,
  SpecialInterventions,
  SupportProgramme
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
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/members" element={<Members />} />
        <Route path="/supportspeak" element={<SupportSpeak />} />
        <Route path="/useropinion" element={<UserOpinion />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/message" element={<Messages />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Our Programmes Routes */}
        <Route path="/programmes/education" element={<Education/>}/>
        <Route path="/programmes/healthcare" element={<CivicDriven/>} />
        <Route path="/programmes/livelihood" element={<Empowerment/>} />
        <Route path="/programmes/girl-child-women-empowerment" element={<Entrepreneurship/>} />
        <Route path="/programmes/privileged-children" element={<Healthcare/>} />
        <Route path="/programmes/civic-driven-change" element={<Livelihood/>} />
        <Route path="/programmes/social-entrepreneurship" element={<Privileged/>} />
        <Route path="/programmes/special-support-programme" element={<SpecialInterventions/>} />
        <Route path="/programmes/special-interventions" element={<SupportProgramme/>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;