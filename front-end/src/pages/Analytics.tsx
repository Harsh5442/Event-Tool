import React, { useState } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedEvent, setSelectedEvent] = useState('all');

  // Mock data - will be replaced with real API data
  const stats = {
    totalAttendance: 2847,
    attendanceGrowth: 23.5,
    totalRevenue: 45280,
    revenueGrowth: 18.2,
    totalEvents: 24,
    eventsGrowth: 12.0,
    avgRating: 4.7,
    ratingChange: 0.3,
  };

  const attendanceTrend = [
    { month: 'Jan', value: 420 },
    { month: 'Feb', value: 580 },
    { month: 'Mar', value: 720 },
    { month: 'Apr', value: 650 },
    { month: 'May', value: 890 },
    { month: 'Jun', value: 587 },
  ];

  const popularSessions = [
    { name: 'AI & Machine Learning Workshop', attendees: 450, rating: 4.9 },
    { name: 'Cloud Architecture Keynote', attendees: 420, rating: 4.8 },
    { name: 'DevOps Best Practices', attendees: 380, rating: 4.7 },
    { name: 'React Advanced Patterns', attendees: 320, rating: 4.8 },
    { name: 'Cybersecurity Panel', attendees: 280, rating: 4.6 },
  ];

  const topSpeakers = [
    { name: 'Dr. Sarah Johnson', sessions: 5, rating: 4.9, attendees: 1200 },
    { name: 'John Doe', sessions: 8, rating: 4.8, attendees: 1450 },
    { name: 'Emily Davis', sessions: 6, rating: 4.7, attendees: 980 },
    { name: 'Mike Chen', sessions: 4, rating: 4.6, attendees: 720 },
  ];

  const registrationData = [
    { date: '2024-01-01', free: 45, paid: 23, vip: 5 },
    { date: '2024-01-08', free: 67, paid: 34, vip: 8 },
    { date: '2024-01-15', free: 89, paid: 45, vip: 12 },
    { date: '2024-01-22', free: 123, paid: 56, vip: 15 },
    { date: '2024-01-29', free: 145, paid: 67, vip: 18 },
  ];

  const maxValue = Math.max(...attendanceTrend.map(d => d.value));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === 'Admin' ? 'Complete analytics overview' : 'Your events analytics'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-200">
            <Download className="w-5 h-5" />
            <span className="font-medium">Export Report</span>
          </button>
        </div>
      </div>

      {/* Event Filter (Only for Organizers) */}
      {user?.role === 'Organizer' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            >
              <option value="all">All My Events</option>
              <option value="1">Tech Summit 2024</option>
              <option value="2">AI Conference</option>
              <option value="3">DevOps Workshop</option>
            </select>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats.attendanceGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalAttendance.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Attendance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats.revenueGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${stats.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats.eventsGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalEvents}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Events</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats.ratingChange}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.avgRating}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Average Rating</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Attendance Trends</h3>
          <div className="space-y-4">
            {attendanceTrend.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.month}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Registrations Over Time</h3>
          <div className="space-y-4">
            {registrationData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.free + item.paid + item.vip}
                  </span>
                </div>
                <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.free / (item.free + item.paid + item.vip)) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-gray-400"
                    title={`Free: ${item.free}`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.paid / (item.free + item.paid + item.vip)) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-blue-500"
                    title={`Paid: ${item.paid}`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.vip / (item.free + item.paid + item.vip)) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-purple-500"
                    title={`VIP: ${item.vip}`}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Paid</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">VIP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Sessions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Popular Sessions</h3>
          <div className="space-y-4">
            {popularSessions.map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{session.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {session.attendees}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {session.rating}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-300 dark:text-gray-700">
                  #{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Speakers */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Top Rated Speakers</h3>
          <div className="space-y-4">
            {topSpeakers.map((speaker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                    {speaker.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{speaker.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{speaker.sessions} sessions</span>
                      <span>•</span>
                      <span>{speaker.attendees} attendees</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{speaker.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;