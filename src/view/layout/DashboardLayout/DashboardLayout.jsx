import React from "react";
import { Routes, Route } from "react-router-dom";
import AboutPage from "../../pages/About/About";
import Home from "../../pages/Home/Home";
import OurSoul from "../../pages/OurSoul/OurSoul";
import Vision from "../../pages/Vision/Vision";

const DashboardLayout = () => {
  return (
    <>
      <div>
        {/* Adjusting padding if necessary */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/aboutus/our-soul" element={<OurSoul />} />
          <Route path="/aboutus/our-presence" element={<OurSoul />} />
          <Route path="/aboutus/people-behind" element={<OurSoul />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/mission" element={<OurSoul />} />
          {/* Add any other sub-routes under DashboardLayout */}
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
          <Route path="/gallery" element={<OurSoul />} />
          <Route path="/message" element={<OurSoul />} />
          <Route path="/settings/setingsample1" element={<OurSoul />} />
          <Route path="/settings/setingsample1" element={<OurSoul />} />
        </Routes>
      </div>
    </>
  );
};

export default DashboardLayout;
