import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { assetsAPI, projectsAPI } from '../services/api';
import {
  PhotoIcon,
  DocumentIcon,
  FilmIcon,
  MusicalNoteIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Upload form state
  const [uploadData, setUploadData] = useState({
    name: '',
    description: '',
    project: '',
    tags: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, projRes] = await Promise.all([
        assetsAPI.getAll(),
        projectsAPI.getAll(),
      ]);
      setAssets(assetsRes.data.data || []);
      setProjects(projRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.project) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('name', uploadData.name || uploadData.file.name);
      formData.append('description', uploadData.description);
      formData.append('project', uploadData.project);
      formData.append('tags', uploadData.tags);

      await assetsAPI.upload(formData);
      await fetchData();
      setShowUploadModal(false);
      setUploadData({ name: '', description: '', project: '', tags: '', file: null });
    } catch (error) {
      console.error('Error uploading asset:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadData({ ...uploadData, file: e.dataTransfer.files[0] });
      setShowUploadModal(true);
    }
  }, [uploadData]);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesProject = projectFilter === 'all' || asset.project?._id === projectFilter;
    return matchesSearch && matchesType && matchesProject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <PhotoIcon className="w-6 h-6" />;
      case 'video': return <FilmIcon className="w-6 h-6" />;
      case 'audio': return <MusicalNoteIcon className="w-6 h-6" />;
      case '3d_model': return <CubeIcon className="w-6 h-6" />;
      default: return <DocumentIcon className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-rose-50 text-rose-500';
      case 'video': return 'bg-violet-50 text-violet-500';
      case 'audio': return 'bg-emerald-50 text-emerald-500';
      case '3d_model': return 'bg-cyan-50 text-cyan-500';
      case 'document': return 'bg-blue-50 text-blue-500';
      default: return 'bg-surface-100 text-surface-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <div
        className="space-y-6"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {dragActive && (
          <div className="fixed inset-0 bg-primary-500/10 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-10 shadow-soft-lg border-2 border-dashed border-primary-400">
              <CloudArrowUpIcon className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <p className="text-base font-semibold text-surface-900">Drop files to upload</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Assets</h1>
            <p className="text-surface-500 mt-1 text-sm">Manage all project assets and files</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-1.5" />
            Upload Asset
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-surface-100">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search assets..."
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="3d_model">3D Models</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-xl overflow-hidden border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all group"
              >
                {/* Preview */}
                <div className={`h-36 flex items-center justify-center ${getTypeColor(asset.type)}`}>
                  {asset.type === 'image' ? (
                    <img
                      src={`http://localhost:5000${asset.fileUrl}`}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full"><svg class="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                      }}
                    />
                  ) : (
                    getTypeIcon(asset.type)
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-surface-900 truncate group-hover:text-primary-700 transition-colors">
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-surface-400">
                    <span className="capitalize">{asset.type?.replace('_', ' ')}</span>
                    <span>{formatFileSize(asset.fileSize || 0)}</span>
                  </div>
                  {asset.project && (
                    <p className="text-xs text-surface-400 mt-1.5 truncate">
                      {asset.project.name}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-50">
                    <span className="text-xs text-surface-400">v{asset.version}</span>
                    <a
                      href={`http://localhost:5000${asset.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-surface-100">
            <PhotoIcon className="w-12 h-12 mx-auto text-surface-200 mb-3" />
            <h3 className="text-lg font-semibold text-surface-900 mb-1">No assets found</h3>
            <p className="text-sm text-surface-500 mb-6">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first asset to get started'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowUpTrayIcon className="w-4 h-4 mr-1.5" />
              Upload Asset
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-soft-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-surface-900">Upload Asset</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadData({ name: '', description: '', project: '', tags: '', file: null });
                  }}
                  className="p-1 rounded-lg text-surface-400 hover:bg-surface-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* File Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${
                    uploadData.file
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-surface-200 hover:border-primary-400'
                  }`}
                >
                  {uploadData.file ? (
                    <div className="text-emerald-600">
                      <DocumentIcon className="w-8 h-8 mx-auto mb-1.5" />
                      <p className="text-sm font-medium">{uploadData.file.name}</p>
                      <p className="text-xs text-surface-500">{formatFileSize(uploadData.file.size)}</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <CloudArrowUpIcon className="w-8 h-8 text-surface-300 mx-auto mb-1.5" />
                      <p className="text-sm text-surface-500">Click to select or drag & drop</p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                      />
                    </label>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Asset name (optional)"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <textarea
                  placeholder="Description (optional)"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  rows={2}
                />

                <select
                  required
                  value={uploadData.project}
                  onChange={(e) => setUploadData({ ...uploadData, project: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Project *</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadData({ name: '', description: '', project: '', tags: '', file: null });
                    }}
                    className="flex-1 px-4 py-2.5 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadData.file || !uploadData.project || isUploading}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssetsPage;
