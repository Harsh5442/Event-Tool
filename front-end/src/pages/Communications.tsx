import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Users, Calendar, FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'Registration' | 'Reminder' | 'Update' | 'Cancellation';
  lastUsed: string;
}

interface CommunicationHistory {
  id: string;
  type: 'Email' | 'SMS' | 'In-App';
  subject: string;
  recipients: number;
  sentDate: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
}

const Communications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'templates' | 'history'>('compose');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [recipientGroup, setRecipientGroup] = useState('all');

  const templates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Registration Confirmation',
      subject: 'Welcome to {Event Name}!',
      category: 'Registration',
      lastUsed: '2024-01-10',
    },
    {
      id: '2',
      name: 'Event Reminder - 24 Hours',
      subject: 'Tomorrow: {Event Name}',
      category: 'Reminder',
      lastUsed: '2024-01-14',
    },
    {
      id: '3',
      name: 'Schedule Update',
      subject: 'Schedule Changes for {Event Name}',
      category: 'Update',
      lastUsed: '2024-01-12',
    },
    {
      id: '4',
      name: 'Event Cancellation',
      subject: 'Important: {Event Name} Cancelled',
      category: 'Cancellation',
      lastUsed: '2024-01-08',
    },
  ];

  const history: CommunicationHistory[] = [
    {
      id: '1',
      type: 'Email',
      subject: 'Welcome to Tech Summit 2024',
      recipients: 450,
      sentDate: '2024-01-15 10:30 AM',
      status: 'Sent',
    },
    {
      id: '2',
      type: 'Email',
      subject: 'Schedule Update - New Session Added',
      recipients: 320,
      sentDate: '2024-01-14 02:15 PM',
      status: 'Sent',
    },
    {
      id: '3',
      type: 'In-App',
      subject: 'Event Starting Soon',
      recipients: 450,
      sentDate: '2024-01-16 08:00 AM',
      status: 'Scheduled',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Communications Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Send emails and messages to participants and speakers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 px-6 py-4 font-medium transition-all duration-200 ${
              activeTab === 'compose'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Compose</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-6 py-4 font-medium transition-all duration-200 ${
              activeTab === 'templates'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Templates</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>History</span>
            </div>
          </button>
        </div>

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Recipients
                </label>
                <select
                  value={recipientGroup}
                  onChange={(e) => setRecipientGroup(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Participants</option>
                  <option value="speakers">All Speakers</option>
                  <option value="event">Specific Event Attendees</option>
                  <option value="vip">VIP Ticket Holders</option>
                  <option value="custom">Custom List</option>
                </select>
              </div>

              {/* Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Use Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100"
                >
                  <option value="">None - Start from scratch</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="Enter email subject..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={10}
                placeholder="Compose your message here..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Available variables: {'{Event Name}'}, {'{Participant Name}'}, {'{Event Date}'}, {'{Location}'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200">
                Save as Draft
              </button>
              <div className="flex space-x-3">
                <button className="px-6 py-3 border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors duration-200">
                  Schedule Send
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200">
                  <Send className="w-5 h-5" />
                  <span>Send Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Templates</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200">
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Template</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{template.subject}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      template.category === 'Registration' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      template.category === 'Reminder' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      template.category === 'Update' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {template.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last used: {template.lastUsed}
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors duration-200">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors duration-200">
                        Use
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Communication History</h3>
            
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {item.type === 'Email' ? (
                          <Mail className="w-5 h-5 text-blue-500" />
                        ) : item.type === 'SMS' ? (
                          <MessageSquare className="w-5 h-5 text-green-500" />
                        ) : (
                          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        )}
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.subject}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Sent' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          item.status === 'Scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {item.recipients} recipients
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {item.sentDate}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Communications;