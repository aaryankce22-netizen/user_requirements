import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  BellIcon,
  ArrowLeftIcon,
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-lg font-bold text-surface-900 tracking-tight">RequirementsHub</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
            <DocumentTextIcon className="w-4 h-4 mr-1.5" />
            Centralized Requirements
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6 leading-tight tracking-tight">
            Collect and manage all <span className="text-primary-600">requirements</span> in one place
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop juggling spreadsheets and emails. Our centralized requirements management system
            brings all your client needs together in one organized, searchable hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Start Free Trial
            </Link>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-lg hover:bg-surface-50 transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="bg-surface-50 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-surface-900 text-center mb-3">Powerful Features for Requirements Management</h2>
          <p className="text-surface-500 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to capture, organize, and track requirements throughout your project lifecycle.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.4 }}
                className="bg-white rounded-xl p-5 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all"
              >
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-surface-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-surface-900 text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Capture', desc: 'Easily input requirements from any source - meetings, emails, or client documents.' },
            { step: '2', title: 'Organize', desc: 'Categorize and prioritize requirements with tags, statuses, and custom fields.' },
            { step: '3', title: 'Track', desc: 'Monitor progress and ensure all requirements are addressed throughout development.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-lg font-bold">{item.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">{item.title}</h3>
              <p className="text-sm text-surface-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to streamline your requirements?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">Join teams who have simplified their requirement management process.</p>
          <Link to="/register" className="inline-block px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-surface-400 text-sm">
          <p>&copy; 2026 RequirementsHub. Built for 8th Semester Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default CentralizedRequirementsPage;
