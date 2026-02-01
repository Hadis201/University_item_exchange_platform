import { io } from 'socket.io-client';

// Socket.io connection
// For Android Emulator, use 10.0.2.2 instead of localhost
const SOCKET_URL = 'http://10.0.2.2:5000';

let socket = null;

export const initializeSocket = (userId) => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            query: { userId },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        console.warn('Socket not initialized. Call initializeSocket first.');
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export default {
    initializeSocket,
    getSocket,
    disconnectSocket,
};
