import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';

// Remove hardcoded eventData
// const eventData = [ ... ];

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/pointmate/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
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

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]); // Rerun effect if eventId changes

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading event details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-8">Event not found.</div>;
  }

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format time for display (assuming dateString includes time)
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        {/* Display image from backend using path and make it clickable */}
        {event.poster && (
           <img
             src={`http://localhost:3000/${event.poster.path}`}
             alt={event.title}
             className="w-full h-64 object-cover cursor-pointer"
             onClick={() => setIsModalOpen(true)}
           />
        )}
        <div className="p-6 pb-0">
          <div className="flex gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${event.domain === 'Technical Skills' ? 'bg-blue-100 text-blue-700' : event.domain === 'Soft Skills' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{event.domain}</span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">{event.points} AICTE Points</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{event.title}</h1>
          <p className="text-gray-600 mb-2">By {event.organizedBy}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:flex-1">
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-700 text-sm">{event.description}</p>
          </div>

          {/* AICTE Points Information */}
          <h2 className="text-lg font-semibold mb-2">AICTE Points Information</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="mt-0.5 text-blue-700 flex-shrink-0"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
            <div>
              <div className="font-semibold text-blue-800 mb-1">Earn {event.points} AICTE Points</div>
              <div className="text-sm text-blue-900">Participating in this event will count towards your AICTE points requirement. This event falls under the <span className="font-semibold underline cursor-pointer">{event.domain}</span> domain.</div>
            </div>
          </div>

          {/* Add registration section or other details here */}

        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg p-5 mb-6 border">
            <h3 className="font-semibold mb-3">Event Details</h3>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M16 2v2M8 2v2M3 7h18M5 11v6a2 2 0 002 2h10a2 2 0 002-2v-6"/><rect width="18" height="13" x="3" y="7" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
              <span><b>Date</b><br/>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 8v4m0 4h.01"/></svg>
              <span><b>Time</b><br/>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
              <span><b>Location</b><br/>{event.location.address}</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-gray-700 text-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4" fill="#d1d5db"/><ellipse cx="12" cy="17" rx="7" ry="4" fill="#d1d5db"/></svg>
              <span><b>Organized by</b><br/>{event.organizedBy}</span>
            </div>
            
            {/* Share Event Button */}
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 21v-2a4 4 0 014-4h12a4 4 0 014 4v2"/>
              </svg>
              Share Event
            </button>

            {/* Add a registration button or other actions here */}
            {/* <Button className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              Register for Event
            </Button> */}
          </div>
          {/* You could add a map here using the location coordinates */}
          <div className="bg-gray-50 rounded-lg p-5 border">
            <h3 className="font-semibold mb-3">Event Location</h3>
            <div className="w-full h-64 rounded-lg overflow-hidden">
               {event.location?.coordinates?.lat !== 0 && event.location?.coordinates?.lng !== 0 ? (
                <LoadScript
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  libraries={['places']}
                >
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={event.location.coordinates}
                    zoom={15}
                  >
                    {/* Add a marker for the location */}
                    <></>
                  </GoogleMap>
                </LoadScript>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
                   <span>Location coordinates not available.</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {isModalOpen && event.poster && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="max-w-screen-lg max-h-screen-lg overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:3000/${event.poster.path}`}
              alt={event.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;