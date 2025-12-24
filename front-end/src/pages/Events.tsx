import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Bookmark, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const Events: React.FC = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  const timeFilters = [
    'All', 'Today', 'Tomorrow', 'This Week', 'This Weekend', 
    'Next Week', 'This Month', 'Next Month'
  ];

  const categoryFilters = [
    'All', 'Workshop', 'Conference', 'Training', 'Seminar', 
    'Webinar', 'Networking', 'Other'
  ];

  const events = [
    {
      id: 1,
      title: 'Tech Summit 2024',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
      date: 'Jan 15, 2024',
      time: 'Fri, 9:00 AM',
      duration: '3 days',
      participants: 450,
      remaining: 50,
      location: 'Conference Hall A',
      status: 'upcoming',
      category: 'Conference',
    },
    {
      id: 2,
      title: 'AI & Machine Learning Workshop',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500',
      date: 'Feb 20, 2024',
      time: 'Sat, 10:30 AM',
      duration: '3 days',
      participants: 320,
      remaining: 80,
      location: 'Training Room 2',
      status: 'upcoming',
      category: 'Workshop',
    },
    {
      id: 3,
      title: 'DevOps Best Practices',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500',
      date: 'Mar 10, 2024',
      time: 'Sun, 2:00 PM',
      duration: '3 days',
      participants: 180,
      remaining: 120,
      location: 'Virtual',
      status: 'planning',
      category: 'Training',
    },
    {
      id: 4,
      title: 'Cloud Architecture Seminar',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
      date: 'Mar 25, 2024',
      time: 'Mon, 1:00 PM',
      duration: '3 days',
      participants: 200,
      remaining: 0,
      location: 'Auditorium',
      status: 'full',
      category: 'Seminar',
    },
    {
      id: 5,
      title: 'Agile Development Bootcamp',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500',
      date: 'Apr 5, 2024',
      time: 'Fri, 9:00 AM',
      duration: '3 days',
      participants: 150,
      remaining: 30,
      location: 'Building B',
      status: 'upcoming',
      category: 'Workshop',
    },
    {
      id: 6,
      title: 'Cybersecurity Conference 2024',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500',
      date: 'Apr 18, 2024',
      time: 'Thu, 11:00 AM',
      duration: '3 days',
      participants: 500,
      remaining: 25,
      location: 'Main Hall',
      status: 'upcoming',
      category: 'Conference',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Explore Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Discover and manage all your events</p>
        </div>
      </div>

      {/* Time Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
                activeTimeFilter === filter
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categoryFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveCategoryFilter(filter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
                activeCategoryFilter === filter
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Bookmark Button */}
              <button className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 hover:text-white transition-colors duration-200">
                <Bookmark className="w-5 h-5" />
              </button>
              {/* Status Badge */}
              <div className="absolute bottom-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'upcoming' 
                    ? 'bg-primary-500 text-white'
                    : event.status === 'full'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}>
                  {event.status === 'full' ? 'SOLD OUT' : event.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                {event.title}
              </h3>

              {/* Price/Category */}
              <div className="mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {event.category}
                </span>
                {event.remaining > 0 && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    • {event.remaining} spots left
                  </span>
                )}
              </div>

              {/* Date & Time */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{event.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{event.participants} participants</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200">
                  View Details
                </button>
                <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Events;