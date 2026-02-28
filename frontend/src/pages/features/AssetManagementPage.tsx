import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  ShieldCheckIcon,
  ArrowPathRoundedSquareIcon,
  FolderOpenIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  LockClosedIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const features = [
  { icon: CloudArrowUpIcon, title: 'Easy Upload', description: 'Drag and drop files or use our intuitive upload interface to add assets quickly.' },
  { icon: ArrowPathRoundedSquareIcon, title: 'Version Control', description: 'Track every version of your assets with complete history and rollback capabilities.' },
  { icon: ShieldCheckIcon, title: 'Secure Storage', description: 'Enterprise-grade security ensures your project assets are always protected.' },
  { icon: FolderOpenIcon, title: 'Smart Organization', description: 'Automatically organize assets by project, type, and custom tags.' },
  { icon: MagnifyingGlassIcon, title: 'Quick Search', description: 'Find any asset instantly with powerful search and filtering tools.' },
  { icon: LinkIcon, title: 'Asset Linking', description: 'Link assets to requirements and projects for complete traceability.' },
  { icon: LockClosedIcon, title: 'Access Control', description: 'Granular permissions ensure only authorized users can access sensitive files.' },
  { icon: DocumentDuplicateIcon, title: 'File Preview', description: 'Preview documents, images, and other files directly in the browser.' },
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
          <div className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm font-medium mb-6">
            <CloudArrowUpIcon className="w-4 h-4 mr-1.5" />
            Asset Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6 leading-tight tracking-tight">
            Upload and version control <span className="text-primary-600">all project assets</span> securely
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Store, organize, and manage all your project files in one secure location.
            Never lose track of important documents with our powerful version control system.
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
          <h2 className="text-3xl font-bold text-surface-900 text-center mb-3">Comprehensive Asset Management</h2>
          <p className="text-surface-500 text-center mb-12 max-w-2xl mx-auto">Everything you need to manage project files efficiently and securely.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * index, duration: 0.4 }}
                className="bg-white rounded-xl p-5 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all">
                <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-surface-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-surface-900 text-center mb-3">Supports All Your File Types</h2>
        <p className="text-surface-500 text-center mb-12">Upload any file format - we've got you covered.</p>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {supportedFormats.map((item) => (
            <div key={item.category} className="text-center">
              <h3 className="text-sm font-semibold text-primary-600 mb-3">{item.category}</h3>
              <div className="flex flex-wrap justify-center gap-1.5">
                {item.formats.map((format) => (
                  <span key={format} className="px-2 py-0.5 bg-surface-100 rounded text-xs text-surface-600">{format}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Version Control */}
      <div className="bg-surface-50 border-y border-surface-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 border border-surface-100">
              <ShieldCheckIcon className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-surface-900 mb-4">Enterprise Security</h3>
              <ul className="space-y-2.5">
                {['256-bit AES encryption at rest', 'TLS 1.3 encryption in transit', 'Regular security audits', 'GDPR compliant'].map((item) => (
                  <li key={item} className="flex items-center text-sm text-surface-600">
                    <CheckIcon className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-surface-100">
              <ArrowPathRoundedSquareIcon className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-surface-900 mb-4">Version Control</h3>
              <ul className="space-y-2.5">
                {['Complete version history', 'One-click rollback', 'Compare versions side-by-side', 'Automatic backup'].map((item) => (
                  <li key={item} className="flex items-center text-sm text-surface-600">
                    <CheckIcon className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to secure your project assets?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">Start uploading and managing your files with enterprise-grade security.</p>
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

export default AssetManagementPage;
