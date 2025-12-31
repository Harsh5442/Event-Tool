// src/pages/OrganizerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Mic2, TrendingUp, ArrowUpRight, ThumbsUp, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, fetchAttendeesForEvent, fetchSessionsForEvent } from '../services/api.service';

interface MyEvent {
  event_id: number;
  name: string;
  status: string;
  participants: number;
  speakers: number;
  date: string;
  startDate: string;
  description: string;
}

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock engagement metrics
  const engagementMetrics = {
    participantSatisfaction: 92,
    speakerRatings: 4.8,
    sessionAttendance: 87,
    networkingScore: 85,
  };

  const successfulEvents = [
    { name: 'Cloud Architecture Summit', participants: 520, rating: 4.9, feedback: 'Outstanding!' },
    { name: 'React Developer Conference', participants: 480, rating: 4.8, feedback: 'Very well organized' },
    { name: 'Security Workshop', participants: 390, rating: 4.7, feedback: 'Excellent content' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.user_id) return;

        // Fetch all events
        const allEvents = await fetchEvents();

        // Filter events created by this organizer
        const organizerEvents = allEvents.filter(e => e.created_by === user.user_id);

        // Enrich events with attendee and session counts
        const eventsWithDetails = await Promise.all(
          organizerEvents.map(async (event) => {
            let participants = 0;
            let speakers = 0;

            try {
              const attendees = await fetchAttendeesForEvent(event.event_id);
              participants = attendees.length;
            } catch (err) {
              console.warn(`Could not fetch attendees for event ${event.event_id}`);
            }

            try {
              const sessions = await fetchSessionsForEvent(event.event_id);
              speakers = new Set(sessions.map(s => s.speaker_id)).size;
            } catch (err) {
              console.warn(`Could not fetch sessions for event ${event.event_id}`);
            }

            return {
              event_id: event.event_id,
              name: event.name,
              status: event.status === 'Published' ? 'Approved' : event.status,
              participants,
              speakers,
              date: new Date(event.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
              startDate: event.start_date,
              description: event.description,
            };
          })
        );

        setMyEvents(eventsWithDetails);
      } catch (err) {
        setError('Failed to load organizer data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const stats = {
    eventsCreated: myEvents.length,
    totalParticipants: myEvents.reduce((sum, e) => sum + e.participants, 0),
    totalSpeakers: new Set(myEvents.flatMap(e => e.speakers)).size,
    avgEngagement: 87,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Organizer Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor your events and engagement</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +15%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.eventsCreated}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Events Created</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +28%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalParticipants.toLocaleString()}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Participants</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSpeakers}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Speakers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +5%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.avgEngagement}%</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Avg Engagement</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Events */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">My Events</h3>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400">{error}</p>
          ) : myEvents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No events created yet</p>
          ) : (
            <div className="space-y-4">
              {myEvents.map((event, index) => (
                <motion.div
                  key={event.event_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'Approved'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Participants</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{event.participants}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Speakers</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{event.speakers}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Engagement</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">87%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Most Successful Events */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Most Successful Events</h3>
          <div className="space-y-4">
            {successfulEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.name}</h4>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{event.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{event.participants} participants</span>
                  <span className="italic text-gray-600 dark:text-gray-400">"{event.feedback}"</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Engagement Metrics</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Participant Satisfaction</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{engagementMetrics.participantSatisfaction}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                style={{ width: `${engagementMetrics.participantSatisfaction}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Speaker Ratings</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{engagementMetrics.speakerRatings}/5</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                style={{ width: `${(engagementMetrics.speakerRatings / 5) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Session Attendance</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{engagementMetrics.sessionAttendance}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                style={{ width: `${engagementMetrics.sessionAttendance}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Networking Score</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{engagementMetrics.networkingScore}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                style={{ width: `${engagementMetrics.networkingScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;