import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Award, Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const domains = ['All Events', 'Technical Skills', 'Soft Skills', 'Community Service'];

const Events = () => {
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Events');
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      (event.organizedBy && event.organizedBy.toLowerCase().includes(search.toLowerCase()));

    const matchesDomain =
      selectedDomain === 'All Events' || event.domain === selectedDomain;

    const hasRequiredFields = event.title && event.description && event.domain && event.points && event.startDate && event.location && event.organizedBy;

    return matchesSearch && matchesDomain && hasRequiredFields;
  });

  return (
    <div className="min-h-screen bg-[#f7fafd] py-10 px-2 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Events</h1>
      <p className="text-gray-500 mb-6">Browse and register for events to earn AICTE points</p>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex items-center gap-2 border rounded bg-white px-3 py-2 shadow-sm">
          <Search className="text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search events by title, description, or organization..."
            className="w-full border-none outline-none bg-transparent text-gray-700"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative min-w-[200px]">
          <button
            className="w-full flex items-center justify-between border rounded px-3 py-2 bg-white text-gray-700 shadow-sm"
            onClick={() => setFilterDropdown(v => !v)}
          >
            Filter by Domain
            <span className="ml-2 text-gray-500 flex items-center">
              {selectedDomain === 'All Events' ? 'All Domains' : selectedDomain}
              <ChevronDown className="ml-1 h-4 w-4" />
            </span>
          </button>
          {filterDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
              {domains.map(domain => (
                <div
                  key={domain}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedDomain === domain ? 'bg-blue-100 font-semibold' : ''}`}
                  onClick={() => { setSelectedDomain(domain); setFilterDropdown(false); }}
                >
                  {domain}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && filteredEvents.length === 0 && <p>No events found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && filteredEvents.map(event => (
          <div key={event._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
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
              <Calendar className="h-4 w-4" />
              {event.startDate ? formatDate(event.startDate) : 'Date not available'}
            </div>
            <div className="flex items-center text-gray-500 text-sm mb-2 gap-2">
              <MapPin className="h-4 w-4" />
              {event.location?.address || 'Location not available'}
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-xs text-gray-400">By {event.organizedBy}</span>
              {event._id && (
                 <Link to={`/events/${event._id}`} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm font-medium">View Details</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events; 