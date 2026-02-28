import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { authAPI } from '../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await authAPI.forgotPassword(data.email);
      setUserEmail(data.email);
      if (res.data.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-700 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border-2 border-white/20" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-white font-bold text-3xl">R</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">RequirementsHub</h1>
          <p className="text-primary-100 text-lg leading-relaxed">
            Don't worry, we'll help you get back into your account.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-surface-900">RequirementsHub</span>
          </div>

          {submitted ? (
            <>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-surface-900 text-center mb-2">Check Your Email</h2>
              <p className="text-surface-500 text-center mb-6">
                We've sent a password reset link to <span className="text-primary-600 font-medium">{userEmail}</span>
              </p>
              <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-surface-600">
                  <strong>Note:</strong> The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
              </div>
              {resetUrl && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800 font-medium mb-2">Dev Mode: Reset Link</p>
                  <a href={resetUrl} className="text-sm text-primary-600 hover:text-primary-700 underline break-all">
                    {resetUrl}
                  </a>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all"
                >
                  Send Again
                </button>
                <Link
                  to="/login"
                  className="block w-full py-2.5 bg-surface-100 text-surface-700 font-semibold rounded-lg hover:bg-surface-200 transition-colors text-center"
                >
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-surface-900 mb-1">Forgot Password?</h2>
              <p className="text-surface-500 mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <p className="mt-8 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
