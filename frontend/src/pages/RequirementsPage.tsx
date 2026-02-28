import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { requirementsAPI, projectsAPI } from '../services/api';
import {
  PlusIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

const RequirementsPage: React.FC = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, projRes] = await Promise.all([
          requirementsAPI.getAll(),
          projectsAPI.getAll(),
        ]);
        setRequirements(reqRes.data.data || []);
        setProjects(projRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
    const matchesProject = projectFilter === 'all' || req.project?._id === projectFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesProject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-50 text-emerald-700';
      case 'in_progress': return 'bg-blue-50 text-blue-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'completed': return 'bg-emerald-50 text-emerald-700';
      case 'rejected': return 'bg-rose-50 text-rose-700';
      case 'draft': return 'bg-surface-100 text-surface-600';
      default: return 'bg-surface-100 text-surface-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'functional': return 'bg-blue-50 text-blue-600';
      case 'non_functional': return 'bg-violet-50 text-violet-600';
      case 'technical': return 'bg-cyan-50 text-cyan-600';
      case 'business': return 'bg-orange-50 text-orange-600';
      case 'ui_ux': return 'bg-pink-50 text-pink-600';
      default: return 'bg-surface-100 text-surface-600';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-rose-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-surface-300';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Requirements</h1>
            <p className="text-surface-500 mt-1 text-sm">
              {user?.role === 'client'
                ? 'Submit and track your requirements'
                : 'Track and manage all project requirements'}
            </p>
          </div>
          <Link
            to="/requirements/new"
            className="inline-flex items-center px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            {user?.role === 'client' ? 'Submit Requirement' : 'Add Requirement'}
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-surface-100">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="functional">Functional</option>
              <option value="non_functional">Non-Functional</option>
              <option value="technical">Technical</option>
              <option value="business">Business</option>
              <option value="ui_ux">UI/UX</option>
            </select>
          </div>
        </div>

        {/* Requirements List */}
        {filteredRequirements.length > 0 ? (
          <div className="space-y-3">
            {filteredRequirements.map((req, index) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link to={`/requirements/${req._id}`}>
                  <div className="bg-white rounded-xl p-5 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <DocumentTextIcon className="w-4.5 h-4.5 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityDot(req.priority)}`} />
                            <h3 className="text-sm font-semibold text-surface-900 truncate group-hover:text-primary-700 transition-colors">
                              {req.title}
                            </h3>
                          </div>
                          <p className="text-sm text-surface-500 line-clamp-1 mb-2">
                            {req.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(req.category)}`}>
                              {req.category?.replace('_', ' ')}
                            </span>
                            {req.project && (
                              <span className="px-2 py-0.5 bg-surface-50 text-surface-500 rounded text-xs border border-surface-100">
                                {req.project.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-surface-400 text-xs flex-shrink-0">
                        {req.comments?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                            <span>{req.comments.length}</span>
                          </div>
                        )}
                        {req.attachments?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <PaperClipIcon className="w-3.5 h-3.5" />
                            <span>{req.attachments.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-surface-100">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-surface-200 mb-3" />
            <h3 className="text-lg font-semibold text-surface-900 mb-1">No requirements found</h3>
            <p className="text-sm text-surface-500 mb-6">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first requirement'}
            </p>
            <Link
              to="/requirements/new"
              className="inline-flex items-center px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Add Requirement
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequirementsPage;
