import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Bookmark, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  remainingSeats: number;
  totalSeats: number;
  image: string;
  description: string;
  status: 'upcoming' | 'saved' | 'suggested';
  category: string;
  startTime: string;
  endTime: string;
  speakers: string[];
  isTrending?: boolean;
  schedule?: { day: number; sessions: any[] }[];
}

const ParticipantHome: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [savedEvents, setSavedEvents] = useState<string[]>(['2', '5']);

  const upcomingEvents: Event[] = [
    {
      id: '1',
      name: 'Tech Summit 2024',
      date: 'Jan 15-17, 2024',
      venue: 'Convention Center',
      remainingSeats: 50,
      totalSeats: 500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
      description: 'Join us for three days of inspiring talks and workshops on cutting-edge technology topics including AI, Cloud Computing, and DevOps.',
      status: 'upcoming',
      category: 'Technology',
      startTime: '09:00 AM',
      endTime: '06:00 PM',
      speakers: ['Dr. Sarah Johnson', 'John Doe', 'Emily Davis'],
      isTrending: true,
      schedule: [
        { 
          day: 1, 
          sessions: [
            { time: '09:00 AM', title: 'Opening Keynote: Future of AI', speaker: 'Dr. Sarah Johnson', room: 'Main Hall' },
            { time: '11:00 AM', title: 'Workshop: React Best Practices', speaker: 'John Doe', room: 'Room A' },
            { time: '02:00 PM', title: 'Panel: Cloud Architecture', speaker: 'Multiple Speakers', room: 'Room B' },
          ] 
        },
        { 
          day: 2, 
          sessions: [
            { time: '09:00 AM', title: 'Microservices at Scale', speaker: 'Emily Davis', room: 'Main Hall' },
            { time: '11:00 AM', title: 'Docker & Kubernetes', speaker: 'Robert Smith', room: 'Room A' },
          ] 
        },
        { 
          day: 3, 
          sessions: [
            { time: '09:00 AM', title: 'Advanced TypeScript', speaker: 'Lisa Anderson', room: 'Room A' },
            { time: '11:30 AM', title: 'Closing Keynote', speaker: 'Dr. James Wilson', room: 'Main Hall' },
          ] 
        },
      ],
    },
  ];

  const savedEventsList: Event[] = [
    {
      id: '2',
      name: 'AI Conference 2024',
      date: 'Feb 20-22, 2024',
      venue: 'Tech Park',
      remainingSeats: 80,
      totalSeats: 400,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500',
      description: 'Explore the latest in artificial intelligence and machine learning with industry experts.',
      status: 'saved',
      category: 'AI',
      startTime: '10:00 AM',
      endTime: '05:00 PM',
      speakers: ['Emily Davis', 'Dr. Alan Turing'],
      schedule: [
        { 
          day: 1, 
          sessions: [
            { time: '10:00 AM', title: 'AI Fundamentals', speaker: 'Emily Davis', room: 'Hall A' },
          ] 
        },
      ],
    },
  ];

  const suggestedEvents: Event[] = [
    {
      id: '3',
      name: 'DevOps Workshop',
      date: 'Mar 10-12, 2024',
      venue: 'Training Center',
      remainingSeats: 120,
      totalSeats: 200,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500',
      description: 'Master DevOps practices with hands-on sessions covering CI/CD, automation, and cloud infrastructure.',
      status: 'suggested',
      category: 'Technology',
      startTime: '09:00 AM',
      endTime: '04:00 PM',
      speakers: ['Mike Chen'],
      isTrending: true,
      schedule: [
        { 
          day: 1, 
          sessions: [
            { time: '09:00 AM', title: 'DevOps Introduction', speaker: 'Mike Chen', room: 'Lab 1' },
          ] 
        },
      ],
    },
  ];

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleRegister = (eventId: string) => {
    console.log('Registering for event:', eventId);
    alert(`Registration for event ${eventId} initiated!`);
    setSelectedEvent(null);
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

      <div className="relative h-40 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveEvent(event.id);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 hover:text-white transition-colors duration-200 z-10"
        >
          <Bookmark
            className={`w-5 h-5 ${savedEvents.includes(event.id) ? 'fill-current text-primary-500 hover:text-white' : ''}`}
          />
        </button>
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
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span>{event.remainingSeats} seats remaining</span>
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Discover and register for amazing events</p>
      </div>

      {/* Upcoming Registered Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Saved Events */}
      {savedEventsList.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Saved Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEventsList.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Events */}
      {suggestedEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Suggested For You
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              Based on your interests
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedEvent(null)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-20 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
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
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">About</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedEvent.description}</p>
                  </div>

                  {/* Speakers */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Speakers</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedEvent.speakers.map((speaker, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg font-medium"
                        >
                          {speaker}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Schedule</h3>
                      <div className="space-y-4">
                        {selectedEvent.schedule.map(day => (
                          <div key={day.day} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Day {day.day}</h4>
                            <div className="space-y-2">
                              {day.sessions.map((session, idx) => (
                                <div key={idx} className="flex items-start space-x-4 text-sm">
                                  <span className="font-medium text-primary-600 dark:text-primary-400 w-24 flex-shrink-0">
                                    {session.time}
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">{session.title}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{session.speaker} • {session.room}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Availability</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedEvent.remainingSeats} / {selectedEvent.totalSeats} seats
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                        style={{
                          width: `${((selectedEvent.totalSeats - selectedEvent.remainingSeats) / selectedEvent.totalSeats) * 100}%`,
                        }}
                      />
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
                    className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
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