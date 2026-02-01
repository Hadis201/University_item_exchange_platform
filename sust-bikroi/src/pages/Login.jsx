import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/notifications';

const Login = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
      const result = await login(formData);
      if (result.success) {
        showSuccess('Login successful! Welcome back.');
        navigate('/');
      } else {
        showError(result.message || 'Invalid credentials.');
      }
    } catch (error) {
      showError('Login failed. Please check your connection and try again.');
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
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">Welcome Back!</h1>
          <p className="text-lg text-green-100 animate-fade-in-up animation-delay-200">
            Log in to continue your journey of sustainable shopping and selling within the SUST community.
          </p>
        </div>
      </div>

      {/* Right Pane (Login Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="animate-fade-in-down">
            <h2 className="text-3xl font-bold text-foreground text-center">
              Sign in to Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Or{' '}
              <Link
                to="/signup"
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                create a new account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6 animate-fade-in-up" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
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
                  className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-input bg-card placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-input bg-card placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-card"
                />
                <label htmlFor="remember-me" className="ml-2 block text-foreground">
                  Remember me
                </label>
              </div>

              <div className="font-medium">
                <Link to="/forgot-password" className="text-primary hover:text-primary/90 transition-colors">
                  Forgot your password?
                </Link>
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
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

