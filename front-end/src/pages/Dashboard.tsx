import React from 'react';
import { Calendar, Users, Mic2, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Events',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Participants',
      value: '1,234',
      change: '+23%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Speakers',
      value: '56',
      change: '+8%',
      trend: 'up',
      icon: Mic2,
      color: 'from-green-500 to-teal-500',
    },
    {
      label: 'Engagement',
      value: '87%',
      change: '-3%',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: 'Tech Summit 2024',
      date: 'Jan 15-17, 2024',
      participants: 450,
      status: 'upcoming',
    },
    {
      id: 2,
      name: 'AI Conference',
      date: 'Feb 20-22, 2024',
      participants: 320,
      status: 'upcoming',
    },
    {
      id: 3,
      name: 'DevOps Workshop',
      date: 'Mar 10-12, 2024',
      participants: 180,
      status: 'planning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2 space-x-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Upcoming Events</h2>
        </div>
        <div className="p-6 space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{event.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{event.participants}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'upcoming' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;