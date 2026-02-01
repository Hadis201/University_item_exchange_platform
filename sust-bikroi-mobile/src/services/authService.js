import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
    // Register new user
    register: async (formData) => {
        const response = await api.post('/user/signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.data.accessToken) {
            await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
            await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    },

    // Login user
    login: async (userName, password) => {
        const response = await api.post('/user/login', { userName, password });

        if (response.data.data.accessToken) {
            await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
            await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    },

    // Logout user
    logout: async () => {
        await api.post('/user/logout');
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/user/current-user');
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/user/forgot-password', { email });
        return response.data;
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        const response = await api.post('/user/verify-otp', { email, otp });
        return response.data;
    },

    // Reset password
    resetPassword: async (email, otp, newPassword) => {
        const response = await api.post('/user/reset-password', {
            email,
            otp,
            newPassword,
        });
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await api.patch('/user/update-account', data);
        if (response.data.data) {
            // Update stored user data if successful
            await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    // Change password
    changePassword: async (oldPassword, newPassword) => {
        const response = await api.patch('/user/change-password', {
            oldPassword,
            newPassword
        });
        return response.data;
    },

    // Get stored user
    getStoredUser: async () => {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Update stored user
    updateStoredUser: async (user) => {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    },
};

export default authService;
