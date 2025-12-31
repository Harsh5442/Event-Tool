// src/pages/ParticipantHome.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Bookmark, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchEvents, fetchUserById } from '../services/api.service';
import { formatDate, formatTime } from '../utils/helpers';
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
  endTime: string;
  venue: string;
  capacity: number;
  status: string;
  organizerName: string;
  image?: string;
  isTrending?: boolean;
}

const ParticipantHome: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents = await fetchEvents();

        const eventsWithDetails = await Promise.all(
          fetchedEvents.map(async (event) => {
            let organizerName = 'Unknown';

            try {
              const organizer = await fetchUserById(event.created_by);
              organizerName = organizer.name;
            } catch (err) {
              console.warn(`Could not fetch organizer details for user ${event.created_by}`);
            }

            const isSaved = savedEvents.includes(String(event.event_id));
            const frontendStatus = mapEventStatus(event.status);
            const finalStatus = isSaved ? 'saved' : frontendStatus === 'Upcoming' ? 'upcoming' : 'suggested';

            return {
              id: String(event.event_id),
              event_id: event.event_id,
              name: event.name,
              description: event.description,
              date: formatDate(event.start_date, 'MMM dd, yyyy'),
              startDate: event.start_date,
              endDate: event.end_date,
              startTime: formatTime(event.start_date, 'hh:mm a'),
              endTime: formatTime(event.end_date, 'hh:mm a'),
              venue: event.venue,
              capacity: event.capacity,
              status: finalStatus,
              organizerName: organizerName,
              image: undefined,
              isTrending: Math.random() > 0.7,
            };
          })
        );

        // Sort by date
        eventsWithDetails.sort((a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        setEvents(eventsWithDetails);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [savedEvents]);

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleRegister = (eventId: string) => {
    alert(`Registration for event ${eventId} initiated!`);
    setSelectedEvent(null);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-primary-500 text-white';
      case 'saved':
        return 'bg-blue-500 text-white';
      case 'suggested':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group relative"
    >
      {event.isTrending && (
        <div className="absolute top-3 left-3 z-10">
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>Trending</span>
          </span>
        </div>
      )}

      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
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
          <Bookmark className={`w-5 h-5 ${savedEvents.includes(event.id) ? 'fill-current text-primary-500' : ''}`} />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(event.status)}`}>
            {event.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
          {event.name}
        </h3>

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

        <button
          onClick={() => setSelectedEvent(event)}
          className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );

  const displayUpcoming = events.filter(e => e.status === 'upcoming');
  const displaySaved = events.filter(e => e.status === 'saved');
  const displaySuggested = events.filter(e => e.status === 'suggested');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Discover and register for amazing events</p>
      </div>

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

      {!loading && !error && (
        <>
          {/* Upcoming Events */}
          {displayUpcoming.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayUpcoming.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Saved Events */}
          {displaySaved.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Saved Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displaySaved.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Suggested Events */}
          {displaySuggested.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Suggested For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displaySuggested.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No events available at the moment.
            </div>
          )}
        </>
      )}

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedEvent(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-20 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative h-64 overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-400 to-primary-600">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.name}</h2>
                  <div className="flex flex-wrap gap-4 text-white">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">About</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedEvent.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Organizer</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedEvent.organizerName}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Availability</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedEvent.capacity} seats
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <button
                    onClick={() => toggleSaveEvent(selectedEvent.id)}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Bookmark className={`w-5 h-5 ${savedEvents.includes(selectedEvent.id) ? 'fill-current' : ''}`} />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {savedEvents.includes(selectedEvent.id) ? 'Saved' : 'Save Event'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleRegister(selectedEvent.id)}
                    className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticipantHome;