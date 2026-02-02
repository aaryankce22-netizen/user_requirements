import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, requirementsAPI } from '../services/api';
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  FolderIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRequirements: 0,
    completedRequirements: 0,
    pendingRequirements: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, requirementsRes] = await Promise.all([
          projectsAPI.getAll(),
          requirementsAPI.getAll(),
        ]);

        const projects = projectsRes.data.data || [];
        const requirements = requirementsRes.data.data || [];

        setStats({
          totalProjects: projects.length,
          totalRequirements: requirements.length,
          completedRequirements: requirements.filter((r: any) => 
            r.status === 'completed' || r.status === 'approved'
          ).length,
          pendingRequirements: requirements.filter((r: any) => 
            r.status === 'pending' || r.status === 'draft'
          ).length,
        });

        // Create recent activity from requirements and projects
        const activity = [
          ...requirements.slice(0, 5).map((r: any) => ({
            type: 'requirement',
            title: r.title,
            status: r.status,
            date: r.updatedAt,
          })),
          ...projects.slice(0, 3).map((p: any) => ({
            type: 'project',
            title: p.name,
            status: p.status,
            date: p.updatedAt,
          })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
         .slice(0, 8);

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'manager': return 'bg-purple-100 text-purple-700';
      case 'client': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'pending':
      case 'draft':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{user?.email}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role || 'team_member')} bg-white/20`}>
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FolderIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                <p className="text-sm text-gray-500">Projects</p>
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequirements}</p>
                <p className="text-sm text-gray-500">Requirements</p>
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
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedRequirements}</p>
                <p className="text-sm text-gray-500">Completed</p>
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
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequirements}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <UserCircleIcon className="w-5 h-5 text-gray-400" />
              <span>Account Information</span>
            </h2>

            <dl className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <dt className="text-gray-500">Full Name</dt>
                <dd className="font-medium text-gray-900">{user?.name}</dd>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <dt className="text-gray-500">Email Address</dt>
                <dd className="font-medium text-gray-900">{user?.email}</dd>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <dt className="text-gray-500">Role</dt>
                <dd>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleColor(user?.role || 'team_member')}`}>
                    {user?.role?.replace('_', ' ')}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <dt className="text-gray-500">Account Status</dt>
                <dd className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-green-600">Active</span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-gray-500">Security</dt>
                <dd className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-900">Protected</span>
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5 text-gray-400" />
              <span>Recent Activity</span>
            </h2>

            {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'project' ? 'bg-indigo-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'project' ? (
                        <FolderIcon className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`capitalize ${getStatusColor(activity.status)}`}>
                          {activity.status?.replace('_', ' ')}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Overall Progress</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Requirements Completion</span>
                <span className="text-sm font-bold text-indigo-600">
                  {stats.totalRequirements > 0 
                    ? Math.round((stats.completedRequirements / stats.totalRequirements) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${stats.totalRequirements > 0 
                      ? (stats.completedRequirements / stats.totalRequirements) * 100 
                      : 0}%` 
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completedRequirements}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalRequirements - stats.completedRequirements - stats.pendingRequirements}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequirements}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
