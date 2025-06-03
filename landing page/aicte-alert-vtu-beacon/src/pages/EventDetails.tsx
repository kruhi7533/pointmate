import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EventDetails = () => {
  const { eventId } = useParams();
  
  // State for fetched event data, loading, and error
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch event details from the backend
  const fetchEventDetails = async () => {
    if (!eventId) {
      setError('Event ID not provided');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Assuming the backend endpoint for a single event is /api/pointmate/events/:id
      const response = await fetch(`http://localhost:3000/api/pointmate/events/${eventId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found');
        } else {
          throw new Error(`Failed to fetch event details: ${response.statusText}`);
        }
      }
      const data = await response.json();
      setEvent(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching event details:', err);
      setError(err.message || 'Failed to fetch event details');
      setEvent(null); // Clear event on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch event details when the component mounts or eventId changes
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]); // Refetch if eventId changes

  // Helper function to format date for display (can reuse or create a new one if format needs differ)
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    try {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        console.error('Error formatting date:', e);
        return 'Invalid date';
    }
  };

  // Helper function to format time (assuming time is part of the date object or a separate field if backend provides)
  const formatTime = (dateString: string) => {
      if (!dateString) return 'Time not available';
      try {
          const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          return new Date(dateString).toLocaleTimeString(undefined, options);
      } catch (e) {
          console.error('Error formatting time:', e);
          return 'Invalid time';
      }
  };


  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading event details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-8">Event not found or data is missing.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        {/* Display image from backend using path */}
        {event.poster && (
           <img src={`http://localhost:3000/${event.poster.path}`} alt={event.title} className="w-full h-64 object-cover" />
        )}
        <div className="p-6 pb-0">
          <div className="flex gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${event.domain === 'Technical Skills' ? 'bg-blue-100 text-blue-700' : event.domain === 'Soft Skills' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{event.domain}</span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">{event.points} AICTE Points</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{event.title}</h1>
          <p className="text-gray-600 mb-2">By {event.organizedBy}</p> {/* Use organizedBy from backend */}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: About and AICTE info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">About this event</h2>
          <p className="text-gray-700 mb-6">{event.description}</p>
          <h2 className="text-lg font-semibold mb-2">AICTE Points Information</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-8">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="mt-1"><circle cx="12" cy="12" r="10" fill="#2563eb" opacity=".15"/><path d="M12 8v4m0 4h.01" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div>
              <div className="font-semibold text-blue-800 mb-1">Earn {event.points} AICTE Points</div>
              <div className="text-sm text-blue-900">Participating in this event will count towards your AICTE points requirement. This event falls under the <span className="font-semibold underline cursor-pointer">{event.domain}</span> domain.</div>
            </div>
          </div>
        </div>
        {/* Right: Event Details */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg p-5 mb-6 border">
            <h3 className="font-semibold mb-3">Event Details</h3>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <Calendar className="h-4 w-4" />
              <span><b>Date</b><br/>{event.startDate ? formatDate(event.startDate) : 'N/A'}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <Calendar className="h-4 w-4" />
              {/* Assuming backend date includes time or you have a separate time field */}
              <span><b>Time</b><br/>{event.startDate ? formatTime(event.startDate) : 'N/A'}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <MapPin className="h-4 w-4" />
              <span><b>Location</b><br/>{event.location?.address || 'N/A'}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <User className="h-4 w-4" />
              <span><b>Organized by</b><br/>{event.organizedBy || 'N/A'}</span>
            </div>
            <Button className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              Register for Event
            </Button>
            <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4" /> Share Event
            </Button>
          </div>
          {/* Event Location Map (Placeholder or actual map) */}
          <div className="bg-gray-50 rounded-lg p-5 border">
            <h3 className="font-semibold mb-3">Event Location</h3>
            {/* You would integrate a map component here, using event.location.coordinates if available */}
            <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              <span>Event location map placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 