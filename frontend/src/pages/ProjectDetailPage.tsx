import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { projectsAPI, requirementsAPI, assetsAPI } from '../services/api';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [projectRes, reqRes, assetsRes] = await Promise.all([
          projectsAPI.getOne(id),
          requirementsAPI.getAll(id),
          assetsAPI.getAll(id),
        ]);
        setProject(projectRes.data.data);
        setRequirements(reqRes.data.data || []);
        setAssets(assetsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await projectsAPI.delete(id);
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'planning': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'on_hold': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRequirementStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case 'rejected':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
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

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
          <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            Back to Projects
          </Link>
        </div>
      </Layout>
    );
  }

  const completedRequirements = requirements.filter(r => r.status === 'completed' || r.status === 'approved').length;
  const progress = requirements.length > 0 ? Math.round((completedRequirements / requirements.length) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                  {project.status?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-500 mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/projects/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Project Progress</h3>
            <span className="text-2xl font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completedRequirements} of {requirements.length} requirements completed
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{requirements.length}</p>
                <p className="text-sm text-gray-500">Requirements</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <PhotoIcon className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
                <p className="text-sm text-gray-500">Assets</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{project.teamMembers?.length || 0}</p>
                <p className="text-sm text-gray-500">Team Members</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                </p>
                <p className="text-sm text-gray-500">Deadline</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['overview', 'requirements', 'assets', 'team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Priority</dt>
                    <dd className="flex items-center space-x-2 mt-1">
                      <span className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`}></span>
                      <span className="font-medium capitalize">{project.priority || 'Not set'}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Client</dt>
                    <dd className="font-medium mt-1">{project.client?.name || 'Not assigned'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Created</dt>
                    <dd className="font-medium mt-1">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Last Updated</dt>
                    <dd className="font-medium mt-1">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requirements</h3>
                {requirements.length > 0 ? (
                  <ul className="space-y-3">
                    {requirements.slice(0, 5).map((req) => (
                      <li key={req._id}>
                        <Link
                          to={`/requirements/${req._id}`}
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          {getRequirementStatusIcon(req.status)}
                          <span className="flex-1 truncate">{req.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No requirements yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
                <Link
                  to={`/requirements/new?project=${id}`}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Requirement
                </Link>
              </div>
              {requirements.length > 0 ? (
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <Link
                      key={req._id}
                      to={`/requirements/${req._id}`}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        {getRequirementStatusIcon(req.status)}
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-500 capitalize">{req.category?.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No requirements yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
                <Link
                  to={`/assets?project=${id}`}
                  className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Upload Asset
                </Link>
              </div>
              {assets.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {assets.map((asset) => (
                    <div
                      key={asset._id}
                      className="p-4 rounded-xl border border-gray-100 hover:border-pink-200 transition-colors"
                    >
                      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-sm text-gray-900 truncate">{asset.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{asset.type}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PhotoIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No assets uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Member
                </button>
              </div>
              {project.teamMembers && project.teamMembers.length > 0 ? (
                <div className="space-y-3">
                  {project.teamMembers.map((member: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {member.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium capitalize">
                        {member.role || 'member'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No team members assigned</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Project</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete "{project.name}"? This action cannot be undone and will also delete all associated requirements and assets.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
