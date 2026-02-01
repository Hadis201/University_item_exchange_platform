import api from './api';

const chatService = {
    // Get all conversations
    getConversations: async () => {
        const response = await api.get('/chat/conversations');
        return response.data;
    },

    // Get messages for a conversation
    getMessages: async (conversationId) => {
        const response = await api.get(`/chat/messages/${conversationId}`);
        return response.data;
    },

    // Send a message
    sendMessage: async (conversationId, message) => {
        const response = await api.post('/chat/send', {
            conversationId,
            message,
        });
        return response.data;
    },

    // Create or get conversation
    createOrGetConversation: async (participantId) => {
        const response = await api.post('/chat/conversation', {
            participantId,
        });
        return response.data;
    },
};

export default chatService;
