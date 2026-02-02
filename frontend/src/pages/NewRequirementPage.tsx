import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { requirementsAPI, projectsAPI } from '../services/api';
import {
  ArrowLeftIcon,
  DocumentPlusIcon,
  FolderIcon,
  FlagIcon,
  TagIcon,
  ListBulletIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const NewRequirementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: searchParams.get('project') || '',
    category: 'functional',
    priority: 'medium',
    status: 'draft',
    tags: '',
    acceptanceCriteria: [''],
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Requirement title is required');
      return;
    }

    if (!formData.project) {
      setError('Please select a project');
      return;
    }

    setIsSubmitting(true);
    try {
      const requirementData = {
        title: formData.title,
        description: formData.description,
        project: formData.project,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        acceptanceCriteria: formData.acceptanceCriteria.filter(c => c.trim()),
      };

      const response = await requirementsAPI.create(requirementData);
      navigate(`/requirements/${response.data.data._id}`);
    } catch (error: any) {
      console.error('Error creating requirement:', error);
      setError(error.response?.data?.message || 'Failed to create requirement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAcceptanceCriteria = () => {
    setFormData({
      ...formData,
      acceptanceCriteria: [...formData.acceptanceCriteria, ''],
    });
  };

  const removeAcceptanceCriteria = (index: number) => {
    setFormData({
      ...formData,
      acceptanceCriteria: formData.acceptanceCriteria.filter((_, i) => i !== index),
    });
  };

  const updateAcceptanceCriteria = (index: number, value: string) => {
    const newCriteria = [...formData.acceptanceCriteria];
    newCriteria[index] = value;
    setFormData({ ...formData, acceptanceCriteria: newCriteria });
  };

  const categoryOptions = [
    { value: 'functional', label: 'Functional', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'non_functional', label: 'Non-Functional', color: 'bg-purple-100 text-purple-700' },
    { value: 'technical', label: 'Technical', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'business', label: 'Business', color: 'bg-orange-100 text-orange-700' },
    { value: 'ui_ux', label: 'UI/UX', color: 'bg-pink-100 text-pink-700' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', icon: '🟢' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'high', label: 'High', icon: '🟠' },
    { value: 'critical', label: 'Critical', icon: '🔴' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/requirements')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Requirement</h1>
            <p className="text-gray-500 mt-1">Define a new requirement for your project</p>
          </div>
        </div>

        {/* Form */}
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
              <DocumentPlusIcon className="w-5 h-5 text-purple-600" />
              <span>Requirement Details</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter requirement title"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  placeholder="Describe the requirement in detail..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project <span className="text-red-500">*</span>
                </label>
                {isLoadingProjects ? (
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                    Loading projects...
                  </div>
                ) : (
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Category & Priority */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <FlagIcon className="w-5 h-5 text-purple-600" />
              <span>Classification</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-3">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: option.value })}
                      className={`px-4 py-2 rounded-xl border-2 transition-all ${
                        formData.category === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${option.color}`}>
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
                <div className="grid grid-cols-4 gap-3">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: option.value })}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2 ${
                        formData.priority === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Initial Status
                </label>
                <div className="flex gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: option.value })}
                      className={`px-4 py-2 rounded-xl border-2 transition-all ${
                        formData.status === option.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <ListBulletIcon className="w-5 h-5 text-purple-600" />
              <span>Acceptance Criteria</span>
            </h2>

            <div className="space-y-3">
              {formData.acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={criteria}
                    onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                    placeholder="Enter acceptance criteria..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {formData.acceptanceCriteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAcceptanceCriteria(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAcceptanceCriteria}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm font-medium mt-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Criteria</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <TagIcon className="w-5 h-5 text-purple-600" />
              <span>Tags</span>
            </h2>

            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="authentication, security, user-flow (comma-separated)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/requirements"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-purple-500/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <DocumentPlusIcon className="w-5 h-5" />
                  <span>Create Requirement</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </Layout>
  );
};

export default NewRequirementPage;
