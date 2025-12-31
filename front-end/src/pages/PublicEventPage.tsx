// src/pages/PublicEventPage.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Mic2, DollarSign, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { fetchEventById, fetchSessionsForEvent, fetchUserById, createAttendee } from '../services/api.service';
import { formatDate, formatTime } from '../utils/helpers';
import { EventResponseDto } from '../models/event';
import { SessionResponseDto } from '../models/session';

interface SessionWithDetails extends SessionResponseDto {
  speakerName?: string;
  formattedStartTime?: string;
  formattedEndTime?: string;
  day?: number;
}

const PublicEventPage: React.FC = () => {
  const { eventId } = useParams();
  const [selectedTicket, setSelectedTicket] = useState<'free' | 'paid' | 'vip'>('paid');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [eventData, setEventData] = useState<EventResponseDto | null>(null);
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizerName, setOrganizerName] = useState('Unknown');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    dietaryRestrictions: '',
    specialRequests: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!eventId) {
          setError('Event ID not found');
          return;
        }

        // Fetch event details
        const event = await fetchEventById(eventId);
        setEventData(event);

        // Fetch organizer details
        try {
          const organizer = await fetchUserById(event.created_by);
          setOrganizerName(organizer.name);
        } catch (err) {
          console.warn('Could not fetch organizer details');
        }

        // Fetch sessions for this event
        const fetchedSessions = await fetchSessionsForEvent(eventId);

        // Enrich sessions with speaker names and formatted times
        const sessionsWithDetails = await Promise.all(
          fetchedSessions.map(async (session) => {
            let speakerName = 'Unknown Speaker';
            try {
              const speaker = await fetchUserById(session.speaker_id);
              speakerName = speaker.name;
            } catch (err) {
              console.warn(`Could not fetch speaker details for speaker ${session.speaker_id}`);
            }

            // Calculate day number
            const day = Math.ceil(
              (new Date(session.start_time).getTime() - new Date(event.start_date).getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;

            return {
              ...session,
              speakerName,
              formattedStartTime: formatTime(session.start_time, 'hh:mm a'),
              formattedEndTime: formatTime(session.end_time, 'hh:mm a'),
              day,
            };
          })
        );

        setSessions(sessionsWithDetails);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Create attendee record via API when registration endpoint is available
      // await createAttendee({
      //   event_id: eventData?.event_id,
      //   user_id: currentUser.user_id,
      //   ticket_type: selectedTicket,
      //   check_in_status: false,
      // });
      console.log('Registration submitted:', { ...formData, ticketType: selectedTicket });
      alert('Registration successful!');
      setShowRegistrationForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        dietaryRestrictions: '',
        specialRequests: '',
      });
    } catch (err) {
      alert('Failed to register. Please try again.');
      console.error('Registration error:', err);
    }
  };

  const getTicketColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'border-gray-400 hover:border-gray-600';
      case 'paid':
        return 'border-blue-400 hover:border-blue-600';
      case 'vip':
        return 'border-purple-400 hover:border-purple-600';
      default:
        return 'border-gray-400';
    }
  };

  const getTicketBgColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'bg-gray-100 dark:bg-gray-800';
      case 'paid':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'vip':
        return 'bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'bg-gray-100';
    }
  };

  // Mock ticket data - replace when backend has ticket information
  const mockTickets = {
    free: {
      price: 0,
      capacity: 50,
      remaining: 12,
      benefits: ['Access to keynote sessions', 'Event materials', 'Networking sessions'],
    },
    paid: {
      price: 149,
      capacity: 400,
      remaining: 56,
      benefits: ['All Free benefits', 'Workshop access', 'Lunch included', 'Certificate of attendance'],
    },
    vip: {
      price: 299,
      capacity: 50,
      remaining: 12,
      benefits: ['All Paid benefits', 'VIP lounge access', 'Priority seating', 'Meet & greet with speakers', 'Exclusive networking dinner'],
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading event details...</p>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600 dark:text-red-400">{error || 'Event not found'}</p>
      </div>
    );
  }

  const registeredCount = Math.floor(eventData.capacity * 0.86); // Mock: ~86% capacity
  const totalDays = Math.ceil(
    (new Date(eventData.end_date).getTime() - new Date(eventData.start_date).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  // Group sessions by day
  const sessionsByDay = sessions.reduce((acc, session) => {
    if (!acc[session.day || 1]) {
      acc[session.day || 1] = [];
    }
    acc[session.day || 1].push(session);
    return acc;
  }, {} as Record<number, SessionWithDetails[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-pattern"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              {eventData.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl mb-6 text-gray-100"
            >
              {eventData.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6 text-lg"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6" />
                <span>{formatDate(eventData.start_date, 'MMM dd')} - {formatDate(eventData.end_date, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-6 h-6" />
                <span>{eventData.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>{eventData.capacity} capacity</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {eventData.description}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Organizer</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{organizerName}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">{eventData.status}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{totalDays} days</p>
                </div>
              </div>
            </motion.div>

            {/* Agenda */}
            {sessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Event Schedule</h2>
                <div className="space-y-6">
                  {Object.entries(sessionsByDay)
                    .sort(([dayA], [dayB]) => Number(dayA) - Number(dayB))
                    .map(([day, daySessions]) => (
                      <div key={day}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          Day {day}
                        </h3>
                        <div className="space-y-3">
                          {daySessions
                            .sort((a, b) => a.start_time.localeCompare(b.start_time))
                            .map((session) => (
                              <div key={session.session_id} className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0 w-24 text-sm font-medium text-primary-600 dark:text-primary-400">
                                  {session.formattedStartTime}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{session.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{session.description}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    <span className="flex items-center">
                                      <Mic2 className="w-4 h-4 mr-1" />
                                      {session.speakerName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Registration */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Register Now</h3>

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Availability</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {eventData.capacity - registeredCount} spots left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                      style={{ width: `${(registeredCount / eventData.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Ticket Selection */}
                <div className="space-y-4 mb-6">
                  {Object.entries(mockTickets).map(([type, details]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTicket(type as any)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedTicket === type
                          ? `${getTicketBgColor(type)} border-primary-500 shadow-md`
                          : `bg-white dark:bg-gray-800 ${getTicketColor(type)}`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 capitalize">{type} Ticket</h4>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {details.price === 0 ? 'Free' : `$${details.price}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {details.remaining} / {details.capacity}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">remaining</p>
                        </div>
                      </div>
                      <ul className="space-y-1 mt-3">
                        {details.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                {/* Register Button */}
                {!showRegistrationForm ? (
                  <button
                    onClick={() => setShowRegistrationForm(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Continue to Registration
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Registration Form</h4>
                    <form onSubmit={handleSubmitRegistration} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                          required
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100 text-sm"
                      />

                      {mockTickets[selectedTicket].price > 0 && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">Payment</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              ${mockTickets[selectedTicket].price}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                          >
                            Proceed to Payment (Mock)
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            Mock payment - No actual charge
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowRegistrationForm(false)}
                          className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                        >
                          Complete
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventPage;