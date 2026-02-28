import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import {
  PlusIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if user can create projects (admin and manager only)
  const canCreateProject = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700';
      case 'in_progress': return 'bg-blue-50 text-blue-700';
      case 'planning': return 'bg-violet-50 text-violet-700';
      case 'review': return 'bg-amber-50 text-amber-700';
      case 'on_hold': return 'bg-surface-100 text-surface-600';
      default: return 'bg-surface-100 text-surface-600';
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
            <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
            <p className="text-surface-500 mt-1 text-sm">
              {user?.role === 'client'
                ? 'View your assigned projects'
                : 'Manage all your client projects'}
            </p>
          </div>
          {canCreateProject && (
            <Link
              to="/projects/new"
              className="inline-flex items-center px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              New Project
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2.5 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/projects/${project._id}`}>
                  <div className="bg-white rounded-xl p-5 border border-surface-100 hover:border-primary-200 hover:shadow-soft transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FolderIcon className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status?.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-surface-900 mb-1 group-hover:text-primary-700 transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-surface-500 line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-50">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>
                          {project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : 'No deadline'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UserGroupIcon className="w-3.5 h-3.5" />
                        <span>{project.teamMembers?.length || 0} members</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-surface-100">
            <FolderIcon className="w-12 h-12 mx-auto text-surface-200 mb-3" />
            <h3 className="text-lg font-semibold text-surface-900 mb-1">No projects found</h3>
            <p className="text-sm text-surface-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Get started by creating your first project'}
            </p>
            {canCreateProject && (
              <Link
                to="/projects/new"
                className="inline-flex items-center px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Create Project
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectsPage;
