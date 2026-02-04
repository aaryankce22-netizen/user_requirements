import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import {
  ArrowLeftIcon,
  FolderPlusIcon,
  CalendarIcon,
  FlagIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Determine if this is edit mode
  const isEditMode = !!id;

  // Check if user has permission to create/edit projects
  const canManageProject = user?.role === 'admin' || user?.role === 'manager';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    deadline: '',
    clientName: '',
    clientEmail: '',
    tags: '',
  });

  // Fetch project data if editing
  useEffect(() => {
    const fetchProject = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const response = await projectsAPI.getOne(id);
          const project = response.data.data;
          setFormData({
            name: project.name || '',
            description: project.description || '',
            status: project.status || 'planning',
            priority: project.priority || 'medium',
            deadline: project.deadline ? project.deadline.split('T')[0] : '',
            clientName: project.clientInfo?.name || '',
            clientEmail: project.clientInfo?.email || '',
            tags: project.tags?.join(', ') || '',
          });
        } catch (error) {
          console.error('Error fetching project:', error);
          setError('Failed to load project details');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProject();
  }, [id, isEditMode]);

  // If user doesn't have permission, show access denied
  if (!canManageProject) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
          >
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-6">
              Only administrators and managers can {isEditMode ? 'edit' : 'create'} projects.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Projects
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Project description is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData: any = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline || undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      // Add client info if provided
      if (formData.clientName) {
        projectData.clientInfo = {
          name: formData.clientName,
          email: formData.clientEmail || undefined,
        };
      }

      let response;
      if (isEditMode && id) {
        // Update existing project
        response = await projectsAPI.update(id, projectData);
      } else {
        // Create new project
        response = await projectsAPI.create(projectData);
      }
      navigate(`/projects/${response.data.data._id}`);
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} project:`, error);
      setError(error.response?.data?.error || error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} project`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'planning', label: 'Planning', color: 'bg-purple-100 text-purple-700' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { value: 'review', label: 'Review', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-gray-100 text-gray-700' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(isEditMode ? `/projects/${id}` : '/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditMode ? 'Update the project details' : 'Fill in the details to create a new project'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
        /* Form */
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <FolderPlusIcon className="w-5 h-5 text-indigo-600" />
              <span>Basic Information</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the project goals and scope..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="web, mobile, api (comma-separated)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <FlagIcon className="w-5 h-5 text-indigo-600" />
              <span>Status & Priority</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: option.value })}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        formData.status === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priority
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: option.value })}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center space-x-2 ${
                        formData.priority === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              <span>Timeline</span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <UserGroupIcon className="w-5 h-5 text-indigo-600" />
              <span>Client Information</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Client or company name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to={isEditMode ? `/projects/${id}` : '/projects'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-indigo-500/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  {isEditMode ? <PencilIcon className="w-5 h-5" /> : <FolderPlusIcon className="w-5 h-5" />}
                  <span>{isEditMode ? 'Update Project' : 'Create Project'}</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
        )}
      </div>
    </Layout>
  );
};

export default NewProjectPage;
