import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeBackground from '../components/ThreeBackground';
import {
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Centralized Requirements',
    description: 'Collect and manage all client requirements in one place.',
    link: '/features/requirements',
  },
  {
    icon: FolderIcon,
    title: 'Project Management',
    description: 'Organize projects with team assignments and deadlines.',
    link: '/features/projects',
  },
  {
    icon: CloudArrowUpIcon,
    title: 'Asset Management',
    description: 'Upload and version control all project assets securely.',
    link: '/features/assets',
  },
  {
    icon: UserGroupIcon,
    title: 'Team Collaboration',
    description: 'Real-time collaboration with comments and notifications.',
    link: '/features/collaboration',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <ThreeBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-white">RequirementsHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:text-indigo-300 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Manage Client
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Requirements{' '}
            </span>
            Effortlessly
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            A centralized web-based system to collect and manage all client requirements
            and project assets efficiently, enabling smoother and faster project execution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Watch Demo
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything you need to manage requirements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link to={feature.link} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all hover:transform hover:scale-105 cursor-pointer h-full"
                >
                  <feature.icon className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2026 RequirementsHub. Built for 8th Semester Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
