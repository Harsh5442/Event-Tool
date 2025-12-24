import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from '../Chatbot/Chatbot';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 p-6">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      {/* Chatbot - appears on all pages */}
      <Chatbot />
    </div>
  );
};

export default MainLayout;