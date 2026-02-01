import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Event system for Auth
const listeners = [];

export const addAuthListener = (listener) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};

const notifyAuthListeners = (event) => {
    listeners.forEach((listener) => listener(event));
};

// Base URL for the backend API
// For Android Emulator, use 10.0.2.2 instead of localhost
// For physical device, use your computer's local IP (e.g., 192.168.x.x)
const API_BASE_URL = 'http://10.0.2.2:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token from AsyncStorage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/user/refresh-token`, { // Use clean axios instance to avoid loop
                        refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                    await AsyncStorage.setItem('accessToken', accessToken);
                    await AsyncStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error('No refresh token available');
                }
            } catch (refreshError) {
                // Refresh failed, clear storage
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                await AsyncStorage.removeItem('user');

                // Notify listeners (AuthContext) to update state
                notifyAuthListeners({ type: 'LOGOUT' });
            }
        }

        return Promise.reject(error);
    }
);

export default api;
