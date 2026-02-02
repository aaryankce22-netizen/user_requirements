import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeBackground from '../../components/ThreeBackground';
import {
  CloudArrowUpIcon,
  ShieldCheckIcon,
  ArrowPathRoundedSquareIcon,
  FolderOpenIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  LockClosedIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CloudArrowUpIcon,
    title: 'Easy Upload',
    description: 'Drag and drop files or use our intuitive upload interface to add assets quickly.',
  },
  {
    icon: ArrowPathRoundedSquareIcon,
    title: 'Version Control',
    description: 'Track every version of your assets with complete history and rollback capabilities.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Storage',
    description: 'Enterprise-grade security ensures your project assets are always protected.',
  },
  {
    icon: FolderOpenIcon,
    title: 'Smart Organization',
    description: 'Automatically organize assets by project, type, and custom tags.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Quick Search',
    description: 'Find any asset instantly with powerful search and filtering tools.',
  },
  {
    icon: LinkIcon,
    title: 'Asset Linking',
    description: 'Link assets to requirements and projects for complete traceability.',
  },
  {
    icon: LockClosedIcon,
    title: 'Access Control',
    description: 'Granular permissions ensure only authorized users can access sensitive files.',
  },
  {
    icon: DocumentDuplicateIcon,
    title: 'File Preview',
    description: 'Preview documents, images, and other files directly in the browser.',
  },
];

const supportedFormats = [
  { category: 'Documents', formats: ['PDF', 'DOC', 'DOCX', 'TXT', 'RTF'] },
  { category: 'Spreadsheets', formats: ['XLS', 'XLSX', 'CSV'] },
  { category: 'Images', formats: ['PNG', 'JPG', 'GIF', 'SVG', 'WEBP'] },
  { category: 'Design', formats: ['PSD', 'AI', 'SKETCH', 'FIGMA'] },
  { category: 'Archives', formats: ['ZIP', 'RAR', '7Z'] },
  { category: 'Code', formats: ['JS', 'TS', 'PY', 'JAVA', 'JSON'] },
];

const AssetManagementPage: React.FC = () => {
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
            <CloudArrowUpIcon className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-indigo-300 text-sm font-medium">Asset Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Upload and Version Control
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {' '}All Project Assets{' '}
            </span>
            Securely
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Store, organize, and manage all your project files in one secure location. 
            Never lose track of important documents with our powerful version control system.
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
            Comprehensive Asset Management
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to manage project files efficiently and securely.
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

      {/* Supported Formats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Supports All Your File Types
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Upload any file format - we've got you covered.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {supportedFormats.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                  {item.category}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {item.formats.map((format) => (
                    <span
                      key={format}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Security Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <ShieldCheckIcon className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                256-bit AES encryption at rest
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                TLS 1.3 encryption in transit
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Regular security audits
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                GDPR compliant
              </li>
            </ul>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <ArrowPathRoundedSquareIcon className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Version Control</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                Complete version history
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                One-click rollback
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                Compare versions side-by-side
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                Automatic backup
              </li>
            </ul>
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
            Ready to secure your project assets?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Start uploading and managing your files with enterprise-grade security.
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

export default AssetManagementPage;
