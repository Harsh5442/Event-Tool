import React, { useState } from 'react';
import { Calendar, Search, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  name: string;
  organizerName: string;
  organizerEmail: string;
  date: string;
  venue: string;
  capacity: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Live' | 'Completed';
  submittedDate: string;
  description: string;
}

const AdminEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Pending Approval');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events: Event[] = [
    {
      id: '1',
      name: 'Tech Summit 2024',
      organizerName: 'John Organizer',
      organizerEmail: 'john@example.com',
      date: 'Jan 15-17, 2024',
      venue: 'Convention Center',
      capacity: 500,
      status: 'Pending Approval',
      submittedDate: '2024-01-05',
      description: 'A comprehensive 3-day technology conference covering AI, Cloud, and DevOps.',
    },
    {
      id: '2',
      name: 'AI Conference',
      organizerName: 'Sarah Organizer',
      organizerEmail: 'sarah@example.com',
      date: 'Feb 20-22, 2024',
      venue: 'Tech Park',
      capacity: 400,
      status: 'Pending Approval',
      submittedDate: '2024-01-08',
      description: 'Explore the latest advancements in artificial intelligence and machine learning.',
    },
    {
      id: '3',
      name: 'DevOps Workshop',
      organizerName: 'Mike Organizer',
      organizerEmail: 'mike@example.com',
      date: 'Mar 10-12, 2024',
      venue: 'Training Center',
      capacity: 200,
      status: 'Approved',
      submittedDate: '2024-01-02',
      description: 'Hands-on workshop for DevOps best practices and tools.',
    },
    {
      id: '4',
      name: 'Security Summit',
      organizerName: 'Emily Organizer',
      organizerEmail: 'emily@example.com',
      date: 'Apr 5-7, 2024',
      venue: 'Main Auditorium',
      capacity: 300,
      status: 'Rejected',
      submittedDate: '2024-01-03',
      description: 'Cybersecurity conference with industry experts.',
    },
  ];

  const handleApprove = (eventId: string) => {
    console.log('Approving event:', eventId);
    // Update event status to Approved
  };

  const handleReject = (eventId: string) => {
    console.log('Rejecting event:', eventId);
    // Update event status to Rejected
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Live':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Pending Approval':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'Rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'Completed':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pendingApproval: events.filter(e => e.status === 'Pending Approval').length,
    approved: events.filter(e => e.status === 'Approved').length,
    rejected: events.filter(e => e.status === 'Rejected').length,
    total: events.length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Event Approval</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Review and approve event submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.pendingApproval}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
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
              placeholder="Search events or organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100"
            >
              <option>All</option>
              <option>Pending Approval</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Live</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Event Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Organizer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Capacity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Submitted</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{event.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.venue}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-gray-100">{event.organizerName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.organizerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{event.date}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{event.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{event.submittedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </button>
                      {event.status === 'Pending Approval' && (
                        <>
                          <button
                            onClick={() => handleApprove(event.id)}
                            className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </button>
                          <button
                            onClick={() => handleReject(event.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </>
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

export default AdminEvents;