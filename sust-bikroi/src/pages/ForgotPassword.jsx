import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { showSuccess, showError } from '../utils/notifications';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    userName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.forgotPassword(formData);
      if (result.success) {
        showSuccess('OTP sent to your email! Please check your inbox.');
        // Navigate to reset password page with username (we'll need to get email from backend or user)
        navigate('/reset-password', { state: { userName: formData.userName } });
      } else {
        showError(result.message || 'Failed to send reset instructions.');
      }
    } catch (error) {
      showError('Request failed. Please try again.');
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
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">Forgot Password?</h1>
          <p className="text-lg text-green-100 animate-fade-in-up animation-delay-200">
            No worries! Enter your username and we'll send you instructions to reset your password.
          </p>
        </div>
      </div>

      {/* Right Pane (Forgot Password Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="animate-fade-in-down">
            <h2 className="text-3xl font-bold text-foreground text-center">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter your username to receive password reset instructions
            </p>
          </div>

          <form className="mt-8 space-y-6 animate-fade-in-up" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-input bg-background placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Username"
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
                    Sending...
                  </>
                ) : 'Submit'}
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

export default ForgotPassword;



