import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeBackground from '../../components/ThreeBackground';
import {
  FolderIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: FolderIcon,
    title: 'Project Organization',
    description: 'Create and organize projects with custom structures that fit your workflow.',
  },
  {
    icon: UserGroupIcon,
    title: 'Team Assignments',
    description: 'Assign team members to projects and track individual contributions and responsibilities.',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Deadline Management',
    description: 'Set milestones, track deadlines, and never miss an important project date.',
  },
  {
    icon: ChartBarIcon,
    title: 'Progress Tracking',
    description: 'Visual dashboards showing project progress, completion rates, and bottlenecks.',
  },
  {
    icon: ClipboardDocumentListIcon,
    title: 'Task Management',
    description: 'Break down projects into manageable tasks with priorities and dependencies.',
  },
  {
    icon: CogIcon,
    title: 'Custom Workflows',
    description: 'Define custom project workflows that match your team\'s processes.',
  },
  {
    icon: ArrowTrendingUpIcon,
    title: 'Performance Metrics',
    description: 'Track team performance and project health with detailed analytics.',
  },
  {
    icon: FlagIcon,
    title: 'Milestone Tracking',
    description: 'Set and celebrate project milestones to keep your team motivated.',
  },
];

const ProjectManagementPage: React.FC = () => {
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
            <FolderIcon className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-indigo-300 text-sm font-medium">Project Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Organize Projects with
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Team Assignments{' '}
            </span>
            and Deadlines
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Keep your projects on track with powerful management tools. Assign team members, 
            set deadlines, track progress, and deliver on time, every time.
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
            Complete Project Management Suite
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            All the tools you need to plan, execute, and deliver successful projects.
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

      {/* Project Lifecycle Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Project Lifecycle Management
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Initiate</h3>
              <p className="text-gray-400 text-sm">
                Define project scope, objectives, and key stakeholders.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Plan</h3>
              <p className="text-gray-400 text-sm">
                Create timelines, assign resources, and set milestones.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Execute</h3>
              <p className="text-gray-400 text-sm">
                Track progress, manage tasks, and collaborate in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Deliver</h3>
              <p className="text-gray-400 text-sm">
                Complete deliverables, review outcomes, and celebrate success.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-indigo-400 mb-2">40%</div>
            <div className="text-gray-300">Faster Project Delivery</div>
          </div>
          <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
            <div className="text-gray-300">On-Time Completion Rate</div>
          </div>
          <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-pink-400 mb-2">60%</div>
            <div className="text-gray-300">Improved Team Productivity</div>
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
            Ready to deliver projects on time?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Take control of your projects with powerful management tools.
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

export default ProjectManagementPage;
