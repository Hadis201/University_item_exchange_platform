import api from './api';

export const chatService = {
  getContacts: async () => {
    try {
      const response = await api.get('/chats/contacts');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contacts',
      };
    }
  },

  getConversation: async (friendId) => {
    try {
      const response = await api.get(`/chats/${friendId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch chat history',
      };
    }
  },

  markAsRead: async (friendId) => {
    try {
      await api.put(`/chats/${friendId}/read`);
      return { success: true };
    } catch (error) {
      // access error message if needed, but often silent failure is okay for read receipt
      console.error("Failed to mark as read:", error);
      return { success: false };
    }
  },
};

