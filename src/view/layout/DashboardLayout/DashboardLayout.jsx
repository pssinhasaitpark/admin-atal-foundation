import React from "react";
import { Routes, Route } from "react-router-dom";
import AboutPage from "../../pages/About/About";
import Home from "../../pages/Home/Home";
// import OurSoul from "../../pages/OurSoul/OurSoul";
import Vision from "../../pages/Vision/Vision";
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
} from "../../pages/index.js";
const DashboardLayout = () => {
  return (
    <>
      <div>
        {/* Adjusting padding if necessary */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/message" element={<Messages />} />

          <Route path="/events" element={<Events />} />
          <Route path="/peoplebehind" element={<PeopleBehind />} />
          <Route path="/members" element={<Members />} />
          <Route path="/supportspeak" element={<SupportSpeak />} />
          <Route path="/useropinion" element={<UserOpinion />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
};

export default DashboardLayout;
