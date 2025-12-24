import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Mic2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AllocatedEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  sessions: { time: string; title: string; room: string }[];
  status: 'pending' | 'accepted' | 'rejected';
  organizerName: string;
  organizerEmail: string;
}

const SpeakerEvents: React.FC = () => {
  const [events, setEvents] = useState<AllocatedEvent[]>([
    {
      id: '1',
      name: 'Tech Summit 2024',
      date: 'Jan 15-17, 2024',
      venue: 'Convention Center',
      sessions: [
        { time: '09:00 AM', title: 'Opening Keynote: Future of AI', room: 'Main Hall' },
        { time: '02:00 PM', title: 'Workshop: AI Best Practices', room: 'Room A' },
      ],
      status: 'pending',
      organizerName: 'John Organizer',
      organizerEmail: 'john@example.com',
    },
    {
      id: '2',
      name: 'AI Conference 2024',
      date: 'Feb 20-22, 2024',
      venue: 'Tech Park',
      sessions: [
        { time: '11:00 AM', title: 'Panel Discussion: AI Ethics', room: 'Main Stage' },
      ],
      status: 'accepted',
      organizerName: 'Sarah Organizer',
      organizerEmail: 'sarah@example.com',
    },
  ]);

  const handleAccept = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'accepted' as const } : e));
  };

  const handleReject = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'rejected' as const } : e));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Allocated Events</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Events where you are invited to speak</p>
      </div>

      <div className="grid gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.name}</h3>
                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                {event.status.toUpperCase()}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Your Sessions:</h4>
              <div className="space-y-2">
                {event.sessions.map((session, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{session.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{session.time} • {session.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Organized by <span className="font-medium text-gray-900 dark:text-gray-100">{event.organizerName}</span>
              </div>
              {event.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(event.id)}
                    className="flex items-center space-x-2 px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleAccept(event.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Check className="w-5 h-5" />
                    <span>Accept</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpeakerEvents;