import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  KeyIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    bio: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    requirementChanges: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    accentColor: 'indigo',
    compactMode: false,
  });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccessMessage('Profile updated successfully!');
    setIsSaving(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);

      setSuccessMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setErrorMessage(''), 5000);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleNotificationsSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccessMessage('Notification preferences saved!');
    setIsSaving(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  ];

  const accentColors = [
    { name: 'indigo', class: 'bg-indigo-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'amber', class: 'bg-amber-500' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
          <p className="text-surface-500 mt-1 text-sm">Manage your account settings and preferences</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56">
            <nav className="bg-white rounded-xl border border-surface-100 p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <tab.icon className={`w-4.5 h-4.5 ${activeTab === tab.id ? 'text-primary-600' : 'text-surface-400'}`} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-surface-100 p-6"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-surface-900 mb-1">Profile Information</h2>
                    <p className="text-surface-500 text-sm">
                      Update your personal information and how others see you.
                    </p>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Change Avatar
                      </button>
                      <p className="text-surface-400 text-xs mt-1.5">JPG, PNG or GIF. Max 2MB</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        placeholder="Your company name"
                        className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm font-medium"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-semibold text-surface-900 mb-1">Security Settings</h2>
                    <p className="text-surface-500 text-sm">
                      Manage your password and security preferences.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
                      <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
                      <CheckIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <h3 className="text-sm font-semibold text-surface-900 flex items-center space-x-2 uppercase tracking-wide">
                      <KeyIcon className="w-4 h-4 text-surface-400" />
                      <span>Change Password</span>
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1.5">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {passwordData.newPassword && passwordData.confirmPassword &&
                         passwordData.newPassword !== passwordData.confirmPassword && (
                          <p className="text-rose-500 text-xs mt-1.5 flex items-center space-x-1">
                            <ExclamationCircleIcon className="w-3.5 h-3.5" />
                            <span>Passwords do not match</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword ||
                               passwordData.newPassword !== passwordData.confirmPassword}
                      className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      Update Password
                    </button>
                  </form>

                  <hr className="border-surface-100" />

                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-surface-500 text-sm mb-4">
                      Add an extra layer of security to your account.
                    </p>
                    <button className="px-5 py-2.5 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors text-sm font-medium">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-surface-900 mb-1">Notification Preferences</h2>
                    <p className="text-surface-500 text-sm">
                      Choose how and when you want to be notified.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified about project changes' },
                      { key: 'requirementChanges', label: 'Requirement Changes', description: 'Get notified when requirements are updated' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of activity' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive product updates and offers' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-surface-900">{item.label}</h4>
                          <p className="text-xs text-surface-500">{item.description}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-surface-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              notifications[item.key as keyof typeof notifications] ? 'translate-x-4.5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleNotificationsSave}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    Save Preferences
                  </button>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-surface-900 mb-1">Appearance</h2>
                    <p className="text-surface-500 text-sm">
                      Customize how the app looks and feels.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-surface-700 mb-3">Theme</h3>
                      <div className="flex space-x-3">
                        {['light', 'dark', 'system'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => setThemeSettings({ ...themeSettings, theme })}
                            className={`px-5 py-2.5 rounded-lg border-2 transition-colors capitalize text-sm font-medium ${
                              themeSettings.theme === theme
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-surface-200 text-surface-600 hover:border-surface-300'
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-surface-700 mb-3">Accent Color</h3>
                      <div className="flex space-x-2.5">
                        {accentColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setThemeSettings({ ...themeSettings, accentColor: color.name })}
                            className={`w-8 h-8 rounded-full ${color.class} transition-transform ${
                              themeSettings.accentColor === color.name
                                ? 'ring-2 ring-offset-2 ring-surface-400 scale-110'
                                : 'hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-surface-900">Compact Mode</h4>
                        <p className="text-xs text-surface-500">Reduce spacing and padding</p>
                      </div>
                      <button
                        onClick={() => setThemeSettings({ ...themeSettings, compactMode: !themeSettings.compactMode })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          themeSettings.compactMode ? 'bg-primary-600' : 'bg-surface-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            themeSettings.compactMode ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
