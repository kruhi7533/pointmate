import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

// Google Maps configuration
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Dashboard: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    domain: 'Technical Skills',
    points: 5,
    poster: null as File | null,
    startDate: '',
    endDate: '',
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 },
      placeId: ''
    },
    organizedBy: '',
    org_email_login: ''
  });

  const [events, setEvents] = useState<any[]>([]); // State to store fetched events
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Get org_email_login from URL parameter for fetching
      const urlParams = new URLSearchParams(window.location.search);
      const orgEmail = urlParams.get('org_email');
      
      let apiUrl = 'http://localhost:3000/api/pointmate/events';
      if (orgEmail) {
        apiUrl = `http://localhost:3000/api/pointmate/events?org_email=${encodeURIComponent(orgEmail)}`;
        console.log('Fetching events with filter URL:', apiUrl); // Log filter URL
      } else {
        console.log('Fetching all events (no org_email in URL)'); // Log no filter
      }

      const response = await fetch(apiUrl);
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

  // Fetch events and get org email from URL on component mount
  useEffect(() => {
    fetchEvents();
    // Get org_email_login from URL parameter and set in form state
    const urlParams = new URLSearchParams(window.location.search);
    const orgEmail = urlParams.get('org_email');
    if (orgEmail) {
      setForm(prev => ({
        ...prev,
        org_email_login: orgEmail
      }));
      console.log('Fetched org_email_login from URL for form state:', orgEmail); // Log for form state
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'location') {
      setForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        poster: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setForm(prev => ({
          ...prev,
          location: {
            address: place.formatted_address || '',
            coordinates: {
              lat: place.geometry.location?.lat() || 0,
              lng: place.geometry.location?.lng() || 0
            },
            placeId: place.place_id || ''
          }
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append all form fields to FormData, including org_email_login
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'poster' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      console.log('Submitting event data (FormData):', Object.fromEntries(formData.entries()));

      const response = await fetch('http://localhost:3000/api/pointmate/events/create', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      console.log('Event created successfully:', data);
      alert('Event created successfully!');

      // Refetch events to update the list (will now be filtered by the URL parameter)
      fetchEvents();

      // Reset form, keeping the org_email_login if it exists
      setForm(prev => ({
        ...prev,
        title: '',
        description: '',
        domain: 'Technical Skills',
        points: 5,
        poster: null,
        startDate: '',
        endDate: '',
        location: {
          address: '',
          coordinates: { lat: 0, lng: 0 },
          placeId: ''
        },
        organizedBy: ''
      }));
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.message || 'Failed to create event. Please try again.');
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Organization Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your events and track participant registrations</p>
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Event Information</h3>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Event Title"
              className="w-full border rounded px-3 py-2 mb-3"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full border rounded px-3 py-2 mb-3"
              rows={3}
              required
            />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Domain</label>
                <select
                  name="domain"
                  value={form.domain}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option>Technical Skills</option>
                  <option>Soft Skills</option>
                  <option>Community Service</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">AICTE Points</label>
                <input
                  type="number"
                  name="points"
                  value={form.points}
                  onChange={handleInputChange}
                  min={1}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Event Media</h3>
            <div className="flex flex-col items-center">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Poster preview"
                  className="w-48 h-48 object-cover rounded-lg mb-4"
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <p className="text-sm text-gray-500 mt-2">Upload event poster (JPG, PNG, GIF)</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Date and Location</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Start Date and Time</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">End Date and Time</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm mb-1">Location</label>
              <LoadScript
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                libraries={['places']}
              >
                <Autocomplete
                  onLoad={autocomplete => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <input
                    type="text"
                    name="location"
                    value={form.location.address}
                    onChange={handleInputChange}
                    placeholder="Enter event location"
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </Autocomplete>
              </LoadScript>
              {form.location.coordinates.lat !== 0 && (
                <div className="mt-2 h-48 rounded-lg overflow-hidden">
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={form.location.coordinates}
                    zoom={15}
                  >
                    {/* Add markers or other map features here */}
                  </GoogleMap>
                </div>
              )}
            </div>

            <input
              type="text"
              name="organizedBy"
              value={form.organizedBy}
              onChange={handleInputChange}
              placeholder="Organized By"
              className="w-full border rounded px-3 py-2 mt-3"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
            >
              Create Event
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#2563eb" opacity=".15"/>
                <path d="M12 8v8m0 0l-3-3m3 3l3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Events</h2>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && events.length === 0 && <p>No events created yet.</p>}
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

export default Dashboard;