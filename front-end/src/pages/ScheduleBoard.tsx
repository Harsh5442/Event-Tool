import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getRolePermissions } from '../utils/permissions';

interface Session {
  id: string;
  title: string;
  speaker: string;
  startTime: string;
  endTime: string;
  room: string;
  attendees: number;
  type: 'workshop' | 'keynote' | 'panel' | 'breakout';
}

interface DaySchedule {
  day: number;
  date: string;
  sessions: Session[];
}

const ScheduleBoard: React.FC = () => {
  const { user } = useAuth();
  const permissions = user ? getRolePermissions(user.role) : null;
  const [activeDay, setActiveDay] = useState(1);
  const [draggedSession, setDraggedSession] = useState<string | null>(null);

  const scheduleData: DaySchedule[] = [
    {
      day: 1,
      date: 'January 15, 2024',
      sessions: [
        {
          id: '1-1',
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
          title: 'Workshop: React Best Practices',
          speaker: 'John Doe',
          startTime: '11:00 AM',
          endTime: '12:30 PM',
          room: 'Room A',
          attendees: 80,
          type: 'workshop',
        },
        {
          id: '1-3',
          title: 'Panel: Cloud Architecture Trends',
          speaker: 'Multiple Speakers',
          startTime: '02:00 PM',
          endTime: '03:30 PM',
          room: 'Room B',
          attendees: 120,
          type: 'panel',
        },
        {
          id: '1-4',
          title: 'Breakout: DevOps Tools',
          speaker: 'Mike Chen',
          startTime: '04:00 PM',
          endTime: '05:30 PM',
          room: 'Room C',
          attendees: 60,
          type: 'breakout',
        },
      ],
    },
    {
      day: 2,
      date: 'January 16, 2024',
      sessions: [
        {
          id: '2-1',
          title: 'Keynote: Microservices at Scale',
          speaker: 'Emily Davis',
          startTime: '09:00 AM',
          endTime: '10:30 AM',
          room: 'Main Hall',
          attendees: 420,
          type: 'keynote',
        },
        {
          id: '2-2',
          title: 'Workshop: Docker & Kubernetes',
          speaker: 'Robert Smith',
          startTime: '11:00 AM',
          endTime: '01:00 PM',
          room: 'Room A',
          attendees: 90,
          type: 'workshop',
        },
        {
          id: '2-3',
          title: 'Panel: Security in Modern Apps',
          speaker: 'Security Experts',
          startTime: '02:00 PM',
          endTime: '03:30 PM',
          room: 'Room B',
          attendees: 150,
          type: 'panel',
        },
      ],
    },
    {
      day: 3,
      date: 'January 17, 2024',
      sessions: [
        {
          id: '3-1',
          title: 'Workshop: Advanced TypeScript',
          speaker: 'Lisa Anderson',
          startTime: '09:00 AM',
          endTime: '11:00 AM',
          room: 'Room A',
          attendees: 75,
          type: 'workshop',
        },
        {
          id: '3-2',
          title: 'Closing Keynote: The Road Ahead',
          speaker: 'Dr. James Wilson',
          startTime: '11:30 AM',
          endTime: '01:00 PM',
          room: 'Main Hall',
          attendees: 480,
          type: 'keynote',
        },
        {
          id: '3-3',
          title: 'Networking Session',
          speaker: 'Open',
          startTime: '02:00 PM',
          endTime: '04:00 PM',
          room: 'Lobby',
          attendees: 300,
          type: 'breakout',
        },
      ],
    },
  ];

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

  const handleDragStart = (sessionId: string) => {
    if (permissions?.canDragDropSessions) {
      setDraggedSession(sessionId);
    }
  };

  const handleDragEnd = () => {
    setDraggedSession(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Handle session reordering logic here
    console.log('Session dropped:', draggedSession);
    setDraggedSession(null);
  };

  const currentSchedule = scheduleData.find(d => d.day === activeDay);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Schedule Board</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            3-day event schedule {permissions?.canDragDropSessions && '• Drag & drop to reorder'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tech Summit 2024
          </span>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-2 border border-gray-200 dark:border-gray-800">
        <div className="flex space-x-2">
          {scheduleData.map((schedule) => (
            <button
              key={schedule.day}
              onClick={() => setActiveDay(schedule.day)}
              className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                activeDay === schedule.day
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-lg font-bold">Day {schedule.day}</div>
              <div className="text-sm opacity-90">{schedule.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-6 flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Types:</span>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Keynote</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Workshop</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Panel</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Breakout</span>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {currentSchedule?.date}
          </h2>
          
          <div 
            className="space-y-4"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {currentSchedule?.sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                draggable={permissions?.canDragDropSessions}
                onDragStart={() => handleDragStart(session.id)}
                onDragEnd={handleDragEnd}
                className={`border-l-4 ${getSessionTypeColor(session.type)} bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
                  permissions?.canDragDropSessions ? 'cursor-move' : ''
                } ${draggedSession === session.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {permissions?.canDragDropSessions && (
                        <GripVertical className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {session.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSessionTypeColor(session.type)}`}>
                        {session.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="text-sm">
                          {session.startTime} - {session.endTime}
                        </span>
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

                  {permissions?.canDragDropSessions && (
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBoard;