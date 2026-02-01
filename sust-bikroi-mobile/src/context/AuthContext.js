import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import authService from '../services/authService';
import { initializeSocket, disconnectSocket } from '../services/socket';
import { addAuthListener } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check for stored user
    useEffect(() => {
        checkUser();

        // Subscribe to auth events (e.g., session expiry from api.js)
        const removeListener = addAuthListener((event) => {
            if (event.type === 'LOGOUT') {
                performLogout();
            }
        });

        return () => {
            removeListener();
        };
    }, []);

    // Socket connection management
    useEffect(() => {
        if (user?._id) {
            initializeSocket(user._id);
        } else {
            disconnectSocket();
        }
    }, [user?._id]); // Only re-run if ID changes, not just the user object reference

    const checkUser = async () => {
        try {
            const storedUser = await authService.getStoredUser();
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = useCallback(async (userName, password) => {
        const response = await authService.login(userName, password);
        setUser(response.data.user);
        return response;
    }, []);

    const register = useCallback(async (formData) => {
        const response = await authService.register(formData);
        setUser(response.data.user);
        return response;
    }, []);

    const performLogout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setUser(null);
        }
    }, []);

    const logout = useCallback(() => {
        return performLogout();
    }, [performLogout]);

    const updateUser = useCallback(async (updatedUser) => {
        setUser(updatedUser);
        await authService.updateStoredUser(updatedUser);
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
    }), [user, loading, login, register, logout, updateUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
