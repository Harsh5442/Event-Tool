// src/pages/Events.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Bookmark, Filter, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getRolePermissions } from '../utils/permissions';
import { fetchEvents, fetchUserById } from '../services/api.service';
import { formatDate, formatTime } from '../utils/helpers';
import { EventResponseDto } from '../models/event';
import { mapEventStatus } from '../utils/statusMapping';

interface Event {
  id: string;
  event_id: number;
  name: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  startTime: string;
  venue: string;
  capacity: number;
  status: string;
  organizerName: string;
  organizerEmail: string;
  image?: string;
  created_by: number;
}

const Events: React.FC = () => {
  const { user } = useAuth();
const permissions = user ? getRolePermissions(user.role) : null;
  const [activeTimeFilter, setActiveTimeFilter] = useState('All');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);

  const timeFilters = ['All', 'Today', 'Tomorrow', 'This Week', 'This Weekend', 'Next Week', 'This Month', 'Next Month'];

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents = await fetchEvents();
        
        // Fetch organizer details for each event
        const eventsWithOrganizerDetails = await Promise.all(
          fetchedEvents.map(async (event) => {
            let organizerName = 'Unknown';
            let organizerEmail = 'unknown@example.com';
            
            try {
              const organizer = await fetchUserById(event.created_by);
              organizerName = organizer.name;
              organizerEmail = organizer.email;
            } catch (err) {
              console.warn(`Could not fetch organizer details for user ${event.created_by}`);
            }

            return {
              id: String(event.event_id),
              event_id: event.event_id,
              name: event.name,
              description: event.description,
              date: formatDate(event.start_date, 'MMM dd, yyyy'),
              startDate: event.start_date,
              endDate: event.end_date,
              startTime: formatTime(event.start_date, 'hh:mm a'),
              venue: event.venue,
              capacity: event.capacity,
              status: mapEventStatus(event.status),
              organizerName: organizerName,
              organizerEmail: organizerEmail,
              created_by: event.created_by,
              image: undefined, // Backend doesn't provide images yet
            };
          })
        );

        // Sort by date
        eventsWithOrganizerDetails.sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        setEvents(eventsWithOrganizerDetails);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
      case 'published':
        return 'bg-primary-500 text-white';
      case 'planning':
      case 'draft':
        return 'bg-warning-500 text-white';
      case 'live':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const filteredEvents = events.filter(event => {
    // Add time filtering logic if needed
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Explore Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Discover and manage all your events</p>
        </div>
        {permissions?.canCreateEvent && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-200 shadow-md">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Event</span>
          </button>
        )}
      </div>

      {/* Time Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
                activeTimeFilter === filter
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error State */}
      {loading && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading events...
        </div>
      )}
      {error && (
        <div className="text-center py-10 text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No events found.
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group relative"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-white opacity-30" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveEvent(event.id);
                  }}
                  className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 hover:text-white transition-colors duration-200 z-10"
                >
                  <Bookmark
                    className={`w-5 h-5 ${savedEvents.includes(event.id) ? 'fill-current text-primary-500' : ''}`}
                  />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(event.status)}`}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.startTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.capacity} seats</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;