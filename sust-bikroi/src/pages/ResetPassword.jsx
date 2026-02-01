import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { showSuccess, showError } from '../utils/notifications';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get username from navigation state if available (from forgot password page)
    // Note: We'll need email, but user enters it here
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || formData.newPassword.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.resetPassword(formData);
      if (result.success) {
        showSuccess('Password reset successful! Please login with your new password.');
        navigate('/login');
      } else {
        showError(result.message || 'Failed to reset password.');
      }
    } catch (error) {
      showError('Reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Pane */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-green-500 to-emerald-600 items-center justify-center text-white p-12">
        <div className="max-w-md text-center">
          <Link to="/" className="inline-block mb-8 animate-fade-in-down">
            <img src="/logo.jpg" alt="Logo" className="w-24 h-24 rounded-2xl mx-auto shadow-lg" />
          </Link>
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">Reset Password</h1>
          <p className="text-lg text-green-100 animate-fade-in-up animation-delay-200">
            Enter your email, OTP, and new password to complete the reset process.
          </p>
        </div>
      </div>

      {/* Right Pane (Reset Password Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="animate-fade-in-down">
            <h2 className="text-3xl font-bold text-foreground text-center">
              Set New Password
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter your email, OTP, and new password
            </p>
          </div>

          <form className="mt-8 space-y-6 animate-fade-in-up" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-input bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Student Email"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-4 4-4-4 4-4 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-input bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-input bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="New Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : 'Reset Password'}
              </button>
            </div>

            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;



