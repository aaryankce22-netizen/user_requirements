import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  AtSymbolIcon,
  VideoCameraIcon,
  ClockIcon,
  ShareIcon,
  HeartIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const features = [
  { icon: ChatBubbleLeftRightIcon, title: 'Real-time Comments', description: 'Discuss requirements and provide feedback with threaded comments.' },
  { icon: BellAlertIcon, title: 'Smart Notifications', description: 'Stay updated with customizable notifications for important changes.' },
  { icon: AtSymbolIcon, title: '@Mentions', description: 'Tag team members directly to get their attention on specific items.' },
  { icon: UserGroupIcon, title: 'Team Channels', description: 'Create dedicated channels for projects, teams, or topics.' },
  { icon: VideoCameraIcon, title: 'Activity Feed', description: 'See all team activity in a unified timeline view.' },
  { icon: ClockIcon, title: 'Real-time Updates', description: 'Changes sync instantly across all team members.' },
  { icon: ShareIcon, title: 'Easy Sharing', description: 'Share requirements and assets with stakeholders effortlessly.' },
  { icon: HeartIcon, title: 'Reactions & Emoji', description: 'Express yourself with reactions and emoji responses.' },
];

const TeamCollaborationPage: React.FC = () => {
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
          <div className="inline-flex items-center px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm font-medium mb-6">
            <UserGroupIcon className="w-4 h-4 mr-1.5" />
            Team Collaboration
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6 leading-tight tracking-tight">
            Real-time collaboration with <span className="text-primary-600">comments and notifications</span>
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Keep your team connected and aligned. Collaborate in real-time, share feedback,
            and stay informed with smart notifications that keep everyone on the same page.
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
          <h2 className="text-3xl font-bold text-surface-900 text-center mb-3">Powerful Collaboration Tools</h2>
          <p className="text-surface-500 text-center mb-12 max-w-2xl mx-auto">Everything your team needs to work together effectively.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index, duration: 0.4 }}
                className="bg-white rounded-xl p-5 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all">
                <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-surface-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaboration Demo */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-surface-900 text-center mb-12">See Collaboration in Action</h2>
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-surface-100 p-6 space-y-4">
          {[
            { initials: 'AK', name: 'Amit Kumar', time: '2 min ago', message: 'Updated the login requirement. @Priya can you review the changes?', colors: 'bg-blue-100 text-blue-700' },
            { initials: 'PS', name: 'Priya Sharma', time: '1 min ago', message: 'Looks great! I\'ve approved the changes. Moving to implementation.', colors: 'bg-violet-100 text-violet-700' },
            { initials: 'RJ', name: 'Raj Joshi', time: 'Just now', message: 'I\'ll start working on this right away!', colors: 'bg-emerald-100 text-emerald-700', reactions: true },
          ].map((msg, index) => (
            <motion.div key={msg.initials} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 * index, duration: 0.4 }} className="flex items-start space-x-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.colors}`}>
                <span className="text-xs font-bold">{msg.initials}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-surface-900">{msg.name}</span>
                  <span className="text-xs text-surface-400">{msg.time}</span>
                </div>
                <p className="text-sm text-surface-600 mt-0.5">{msg.message}</p>
                {msg.reactions && (
                  <div className="flex items-center space-x-1.5 mt-2">
                    <span className="px-2 py-0.5 bg-surface-100 rounded text-xs text-surface-600">+2</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-surface-50 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: '50%', label: 'Faster Decision Making', color: 'text-primary-600' },
              { value: '3x', label: 'More Team Engagement', color: 'text-violet-600' },
              { value: '80%', label: 'Reduced Email Volume', color: 'text-rose-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white rounded-xl p-8 border border-surface-100">
                <div className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-surface-900 text-center mb-12">Stay Notified, Never Miss a Beat</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Requirement Updates', desc: 'When requirements are modified' },
            { title: 'Comments & Replies', desc: 'When someone replies to you' },
            { title: 'Mentions', desc: 'When you are @mentioned' },
            { title: 'Approvals', desc: 'When items need your approval' },
          ].map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index, duration: 0.4 }}
              className="bg-white rounded-xl p-5 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all">
              <BellAlertIcon className="w-7 h-7 text-violet-500 mb-3" />
              <h3 className="text-sm font-semibold text-surface-900 mb-1">{item.title}</h3>
              <p className="text-xs text-surface-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to boost team collaboration?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">Start collaborating in real-time with your team today.</p>
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

export default TeamCollaborationPage;
