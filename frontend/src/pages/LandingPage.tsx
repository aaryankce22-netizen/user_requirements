import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Centralized Requirements',
    description: 'Collect and manage all client requirements in one place with full traceability.',
    link: '/features/requirements',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    icon: FolderIcon,
    title: 'Project Management',
    description: 'Organize projects with team assignments, deadlines, and progress tracking.',
    link: '/features/projects',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: CloudArrowUpIcon,
    title: 'Asset Management',
    description: 'Upload and version control all project assets securely in one place.',
    link: '/features/assets',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: UserGroupIcon,
    title: 'Team Collaboration',
    description: 'Real-time collaboration with comments, notifications, and activity feeds.',
    link: '/features/collaboration',
    color: 'bg-violet-50 text-violet-600',
  },
];

const benefits = [
  'Role-based access control for teams',
  'Real-time status tracking',
  'File upload and asset management',
  'Comment threads on requirements',
  'Search and filter everything',
  'Activity logs and notifications',
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-lg font-bold text-surface-900 tracking-tight">RequirementsHub</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
            Built for teams who ship
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 mb-6 leading-tight tracking-tight">
            Manage client{' '}
            <span className="text-primary-600">requirements</span>{' '}
            effortlessly
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A centralized web-based system to collect and manage all client requirements
            and project assets efficiently, enabling smoother and faster project execution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Free Trial
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-lg hover:bg-surface-50 transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-surface-50 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-surface-900 mb-3">
                Everything you need to manage requirements
              </h2>
              <p className="text-surface-500 max-w-xl mx-auto">
                Powerful tools designed to streamline your workflow from collection to delivery.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Link to={feature.link} key={feature.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * index, duration: 0.4 }}
                    className="bg-white rounded-xl p-6 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all h-full group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-surface-900 mb-2 group-hover:text-primary-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-surface-900 mb-4">
              Built for modern teams
            </h2>
            <p className="text-surface-500 mb-8 leading-relaxed">
              RequirementsHub gives your team the tools to stay organized, collaborate effectively,
              and deliver projects on time.
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center text-surface-700">
                  <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-primary-600" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface-50 rounded-2xl p-8 border border-surface-100">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-surface-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-900">Requirements Completed</span>
                  <span className="text-sm font-bold text-primary-600">87%</span>
                </div>
                <div className="w-full bg-surface-100 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-surface-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-900">Projects On Track</span>
                  <span className="text-sm font-bold text-emerald-600">92%</span>
                </div>
                <div className="w-full bg-surface-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-surface-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-900">Team Utilization</span>
                  <span className="text-sm font-bold text-amber-600">76%</span>
                </div>
                <div className="w-full bg-surface-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>
            </div>
          </div>
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

export default LandingPage;
