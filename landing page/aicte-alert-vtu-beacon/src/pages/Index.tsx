import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Benefits from '@/components/Benefits';
import FAQ from '@/components/FAQ';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

interface UserData {
  aictePoints?: number;
  [key: string]: any;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    // Function to update user data
    const updateUserData = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    };

    // Listen for storage events
    window.addEventListener('storage', updateUserData);

    // Initial check
    updateUserData();

    return () => {
      window.removeEventListener('storage', updateUserData);
    };
  }, []);

  // Get AICTE points from userData, default to 0 if not available
  const aicteScore = userData?.aictePoints || 0;
  const aicteMaxScore = 100;

  return (
    <div className="min-h-screen bg-white">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main>
        <div id="hero">
          <Hero aicteScore={aicteScore} aicteMaxScore={aicteMaxScore} />
        </div>
        <div id="how-aicte-helps">
          <Features />
        </div>
        <div id="why-vtu-love">
          <Benefits />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <CallToAction setSidebarOpen={setSidebarOpen} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
