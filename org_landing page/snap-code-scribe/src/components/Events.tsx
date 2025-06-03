import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Remove hardcoded eventData
// const eventData = [ ... ];

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]); // State to store fetched events
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/pointmate/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
      setEvents([]); // Clear events on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []); // Empty dependency array means this runs once on mount

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">All Registered Events</h1>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && events.length === 0 && <p>No events found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            {/* Display image from backend using path */}
            {event.poster && (
               <img src={`http://localhost:3000/${event.poster.path}`} alt={event.title} className="rounded-lg h-36 w-full object-cover mb-4" />
            )}
            <div className="flex gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${event.domain === 'Technical Skills' ? 'bg-blue-100 text-blue-700' : event.domain === 'Soft Skills' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{event.domain}</span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">{event.points} Points</span>
            </div>
            <h3 className="text-lg font-bold mb-1">{event.title}</h3>
            <p className="text-gray-600 mb-2 text-sm">{event.description}</p>
            <div className="flex items-center text-gray-500 text-sm mb-1 gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M16 2v2M8 2v2M3 7h18M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6"/><rect width="18" height="13" x="3" y="7" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
              {formatDate(event.startDate)}
            </div>
            <div className="flex items-center text-gray-500 text-sm mb-2 gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
              {event.location.address}
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-xs text-gray-400">By {event.organizedBy}</span>
              <Link to={`/event/${event._id}`} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition text-sm font-medium">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events; 