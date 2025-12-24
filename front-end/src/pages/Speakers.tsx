import React, { useState } from 'react';
import { Search, Plus, Mic2, Mail, Linkedin, Twitter, Star, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getRolePermissions } from '../utils/permissions';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  bio: string;
  rating: number;
  sessions: number;
  linkedin?: string;
  twitter?: string;
  image?: string;
  expertise: string[];
}

const Speakers: React.FC = () => {
  const { user } = useAuth();
  const permissions = user ? getRolePermissions(user.role) : null;
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const speakers: Speaker[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Chief AI Scientist',
      company: 'TechCorp',
      email: 'sarah.johnson@techcorp.com',
      bio: 'Leading AI researcher with 15+ years of experience in machine learning and neural networks.',
      rating: 4.8,
      sessions: 5,
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: '@sarahjohnson',
      expertise: ['AI', 'Machine Learning', 'Neural Networks'],
    },
    {
      id: '2',
      name: 'John Doe',
      title: 'Senior Frontend Architect',
      company: 'DevStudio',
      email: 'john.doe@devstudio.com',
      bio: 'React expert and open-source contributor specializing in scalable web applications.',
      rating: 4.9,
      sessions: 8,
      linkedin: 'https://linkedin.com/in/johndoe',
      expertise: ['React', 'TypeScript', 'Web Performance'],
    },
    {
      id: '3',
      name: 'Emily Davis',
      title: 'Cloud Solutions Architect',
      company: 'CloudTech',
      email: 'emily.davis@cloudtech.com',
      bio: 'AWS certified architect with expertise in microservices and serverless architectures.',
      rating: 4.7,
      sessions: 6,
      twitter: '@emilydavis',
      expertise: ['AWS', 'Microservices', 'DevOps'],
    },
    {
      id: '4',
      name: 'Mike Chen',
      title: 'DevOps Lead',
      company: 'InfraTech',
      email: 'mike.chen@infratech.com',
      bio: 'Docker and Kubernetes specialist passionate about automation and CI/CD.',
      rating: 4.6,
      sessions: 4,
      linkedin: 'https://linkedin.com/in/mikechen',
      twitter: '@mikechen',
      expertise: ['Docker', 'Kubernetes', 'CI/CD'],
    },
  ];

  const filteredSpeakers = speakers.filter(speaker =>
    speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (id: string) => {
    console.log('Edit speaker:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete speaker:', id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Speakers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === 'Speaker' ? 'Manage your profile and sessions' : 'Manage speaker profiles and assignments'}
          </p>
        </div>
        {permissions?.canManageSpeakers && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Speaker</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search speakers by name, company, or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Speakers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{speakers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {speakers.reduce((sum, s) => sum + s.sessions, 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {(speakers.reduce((sum, s) => sum + s.rating, 0) / speakers.length).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expertise Areas</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {new Set(speakers.flatMap(s => s.expertise)).size}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Speakers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpeakers.map((speaker, index) => (
          <motion.div
            key={speaker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300"
          >
            {/* Speaker Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                  {speaker.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{speaker.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{speaker.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{speaker.company}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {speaker.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {speaker.rating} Rating
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic2 className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {speaker.sessions} Sessions
                </span>
              </div>
            </div>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {speaker.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-semibold"
                >
                  {exp}
                </span>
              ))}
            </div>

            {/* Contact & Social */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <a
                  href={`mailto:${speaker.email}`}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  title="Email"
                >
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </a>
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </a>
                )}
                {speaker.twitter && (
                  <a
                    href={`https://twitter.com/${speaker.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-blue-400 dark:text-blue-300" />
                  </a>
                )}
              </div>

              {permissions?.canManageSpeakers && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(speaker.id)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(speaker.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
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

export default Speakers;