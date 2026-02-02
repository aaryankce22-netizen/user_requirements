import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { requirementsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  ClockIcon,
  UserIcon,
  FolderIcon,
  TagIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const RequirementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requirement, setRequirement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    const fetchRequirement = async () => {
      if (!id) return;
      try {
        const response = await requirementsAPI.getOne(id);
        setRequirement(response.data.data);
      } catch (error) {
        console.error('Error fetching requirement:', error);
        navigate('/requirements');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequirement();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await requirementsAPI.delete(id);
      navigate('/requirements');
    } catch (error) {
      console.error('Error deleting requirement:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;
    
    setIsAddingComment(true);
    try {
      await requirementsAPI.addComment(id, newComment);
      const response = await requirementsAPI.getOne(id);
      setRequirement(response.data.data);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await requirementsAPI.update(id, { status: newStatus });
      setRequirement({ ...requirement, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const statusOptions = ['draft', 'pending', 'approved', 'in_progress', 'completed', 'rejected'];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!requirement) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900">Requirement not found</h2>
          <Link to="/requirements" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
            Back to Requirements
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <button
              onClick={() => navigate('/requirements')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{getPriorityIcon(requirement.priority)}</span>
                <h1 className="text-3xl font-bold text-gray-900">{requirement.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(requirement.status)}`}>
                  {requirement.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(requirement.category)}`}>
                  {requirement.category?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/requirements/${id}/edit`}
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {requirement.description || 'No description provided.'}
              </p>
            </motion.div>

            {/* Acceptance Criteria */}
            {requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Acceptance Criteria</h2>
                <ul className="space-y-3">
                  {requirement.acceptanceCriteria.map((criteria: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Attachments */}
            {requirement.attachments && requirement.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <PaperClipIcon className="w-5 h-5 text-gray-400" />
                  <span>Attachments</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {requirement.attachments.map((attachment: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400" />
                <span>Comments ({requirement.comments?.length || 0})</span>
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isAddingComment}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                      >
                        {isAddingComment ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              {requirement.comments && requirement.comments.length > 0 ? (
                <div className="space-y-4">
                  {requirement.comments.map((comment: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium flex-shrink-0">
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.user?.name || 'Unknown'}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-3">Update Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      requirement.status === status
                        ? getStatusColor(status) + ' border-2 border-current'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="space-y-4">
                {requirement.project && (
                  <div>
                    <dt className="text-sm text-gray-500 flex items-center space-x-1">
                      <FolderIcon className="w-4 h-4" />
                      <span>Project</span>
                    </dt>
                    <dd className="mt-1">
                      <Link
                        to={`/projects/${requirement.project._id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        {requirement.project.name}
                      </Link>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500 flex items-center space-x-1">
                    <UserIcon className="w-4 h-4" />
                    <span>Created By</span>
                  </dt>
                  <dd className="font-medium mt-1">{requirement.createdBy?.name || 'Unknown'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>Created</span>
                  </dt>
                  <dd className="font-medium mt-1">
                    {new Date(requirement.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>Last Updated</span>
                  </dt>
                  <dd className="font-medium mt-1">
                    {new Date(requirement.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
                {requirement.tags && requirement.tags.length > 0 && (
                  <div>
                    <dt className="text-sm text-gray-500 flex items-center space-x-1">
                      <TagIcon className="w-4 h-4" />
                      <span>Tags</span>
                    </dt>
                    <dd className="flex flex-wrap gap-2 mt-2">
                      {requirement.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </motion.div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Requirement</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete "{requirement.title}"? This action cannot be undone.
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

export default RequirementDetailPage;
