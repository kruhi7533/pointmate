console.log('Processing App.tsx file'); // Log at the very top

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AictePointsTracker from "./pages/AictePointsTracker";
import Help from "./pages/Help";
import Certificates from './pages/Certificates';
import ActivityLog from './pages/ActivityLog';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendered'); // Log when App renders

  // --- Logic to handle URL parameters and store in localStorage ---
  // This logic is placed outside useEffect to attempt immediate execution on render.
  // Note: This may still not execute if the App.tsx script itself is not running on load.
  console.log('Executing parameter handling logic in component body'); // Log
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get('user');
  const orgEmailParam = urlParams.get('org_email'); // Get the organization email from URL

  console.log('URL Parameters (in component body):', { userParam, orgEmailParam }); // Log

  // Handle user data from URL (if any)
  if (userParam) {
    try {
      console.log('Handling userParam (in component body)'); // Log
      const userData = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem('user', JSON.stringify(userData));
      // Removed: window.history.replaceState({}, document.title, window.location.pathname);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error parsing user data (in component body):', error);
    }
  }

  // Handle organization email from URL parameter
  if (orgEmailParam) {
    console.log('Found organization email in URL (in component body):', orgEmailParam); // Log
    // Store in localStorage
    localStorage.setItem('org_email_login', orgEmailParam);
    console.log('Stored org_email_login in localStorage (in component body):', orgEmailParam); // Log

    // Removed: window.history.replaceState({}, document.title, window.location.pathname); // Keep URL parameter

    // Fetch organization data using the email (This fetch should ideally be in useEffect to avoid re-fetching on every render if state changes)
    // For now, keeping it here to see if it executes at all
    console.log('Fetching organization data for (in component body):', orgEmailParam); // Log
    fetch(`http://localhost:3000/api/pointmate/organizations/${orgEmailParam}`)
      .then(response => {
        console.log('Fetch response status (in component body):', response.status); // Log status
        if (!response.ok) {
          throw new Error(`Failed to fetch organization details: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched organization data (in component body):', data); // Log data
        localStorage.setItem('organization_data', JSON.stringify(data));
        console.log('Stored organization_data in localStorage (in component body)'); // Log
        window.dispatchEvent(new Event('storage'));
      })
      .catch(error => {
        console.error('Error fetching organization data (in component body):', error);
      });
  } else {
    console.log('No org_email parameter in URL (in component body)'); // Log
    // We can still check localStorage on initial load here if needed
    // const storedEmail = localStorage.getItem('org_email_login');
    // if (storedEmail) { /* ... */ }
  }
  // --- End of URL parameter handling logic ---

  useEffect(() => {
    console.log('useEffect in App is running'); // Log when useEffect starts
    // You can add other side effects here that should only run once on mount
    // or when specific dependencies change.

    // Check localStorage on subsequent renders if needed
    const storedEmail = localStorage.getItem('org_email_login');
    if (storedEmail) {
      console.log('Found existing org_email_login in localStorage (in useEffect):', storedEmail);
      // Optionally re-fetch organization data if needed
      // fetch(`http://localhost:3000/api/pointmate/organizations/${storedEmail}`).then(...);
    }

  }, []); // Empty dependency array to run only on mount

  console.log('App component returning JSX'); // Log just before return

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/aicte-points-tracker" element={<AictePointsTracker />} />
            <Route path="/help" element={<Help />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/activity-log" element={<ActivityLog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
