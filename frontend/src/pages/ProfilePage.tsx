import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, requirementsAPI } from '../services/api';
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
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
      case 'admin': return 'bg-rose-50 text-rose-700';
      case 'manager': return 'bg-violet-50 text-violet-700';
      case 'client': return 'bg-blue-50 text-blue-700';
      default: return 'bg-emerald-50 text-emerald-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-emerald-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'pending':
      case 'draft':
        return 'text-amber-600';
      case 'rejected':
        return 'text-rose-600';
      default:
        return 'text-surface-500';
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
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-surface-100 p-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-surface-900 mb-1">{user?.name}</h1>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="flex items-center space-x-1.5 text-sm text-surface-500">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{user?.email}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(user?.role || 'team_member')}`}>
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Projects', value: stats.totalProjects, icon: FolderIcon, color: 'bg-blue-50 text-blue-600' },
            { label: 'Requirements', value: stats.totalRequirements, icon: DocumentTextIcon, color: 'bg-violet-50 text-violet-600' },
            { label: 'Completed', value: stats.completedRequirements, icon: CheckCircleIcon, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Pending', value: stats.pendingRequirements, icon: ClockIcon, color: 'bg-amber-50 text-amber-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-xl p-5 border border-surface-100"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-surface-900">{stat.value}</p>
                  <p className="text-xs text-surface-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-surface-100"
          >
            <div className="px-5 py-4 border-b border-surface-100">
              <h2 className="text-base font-semibold text-surface-900 flex items-center space-x-2">
                <UserCircleIcon className="w-4.5 h-4.5 text-surface-400" />
                <span>Account Information</span>
              </h2>
            </div>

            <dl className="divide-y divide-surface-50">
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-surface-500">Full Name</dt>
                <dd className="text-sm font-medium text-surface-900">{user?.name}</dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-surface-500">Email Address</dt>
                <dd className="text-sm font-medium text-surface-900">{user?.email}</dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-surface-500">Role</dt>
                <dd>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(user?.role || 'team_member')}`}>
                    {user?.role?.replace('_', ' ')}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-surface-500">Account Status</dt>
                <dd className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-sm font-medium text-emerald-600">Active</span>
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-surface-500">Security</dt>
                <dd className="flex items-center space-x-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-surface-900">Protected</span>
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-surface-100"
          >
            <div className="px-5 py-4 border-b border-surface-100">
              <h2 className="text-base font-semibold text-surface-900 flex items-center space-x-2">
                <ChartBarIcon className="w-4.5 h-4.5 text-surface-400" />
                <span>Recent Activity</span>
              </h2>
            </div>

            {recentActivity.length > 0 ? (
              <ul className="divide-y divide-surface-50">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-start space-x-3 px-5 py-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      activity.type === 'project' ? 'bg-blue-50' : 'bg-violet-50'
                    }`}>
                      {activity.type === 'project' ? (
                        <FolderIcon className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <DocumentTextIcon className="w-3.5 h-3.5 text-violet-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{activity.title}</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className={`capitalize ${getStatusColor(activity.status)}`}>
                          {activity.status?.replace('_', ' ')}
                        </span>
                        <span className="text-surface-300">|</span>
                        <span className="text-surface-400">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-surface-500 text-sm text-center py-10">No recent activity</p>
            )}
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-surface-100 p-6"
        >
          <h2 className="text-base font-semibold text-surface-900 mb-5">Overall Progress</h2>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-surface-600">Requirements Completion</span>
                <span className="text-sm font-bold text-primary-600">
                  {stats.totalRequirements > 0
                    ? Math.round((stats.completedRequirements / stats.totalRequirements) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-surface-100 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.totalRequirements > 0
                      ? (stats.completedRequirements / stats.totalRequirements) * 100
                      : 0}%`
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-primary-500 h-2 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-surface-100">
              <div className="text-center">
                <p className="text-xl font-bold text-emerald-600">{stats.completedRequirements}</p>
                <p className="text-xs text-surface-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">
                  {stats.totalRequirements - stats.completedRequirements - stats.pendingRequirements}
                </p>
                <p className="text-xs text-surface-500">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-600">{stats.pendingRequirements}</p>
                <p className="text-xs text-surface-500">Pending</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
