import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Mic2, DollarSign, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const PublicEventPage: React.FC = () => {
  const { eventId } = useParams();
  const [selectedTicket, setSelectedTicket] = useState<'free' | 'paid' | 'vip'>('paid');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    dietaryRestrictions: '',
    specialRequests: '',
  });

  // Mock event data - will come from API based on eventId
  const eventData = {
    id: eventId,
    name: 'Tech Summit 2024',
    tagline: 'Shaping the Future of Technology',
    description: 'Join us for three days of inspiring talks, hands-on workshops, and networking opportunities with industry leaders. Explore the latest trends in AI, Cloud Computing, DevOps, and more.',
    date: 'January 15-17, 2024',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    time: '9:00 AM - 6:00 PM',
    location: 'Grand Convention Center, San Francisco',
    venue: 'Main Conference Hall',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    totalCapacity: 500,
    registeredCount: 432,
    status: 'open',
    tickets: {
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
    },
    agenda: [
      {
        day: 1,
        date: 'January 15, 2024',
        sessions: [
          { time: '09:00 AM', title: 'Opening Keynote: Future of AI', speaker: 'Dr. Sarah Johnson', room: 'Main Hall' },
          { time: '11:00 AM', title: 'Workshop: React Best Practices', speaker: 'John Doe', room: 'Room A' },
          { time: '02:00 PM', title: 'Panel: Cloud Architecture Trends', speaker: 'Multiple Speakers', room: 'Room B' },
        ],
      },
      {
        day: 2,
        date: 'January 16, 2024',
        sessions: [
          { time: '09:00 AM', title: 'Keynote: Microservices at Scale', speaker: 'Emily Davis', room: 'Main Hall' },
          { time: '11:00 AM', title: 'Workshop: Docker & Kubernetes', speaker: 'Robert Smith', room: 'Room A' },
          { time: '02:00 PM', title: 'Panel: Security in Modern Apps', speaker: 'Security Experts', room: 'Room B' },
        ],
      },
      {
        day: 3,
        date: 'January 17, 2024',
        sessions: [
          { time: '09:00 AM', title: 'Workshop: Advanced TypeScript', speaker: 'Lisa Anderson', room: 'Room A' },
          { time: '11:30 AM', title: 'Closing Keynote: The Road Ahead', speaker: 'Dr. James Wilson', room: 'Main Hall' },
        ],
      },
    ],
    speakers: [
      { name: 'Dr. Sarah Johnson', title: 'Chief AI Scientist', company: 'TechCorp', image: '' },
      { name: 'John Doe', title: 'Senior Frontend Architect', company: 'DevStudio', image: '' },
      { name: 'Emily Davis', title: 'Cloud Solutions Architect', company: 'CloudTech', image: '' },
    ],
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', { ...formData, ticketType: selectedTicket });
    // Handle registration logic
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventData.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
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
              className="text-2xl mb-6 text-gray-200"
            >
              {eventData.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6 text-lg"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6" />
                <span>{eventData.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6" />
                <span>{eventData.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-6 h-6" />
                <span>{eventData.location}</span>
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
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {eventData.description}
              </p>
            </motion.div>

            {/* Agenda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Event Agenda</h2>
              <div className="space-y-6">
                {eventData.agenda.map((day) => (
                  <div key={day.day}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Day {day.day} - {day.date}
                    </h3>
                    <div className="space-y-3">
                      {day.sessions.map((session, idx) => (
                        <div key={idx} className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-shrink-0 w-24 text-sm font-medium text-primary-600 dark:text-primary-400">
                            {session.time}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{session.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span className="flex items-center">
                                <Mic2 className="w-4 h-4 mr-1" />
                                {session.speaker}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {session.room}
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

            {/* Speakers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Featured Speakers</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {eventData.speakers.map((speaker, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                      {speaker.name.charAt(0)}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{speaker.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{speaker.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{speaker.company}</p>
                  </div>
                ))}
              </div>
            </motion.div>
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
                      {eventData.totalCapacity - eventData.registeredCount} spots left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                      style={{ width: `${(eventData.registeredCount / eventData.totalCapacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Ticket Selection */}
                <div className="space-y-4 mb-6">
                  {Object.entries(eventData.tickets).map(([type, details]) => (
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

                      {eventData.tickets[selectedTicket].price > 0 && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">Payment</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              ${eventData.tickets[selectedTicket].price}
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