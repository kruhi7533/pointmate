import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components (to be created)
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard.tsx";
import EventDetails from "./components/EventDetails";
import Events from "./components/Events";
import Profile from "./components/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="bg-[#fafbfc] min-h-screen pt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; 2023 PointMate. All rights reserved.</p>
      </footer>
    </BrowserRouter>
  );
};

export default App;
