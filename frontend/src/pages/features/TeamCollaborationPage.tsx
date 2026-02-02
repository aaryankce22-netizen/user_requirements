import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeBackground from '../../components/ThreeBackground';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  AtSymbolIcon,
  VideoCameraIcon,
  ClockIcon,
  ShareIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Real-time Comments',
    description: 'Discuss requirements and provide feedback with threaded comments.',
  },
  {
    icon: BellAlertIcon,
    title: 'Smart Notifications',
    description: 'Stay updated with customizable notifications for important changes.',
  },
  {
    icon: AtSymbolIcon,
    title: '@Mentions',
    description: 'Tag team members directly to get their attention on specific items.',
  },
  {
    icon: UserGroupIcon,
    title: 'Team Channels',
    description: 'Create dedicated channels for projects, teams, or topics.',
  },
  {
    icon: VideoCameraIcon,
    title: 'Activity Feed',
    description: 'See all team activity in a unified timeline view.',
  },
  {
    icon: ClockIcon,
    title: 'Real-time Updates',
    description: 'Changes sync instantly across all team members.',
  },
  {
    icon: ShareIcon,
    title: 'Easy Sharing',
    description: 'Share requirements and assets with stakeholders effortlessly.',
  },
  {
    icon: HeartIcon,
    title: 'Reactions & Emoji',
    description: 'Express yourself with reactions and emoji responses.',
  },
];

const TeamCollaborationPage: React.FC = () => {
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
            <UserGroupIcon className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-indigo-300 text-sm font-medium">Team Collaboration</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Real-time Collaboration with
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Comments{' '}
            </span>
            and Notifications
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Keep your team connected and aligned. Collaborate in real-time, share feedback, 
            and stay informed with smart notifications that keep everyone on the same page.
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
            Powerful Collaboration Tools
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Everything your team needs to work together effectively.
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

      {/* Collaboration Demo Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            See Collaboration in Action
          </h2>
          
          {/* Mock Chat Interface */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 rounded-2xl p-6 space-y-4">
              {/* Message 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AK</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">Amit Kumar</span>
                    <span className="text-gray-500 text-xs">2 min ago</span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    Updated the login requirement. <span className="text-indigo-400">@Priya</span> can you review the changes?
                  </p>
                </div>
              </motion.div>

              {/* Message 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">PS</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">Priya Sharma</span>
                    <span className="text-gray-500 text-xs">1 min ago</span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    Looks great! ✅ I've approved the changes. Moving to implementation.
                  </p>
                </div>
              </motion.div>

              {/* Message 3 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">RJ</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">Raj Joshi</span>
                    <span className="text-gray-500 text-xs">Just now</span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    I'll start working on this right away! 🚀
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-300">👍 2</span>
                    <span className="px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-300">🎉 1</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-indigo-400 mb-2">50%</div>
            <div className="text-gray-300">Faster Decision Making</div>
          </div>
          <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-purple-400 mb-2">3x</div>
            <div className="text-gray-300">More Team Engagement</div>
          </div>
          <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-4xl font-bold text-pink-400 mb-2">80%</div>
            <div className="text-gray-300">Reduced Email Volume</div>
          </div>
        </motion.div>
      </div>

      {/* Notification Types */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Stay Notified, Never Miss a Beat
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Requirement Updates', desc: 'When requirements are modified' },
              { title: 'Comments & Replies', desc: 'When someone replies to you' },
              { title: 'Mentions', desc: 'When you are @mentioned' },
              { title: 'Approvals', desc: 'When items need your approval' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.7, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10"
              >
                <BellAlertIcon className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to boost team collaboration?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Start collaborating in real-time with your team today.
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

export default TeamCollaborationPage;
