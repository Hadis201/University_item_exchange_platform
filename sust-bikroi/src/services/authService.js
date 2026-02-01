import api from './api';

// Auth service functions
export const authService = {
  // Sign up user
  signup: async (userData) => {
    try {
      const response = await api.post('/user/signup', userData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/user/login', credentials);

      // Store tokens and user data
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/user/logout');

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Update account details
  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/user/update-account', profileData);

      // Update user in localStorage
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        data: updatedUser,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  }
  ,
  // Change password
  changePassword: async ({ oldPassword, newPassword }) => {
    try {
      const response = await api.patch('/user/change-password', { oldPassword, newPassword });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      };
    }
  },

  // Verify OTP for signup
  verifyOTP: async ({ email, otp }) => {
    try {
      const response = await api.post('/user/verify-otp', { email, otp });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed'
      };
    }
  },

  // Forgot password
  forgotPassword: async ({ userName }) => {
    try {
      const response = await api.post('/user/forgot-password', { userName });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset instructions'
      };
    }
  },

  // Reset password
  resetPassword: async ({ email, otp, newPassword }) => {
    try {
      const response = await api.post('/user/reset-password', { email, otp, newPassword });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }
};


