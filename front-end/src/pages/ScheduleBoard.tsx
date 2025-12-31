// src/pages/ScheduleBoard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchAllSessions, fetchEvents, fetchUserById } from '../services/api.service';
import { formatTime, calculateDayNumber } from '../utils/helpers';
import { SessionResponseDto } from '../models/session';
import { EventResponseDto } from '../models/event';

interface Session extends SessionResponseDto {
  eventName?: string;
  speakerName?: string;
  formattedStartTime?: string;
  formattedEndTime?: string;
  day?: number;
}

const ScheduleBoard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<EventResponseDto[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Fetch all sessions
        const fetchedSessions = await fetchAllSessions();

        // Enrich sessions with event names and speaker names
        const sessionsWithDetails = await Promise.all(
          fetchedSessions.map(async (session) => {
            let eventName = 'Unknown Event';
            let speakerName = 'Unknown Speaker';

            try {
              const event = fetchedEvents.find(e => e.event_id === session.event_id);
              if (event) {
                eventName = event.name;
              }
            } catch (err) {
              console.warn(`Could not find event for session ${session.session_id}`);
            }

            try {
              const speaker = await fetchUserById(session.speaker_id);
              speakerName = speaker.name;
            } catch (err) {
              console.warn(`Could not fetch speaker details for speaker ${session.speaker_id}`);
            }

            // Calculate day number based on event start date
            let day = 1;
            const event = fetchedEvents.find(e => e.event_id === session.event_id);
            if (event) {
              day = calculateDayNumber(event.start_date, session.start_time);
            }

            return {
              ...session,
              eventName,
              speakerName,
              formattedStartTime: formatTime(session.start_time, 'hh:mm a'),
              formattedEndTime: formatTime(session.end_time, 'hh:mm a'),
              day,
            };
          })
        );

        setSessions(sessionsWithDetails);
      } catch (err) {
        setError('Failed to load schedule. Please try again later.');
        console.error('Error loading schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter sessions by selected event and day
  const filteredSessions = sessions.filter(
    session => (!selectedEventId || session.event_id === selectedEventId) && session.day === selectedDay
  );

  // Get unique days for selected event
  const uniqueDays = selectedEventId
  ? Array.from(new Set(sessions.filter(s => s.event_id === selectedEventId).map(s => s.day)))
  : [];

  const selectedEventData = events.find(e => e.event_id === selectedEventId);
  const dayCount = selectedEventData
    ? Math.ceil((new Date(selectedEventData.end_date).getTime() - new Date(selectedEventData.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Event Schedule</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View sessions and schedules</p>
      </div>

      {/* Event Selection */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Event</label>
        <select
          value={selectedEventId || ''}
          onChange={(e) => {
            setSelectedEventId(Number(e.target.value));
            setSelectedDay(1);
          }}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
        >
          {events.map(event => (
            <option key={event.event_id} value={event.event_id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Day Navigation */}
      {selectedEventData && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Day {selectedDay} of {dayCount}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                disabled={selectedDay === 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedDay(Math.min(dayCount, selectedDay + 1))}
                disabled={selectedDay === dayCount}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Buttons */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: dayCount }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedDay === day
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading / Error State */}
      {loading && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading schedule...
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Sessions List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No sessions scheduled for this day.
            </div>
          ) : (
            filteredSessions
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((session, index) => (
                <motion.div
                  key={session.session_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {session.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {session.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{session.formattedStartTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{session.speakerName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{session.eventName}</span>
                        </div>
                      </div>
                    </div>

                    <button className="ml-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200">
                      Add to Calendar
                    </button>
                  </div>
                </motion.div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleBoard;