import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeBackground from '../../components/ThreeBackground';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Unified Repository',
    description: 'Store all client requirements in a single, organized location accessible to your entire team.',
  },
  {
    icon: CheckCircleIcon,
    title: 'Status Tracking',
    description: 'Track requirement status from draft to approved, with full visibility into the approval workflow.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Advanced Search',
    description: 'Quickly find any requirement using powerful search and filtering capabilities.',
  },
  {
    icon: TagIcon,
    title: 'Categorization',
    description: 'Organize requirements by category, priority, and custom tags for easy management.',
  },
  {
    icon: ClockIcon,
    title: 'Version History',
    description: 'Track all changes made to requirements with complete version history and audit trail.',
  },
  {
    icon: ArrowPathIcon,
    title: 'Requirement Linking',
    description: 'Link related requirements together to maintain traceability across your projects.',
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics Dashboard',
    description: 'Visualize requirement metrics with intuitive charts and progress indicators.',
  },
  {
    icon: BellIcon,
    title: 'Smart Notifications',
    description: 'Get notified when requirements are updated, approved, or need your attention.',
  },
];

const CentralizedRequirementsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <ThreeBackground />

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-white">RequirementsHub</span>
          </Link>
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 rounded-full mb-6">
            <DocumentTextIcon className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-indigo-300 text-sm font-medium">Centralized Requirements</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Collect and Manage All
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Requirements{' '}
            </span>
            in One Place
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Stop juggling spreadsheets and emails. Our centralized requirements management system 
            brings all your client needs together in one organized, searchable hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              to="/"
              className="px-8 py-4 border-2 border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Powerful Features for Requirements Management
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to capture, organize, and track requirements throughout your project lifecycle.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all hover:transform hover:scale-105"
              >
                <feature.icon className="w-10 h-10 text-indigo-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Capture</h3>
              <p className="text-gray-400">
                Easily input requirements from any source - meetings, emails, or client documents.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Organize</h3>
              <p className="text-gray-400">
                Categorize and prioritize requirements with tags, statuses, and custom fields.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Track</h3>
              <p className="text-gray-400">
                Monitor progress and ensure all requirements are addressed throughout development.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your requirements?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of teams who have simplified their requirement management process.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:scale-105"
          >
            Get Started Free
          </Link>
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

export default CentralizedRequirementsPage;
