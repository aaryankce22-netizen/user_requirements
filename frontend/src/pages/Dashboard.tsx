import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { projectsAPI, requirementsAPI, assetsAPI } from '../services/api';
import {
  FolderIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface Stats {
  totalProjects: number;
  totalRequirements: number;
  totalAssets: number;
  pendingRequirements: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalRequirements: 0,
    totalAssets: 0,
    pendingRequirements: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentRequirements, setRecentRequirements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, requirementsRes, assetsRes] = await Promise.all([
          projectsAPI.getAll(),
          requirementsAPI.getAll(),
          assetsAPI.getAll(),
        ]);

        const projects = projectsRes.data.data || [];
        const requirements = requirementsRes.data.data || [];
        const assets = assetsRes.data.data || [];

        setStats({
          totalProjects: projects.length,
          totalRequirements: requirements.length,
          totalAssets: assets.length,
          pendingRequirements: requirements.filter((r: any) => r.status === 'pending').length,
        });

        setRecentProjects(projects.slice(0, 5));
        setRecentRequirements(requirements.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderIcon,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-l-blue-500',
      link: '/projects',
    },
    {
      title: 'Requirements',
      value: stats.totalRequirements,
      icon: DocumentTextIcon,
      color: 'bg-violet-50 text-violet-600',
      borderColor: 'border-l-violet-500',
      link: '/requirements',
    },
    {
      title: 'Assets',
      value: stats.totalAssets,
      icon: PhotoIcon,
      color: 'bg-rose-50 text-rose-600',
      borderColor: 'border-l-rose-500',
      link: '/assets',
    },
    {
      title: 'Pending Review',
      value: stats.pendingRequirements,
      icon: ClockIcon,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-l-amber-500',
      link: '/requirements?status=pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700';
      case 'in_progress': return 'bg-blue-50 text-blue-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'approved': return 'bg-emerald-50 text-emerald-700';
      case 'rejected': return 'bg-rose-50 text-rose-700';
      default: return 'bg-surface-100 text-surface-700';
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-surface-500 mt-1 text-sm">
                Here's what's happening with your projects today.
              </p>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium capitalize">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link to={stat.link}>
                <div className={`bg-white rounded-xl p-5 border border-surface-100 border-l-4 ${stat.borderColor} hover:shadow-soft transition-all group`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-surface-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Link
              to="/projects/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              New Project
            </Link>
          )}
          {user?.role !== 'client' ? (
            <Link
              to="/requirements/new"
              className="inline-flex items-center px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Add Requirement
            </Link>
          ) : (
            <Link
              to="/requirements/new"
              className="inline-flex items-center px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Submit Requirement
            </Link>
          )}
          <Link
            to="/assets"
            className="inline-flex items-center px-4 py-2 bg-white text-surface-700 text-sm font-medium rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Upload Asset
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-surface-100"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
              <h2 className="text-base font-semibold text-surface-900">Recent Projects</h2>
              <Link to="/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center">
                View all
                <ArrowRightIcon className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            {recentProjects.length > 0 ? (
              <div className="divide-y divide-surface-50">
                {recentProjects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-surface-900 truncate">{project.name}</h3>
                        <p className="text-xs text-surface-400 truncate max-w-[200px]">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(project.status)}`}>
                      {project.status?.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-5">
                <FolderIcon className="w-10 h-10 mx-auto text-surface-200 mb-2" />
                <p className="text-sm text-surface-500">No projects yet</p>
                <Link to="/projects/new" className="text-primary-600 hover:underline text-sm">
                  Create your first project
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Requirements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-surface-100"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
              <h2 className="text-base font-semibold text-surface-900">Recent Requirements</h2>
              <Link to="/requirements" className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center">
                View all
                <ArrowRightIcon className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            {recentRequirements.length > 0 ? (
              <div className="divide-y divide-surface-50">
                {recentRequirements.map((req) => (
                  <Link
                    key={req._id}
                    to={`/requirements/${req._id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        req.status === 'approved' ? 'bg-emerald-50' :
                        req.status === 'pending' ? 'bg-amber-50' : 'bg-surface-100'
                      }`}>
                        {req.status === 'approved' ? (
                          <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                        ) : req.status === 'pending' ? (
                          <ClockIcon className="w-4 h-4 text-amber-600" />
                        ) : (
                          <DocumentTextIcon className="w-4 h-4 text-surface-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-surface-900 truncate">{req.title}</h3>
                        <p className="text-xs text-surface-400">{req.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-5">
                <DocumentTextIcon className="w-10 h-10 mx-auto text-surface-200 mb-2" />
                <p className="text-sm text-surface-500">No requirements yet</p>
                <Link to="/requirements/new" className="text-primary-600 hover:underline text-sm">
                  Add your first requirement
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
