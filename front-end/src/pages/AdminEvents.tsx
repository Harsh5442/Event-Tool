// src/pages/AdminEvents.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, Calendar, MapPin, Users, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchEvents, fetchUserById } from '../services/api.service';
import { formatDate } from '../utils/helpers';

interface Event {
  id: string;
  event_id: number;
  name: string;
  organizerName: string;
  organizerEmail: string;
  date: string;
  venue: string;
  capacity: number;
  status: string;
  submittedDate: string;
  description: string;
  created_by: number;
}

const AdminEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusFilters = ['All', 'Published', 'Draft'];

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents = await fetchEvents();

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
              organizerName: organizerName,
              organizerEmail: organizerEmail,
              date: formatDate(event.start_date, 'MMM dd, yyyy'),
              venue: event.venue,
              capacity: event.capacity,
              status: event.status,
              submittedDate: formatDate(event.start_date, 'MMM dd, yyyy'),
              description: event.description,
              created_by: event.created_by,
            };
          })
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

  const handleApprove = async (eventId: string) => {
    alert('Approve event endpoint not yet implemented');
  };

  const handleReject = async (eventId: string) => {
    alert('Reject event endpoint not yet implemented');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: events.length,
    published: events.filter(e => e.status === 'Published').length,
    draft: events.filter(e => e.status === 'Draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Event Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage all events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
            <Calendar className="w-12 h-12 text-primary-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Draft</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <Calendar className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events or organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Event Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Organizer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Capacity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">Loading events...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-red-500 dark:text-red-400">{error}</td>
                </tr>
              )}
              {!loading && !error && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">No events found.</td>
                </tr>
              )}
              {!loading && !error && filteredEvents.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{event.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.venue}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-gray-100">{event.organizerName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.organizerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{event.date}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{event.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedEvent(null)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative"
          >
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{selectedEvent.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedEvent.description}</p>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />Date
                </span>
                <span className="text-gray-900 dark:text-gray-100">{selectedEvent.date}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-2" />Venue
                </span>
                <span className="text-gray-900 dark:text-gray-100">{selectedEvent.venue}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                  <Users className="w-4 h-4 mr-2" />Capacity
                </span>
                <span className="text-gray-900 dark:text-gray-100">{selectedEvent.capacity}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />Organizer
                </span>
                <span className="text-gray-900 dark:text-gray-100">{selectedEvent.organizerName}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;