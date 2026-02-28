import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  FlagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const features = [
  { icon: FolderIcon, title: 'Project Organization', description: 'Create and organize projects with custom structures that fit your workflow.' },
  { icon: UserGroupIcon, title: 'Team Assignments', description: 'Assign team members to projects and track individual contributions and responsibilities.' },
  { icon: CalendarDaysIcon, title: 'Deadline Management', description: 'Set milestones, track deadlines, and never miss an important project date.' },
  { icon: ChartBarIcon, title: 'Progress Tracking', description: 'Visual dashboards showing project progress, completion rates, and bottlenecks.' },
  { icon: ClipboardDocumentListIcon, title: 'Task Management', description: 'Break down projects into manageable tasks with priorities and dependencies.' },
  { icon: CogIcon, title: 'Custom Workflows', description: "Define custom project workflows that match your team's processes." },
  { icon: ArrowTrendingUpIcon, title: 'Performance Metrics', description: 'Track team performance and project health with detailed analytics.' },
  { icon: FlagIcon, title: 'Milestone Tracking', description: 'Set and celebrate project milestones to keep your team motivated.' },
];

const ProjectManagementPage: React.FC = () => {
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
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors">Sign in</Link>
            <Link to="/register" className="px-5 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-6">
            <FolderIcon className="w-4 h-4 mr-1.5" />
            Project Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6 leading-tight tracking-tight">
            Organize projects with <span className="text-primary-600">team assignments</span> and deadlines
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Keep your projects on track with powerful management tools. Assign team members,
            set deadlines, track progress, and deliver on time, every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">Start Free Trial</Link>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-lg hover:bg-surface-50 transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-1.5" />Back to Home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="bg-surface-50 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-surface-900 text-center mb-3">Complete Project Management Suite</h2>
          <p className="text-surface-500 text-center mb-12 max-w-2xl mx-auto">All the tools you need to plan, execute, and deliver successful projects.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index, duration: 0.4 }}
                className="bg-white rounded-xl p-5 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-surface-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lifecycle */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-surface-900 text-center mb-12">Project Lifecycle Management</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Initiate', desc: 'Define project scope, objectives, and key stakeholders.', color: 'bg-blue-600' },
            { step: '2', title: 'Plan', desc: 'Create timelines, assign resources, and set milestones.', color: 'bg-violet-600' },
            { step: '3', title: 'Execute', desc: 'Track progress, manage tasks, and collaborate in real-time.', color: 'bg-rose-600' },
            { step: '4', title: 'Deliver', desc: 'Complete deliverables, review outcomes, and celebrate success.', color: 'bg-amber-600' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-lg font-bold">{item.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">{item.title}</h3>
              <p className="text-sm text-surface-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-surface-50 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: '40%', label: 'Faster Project Delivery', color: 'text-primary-600' },
              { value: '95%', label: 'On-Time Completion Rate', color: 'text-violet-600' },
              { value: '60%', label: 'Improved Team Productivity', color: 'text-rose-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white rounded-xl p-8 border border-surface-100">
                <div className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to deliver projects on time?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">Take control of your projects with powerful management tools.</p>
          <Link to="/register" className="inline-block px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors">Get Started Free</Link>
        </div>
      </div>

      <footer className="border-t border-surface-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-surface-400 text-sm">
          <p>&copy; 2026 RequirementsHub. Built for 8th Semester Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProjectManagementPage;
