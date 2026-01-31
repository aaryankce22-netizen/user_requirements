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
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
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
      color: 'from-blue-500 to-blue-600',
      link: '/projects',
    },
    {
      title: 'Requirements',
      value: stats.totalRequirements,
      icon: DocumentTextIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/requirements',
    },
    {
      title: 'Assets',
      value: stats.totalAssets,
      icon: PhotoIcon,
      color: 'from-pink-500 to-pink-600',
      link: '/assets',
    },
    {
      title: 'Pending Review',
      value: stats.pendingRequirements,
      icon: ClockIcon,
      color: 'from-amber-500 to-amber-600',
      link: '/requirements?status=pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-indigo-100">
            Here's what's happening with your projects today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/projects/new"
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Project
          </Link>
          <Link
            to="/requirements/new"
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Requirement
          </Link>
          <Link
            to="/assets/upload"
            className="flex items-center px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/30"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Upload Asset
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
              <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </Link>
            </div>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FolderIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status?.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FolderIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No projects yet</p>
                <Link to="/projects/new" className="text-indigo-600 hover:underline text-sm">
                  Create your first project
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Requirements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Requirements</h2>
              <Link to="/requirements" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </Link>
            </div>
            {recentRequirements.length > 0 ? (
              <div className="space-y-4">
                {recentRequirements.map((req) => (
                  <Link
                    key={req._id}
                    to={`/requirements/${req._id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        req.status === 'approved' ? 'bg-green-100' :
                        req.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {req.status === 'approved' ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : req.status === 'pending' ? (
                          <ClockIcon className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{req.title}</h3>
                        <p className="text-sm text-gray-500">{req.category}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No requirements yet</p>
                <Link to="/requirements/new" className="text-indigo-600 hover:underline text-sm">
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
