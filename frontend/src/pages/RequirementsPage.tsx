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
  FunnelIcon,
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
      case 'approved': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'functional': return 'bg-indigo-100 text-indigo-700';
      case 'non_functional': return 'bg-purple-100 text-purple-700';
      case 'technical': return 'bg-cyan-100 text-cyan-700';
      case 'business': return 'bg-orange-100 text-orange-700';
      case 'ui_ux': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Requirements</h1>
            <p className="text-gray-500 mt-1">
              {user?.role === 'client' 
                ? 'Submit and track your requirements' 
                : 'Track and manage all project requirements'}
            </p>
          </div>
          <Link
            to="/requirements/new"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            {user?.role === 'client' ? 'Submit Requirement' : 'Add Requirement'}
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <div className="space-y-4">
            {filteredRequirements.map((req, index) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/requirements/${req._id}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-purple-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getPriorityIcon(req.priority)}</span>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {req.title}
                            </h3>
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                            {req.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(req.category)}`}>
                              {req.category?.replace('_', ' ')}
                            </span>
                            {req.project && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                {req.project.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        {req.comments?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                            <span>{req.comments.length}</span>
                          </div>
                        )}
                        {req.attachments?.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <PaperClipIcon className="w-4 h-4" />
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
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requirements found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first requirement'}
            </p>
            <Link
              to="/requirements/new"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Requirement
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequirementsPage;
