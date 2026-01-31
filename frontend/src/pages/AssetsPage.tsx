import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { assetsAPI, projectsAPI } from '../services/api';
import {
  PlusIcon,
  PhotoIcon,
  DocumentIcon,
  FilmIcon,
  MusicalNoteIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  CloudArrowUpIcon,
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
      case 'image': return <PhotoIcon className="w-8 h-8" />;
      case 'video': return <FilmIcon className="w-8 h-8" />;
      case 'audio': return <MusicalNoteIcon className="w-8 h-8" />;
      case '3d_model': return <CubeIcon className="w-8 h-8" />;
      default: return <DocumentIcon className="w-8 h-8" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-pink-100 text-pink-600';
      case 'video': return 'bg-purple-100 text-purple-600';
      case 'audio': return 'bg-green-100 text-green-600';
      case '3d_model': return 'bg-cyan-100 text-cyan-600';
      case 'document': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
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
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
          <div className="fixed inset-0 bg-indigo-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-12 shadow-2xl border-4 border-dashed border-indigo-500">
              <CloudArrowUpIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900">Drop files to upload</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
            <p className="text-gray-500 mt-1">Manage all project assets and files</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/30"
          >
            <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
            Upload Asset
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
              >
                {/* Preview */}
                <div className={`h-40 flex items-center justify-center ${getTypeColor(asset.type)}`}>
                  {asset.type === 'image' ? (
                    <img
                      src={`http://localhost:5000${asset.fileUrl}`}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full"><svg class="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                      }}
                    />
                  ) : (
                    getTypeIcon(asset.type)
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-pink-600 transition-colors">
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                    <span className="capitalize">{asset.type?.replace('_', ' ')}</span>
                    <span>{formatFileSize(asset.fileSize || 0)}</span>
                  </div>
                  {asset.project && (
                    <p className="text-xs text-gray-400 mt-2 truncate">
                      {asset.project.name}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">v{asset.version}</span>
                    <a
                      href={`http://localhost:5000${asset.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      View
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <PhotoIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first asset to get started'}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors"
            >
              <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
              Upload Asset
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Asset</h2>
              
              <form onSubmit={handleUpload} className="space-y-4">
                {/* File Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    uploadData.file
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-pink-500'
                  }`}
                >
                  {uploadData.file ? (
                    <div className="text-green-600">
                      <DocumentIcon className="w-10 h-10 mx-auto mb-2" />
                      <p className="font-medium">{uploadData.file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(uploadData.file.size)}</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to select or drag & drop</p>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <textarea
                  placeholder="Description (optional)"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  rows={2}
                />

                <select
                  required
                  value={uploadData.project}
                  onChange={(e) => setUploadData({ ...uploadData, project: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadData({ name: '', description: '', project: '', tags: '', file: null });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadData.file || !uploadData.project || isUploading}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
