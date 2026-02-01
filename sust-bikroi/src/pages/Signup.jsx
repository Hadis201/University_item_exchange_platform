import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/notifications';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    studentId: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate email for student email
    if (name === 'email') {
      if (value && !value.includes('@student.sust.edu')) {
        setEmailError('Please enter a valid student email (@student.sust.edu)');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate student email
    if (!formData.email.includes('@student.sust.edu')) {
      setEmailError('Please enter a valid student email (@student.sust.edu)');
      showError('Please enter a valid student email (@student.sust.edu)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const result = await signup(signupData);
      if (result.success) {
        showSuccess('OTP sent to your email! Please verify your email.');
        // Navigate to verify OTP page with email
        navigate('/verify-otp', { state: { email: formData.email } });
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">SB</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-input bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${emailError ? 'border-destructive' : 'border-input'
                    }`}
                  placeholder="Enter your student email (@student.sust.edu)"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-input bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-foreground">
                Student ID
              </label>
              <div className="mt-1">
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-input bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter your student ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-foreground">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-input bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-input bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-input bg-background rounded-md placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-border bg-background rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-foreground">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary/90">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-primary/90">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

