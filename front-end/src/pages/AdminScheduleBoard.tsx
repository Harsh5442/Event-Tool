import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  name: string;
  date: string;
  status: string;
}

interface Session {
  id: string;
  eventId: string;
  eventName: string;
  day: number;
  title: string;
  speaker: string;
  startTime: string;
  endTime: string;
  room: string;
  attendees: number;
  type: 'workshop' | 'keynote' | 'panel' | 'breakout';
}

const AdminScheduleBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [activeDay, setActiveDay] = useState(1);

  const events: Event[] = [
    { id: '1', name: 'Tech Summit 2024', date: 'Jan 15-17, 2024', status: 'Approved' },
    { id: '2', name: 'AI Conference', date: 'Feb 20-22, 2024', status: 'Approved' },
    { id: '3', name: 'DevOps Workshop', date: 'Mar 10-12, 2024', status: 'Approved' },
  ];

  const allSessions: Session[] = [
    {
      id: '1-1',
      eventId: '1',
      eventName: 'Tech Summit 2024',
      day: 1,
      title: 'Opening Keynote: Future of AI',
      speaker: 'Dr. Sarah Johnson',
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      room: 'Main Hall',
      attendees: 450,
      type: 'keynote',
    },
    {
      id: '1-2',
      eventId: '1',
      eventName: 'Tech Summit 2024',
      day: 1,
      title: 'Workshop: React Best Practices',
      speaker: 'John Doe',
      startTime: '11:00 AM',
      endTime: '12:30 PM',
      room: 'Room A',
      attendees: 80,
      type: 'workshop',
    },
    {
      id: '2-1',
      eventId: '2',
      eventName: 'AI Conference',
      day: 1,
      title: 'Machine Learning Fundamentals',
      speaker: 'Emily Davis',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      room: 'Conference Hall',
      attendees: 320,
      type: 'workshop',
    },
    {
      id: '1-3',
      eventId: '1',
      eventName: 'Tech Summit 2024',
      day: 2,
      title: 'Cloud Architecture Panel',
      speaker: 'Multiple Speakers',
      startTime: '02:00 PM',
      endTime: '03:30 PM',
      room: 'Room B',
      attendees: 120,
      type: 'panel',
    },
  ];

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent === 'all' || session.eventId === selectedEvent;
    const matchesDay = session.day === activeDay;
    
    return matchesSearch && matchesEvent && matchesDay;
  });

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-400';
      case 'workshop':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400';
      case 'panel':
        return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400';
      case 'breakout':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-700 dark:text-orange-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 border-gray-500 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Schedule Board</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Search and view all event schedules</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by event, session, speaker, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex space-x-2">
          {[1, 2, 3].map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeDay === day
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredSessions.length}</span> sessions
        </p>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-800 text-center">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No sessions found matching your search</p>
          </div>
        ) : (
          filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-l-4 ${getSessionTypeColor(session.type)} bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{session.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSessionTypeColor(session.type)}`}>
                      {session.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      {session.eventName}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="text-sm">{session.startTime} - {session.endTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-sm">{session.room}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="w-5 h-5 mr-2" />
                      <span className="text-sm">{session.attendees} attendees</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="text-sm font-medium">Speaker: {session.speaker}</span>
                    </div>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminScheduleBoard;