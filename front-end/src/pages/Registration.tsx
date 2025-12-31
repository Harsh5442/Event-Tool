// src/pages/Registration.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Calendar, Users, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchAllAttendees, fetchAttendeesForEvent, fetchUserById, fetchEvents, checkInAttendee } from '../services/api.service';
import { formatDate } from '../utils/helpers';
import { AttendeeResponseDto } from '../models/attendee';
import { EventResponseDto } from '../models/event';
import { UserResponseDto } from '../models/user';

interface AttendeeWithDetails extends AttendeeResponseDto {
  name?: string;
  email?: string;
  phone?: string;
  eventName?: string;
}

const Registration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState<string>('All');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [attendees, setAttendees] = useState<AttendeeWithDetails[]>([]);
  const [events, setEvents] = useState<EventResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkInFilters = ['All', 'Checked In', 'Pending'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch events
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);

        if (fetchedEvents.length > 0) {
          setSelectedEventId(fetchedEvents[0].event_id);
        }
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fetch attendees when selected event changes
  useEffect(() => {
    const loadAttendees = async () => {
      if (!selectedEventId) return;

      setLoading(true);
      setError(null);
      try {
        const fetchedAttendees = await fetchAttendeesForEvent(selectedEventId);

        // Enrich attendees with user details
        const attendeesWithDetails = await Promise.all(
          fetchedAttendees.map(async (attendee) => {
            let name = 'Unknown';
            let email = 'unknown@example.com';
            let phone = '';

            try {
              const user = await fetchUserById(attendee.user_id);
              name = user.name;
              email = user.email;
              phone = user.phone || '';
            } catch (err) {
              console.warn(`Could not fetch user details for user ${attendee.user_id}`);
            }

            // Get event name
            const event = events.find(e => e.event_id === attendee.event_id);
            const eventName = event?.name || 'Unknown Event';

            return {
              ...attendee,
              name,
              email,
              phone,
              eventName,
            };
          })
        );

        setAttendees(attendeesWithDetails);
      } catch (err) {
        setError('Failed to load attendees. Please try again later.');
        console.error('Error loading attendees:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAttendees();
  }, [selectedEventId, events]);

  const handleCheckIn = async (attendeeId: number) => {
    try {
      await checkInAttendee(attendeeId);
      // Update local state
      setAttendees(prev =>
        prev.map(a => a.attendee_id === attendeeId ? { ...a, check_in_status: true } : a)
      );
      alert('Check-in successful!');
    } catch (err) {
      alert('Failed to check in attendee.');
      console.error('Error checking in attendee:', err);
    }
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCheckIn = filterCheckIn === 'All' ||
                          (filterCheckIn === 'Checked In' && attendee.check_in_status) ||
                          (filterCheckIn === 'Pending' && !attendee.check_in_status);
    return matchesSearch && matchesCheckIn;
  });

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter(a => a.check_in_status).length,
    pending: attendees.filter(a => !a.check_in_status).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Attendee Registration</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage event attendees and check-ins</p>
      </div>

      {/* Event Selection */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Event</label>
        <select
          value={selectedEventId || ''}
          onChange={(e) => setSelectedEventId(Number(e.target.value))}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
        >
          <option value="">Select an event...</option>
          {events.map(event => (
            <option key={event.event_id} value={event.event_id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Attendees</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
            <Users className="w-12 h-12 text-primary-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Checked In</p>
              <p className="text-3xl font-bold text-green-600">{stats.checkedIn}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <XCircle className="w-12 h-12 text-yellow-500 opacity-20" />
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
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCheckIn}
              onChange={(e) => setFilterCheckIn(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            >
              {checkInFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Attendee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Ticket Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">Loading attendees...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-red-500 dark:text-red-400">{error}</td>
                </tr>
              )}
              {!loading && !error && filteredAttendees.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">No attendees found.</td>
                </tr>
              )}
              {!loading && !error && filteredAttendees.map((attendee, index) => (
                <motion.tr
                  key={attendee.attendee_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{attendee.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{attendee.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {attendee.ticket_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {attendee.check_in_status ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-green-600 dark:text-green-400">Checked In</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm text-yellow-600 dark:text-yellow-400">Pending</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      {!attendee.check_in_status && (
                        <button
                          onClick={() => handleCheckIn(attendee.attendee_id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                          Check In
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Registration;