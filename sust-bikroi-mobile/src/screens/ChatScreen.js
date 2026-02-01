import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import { getSocket } from '../services/socket';

const ChatScreen = ({ route }) => {
    const { sellerId } = route.params;
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const flatListRef = useRef(null);
    const socket = getSocket();

    useEffect(() => {
        initializeChat();
    }, [sellerId]);

    useEffect(() => {
        if (socket && conversationId) {
            socket.on('newMessage', (message) => {
                if (message.conversationId === conversationId) {
                    setMessages((prev) => [...prev, message]);
                }
            });

            return () => {
                socket.off('newMessage');
            };
        }
    }, [socket, conversationId]);

    const initializeChat = async () => {
        try {
            // Create or get conversation
            const convResponse = await chatService.createOrGetConversation(sellerId);
            const convId = convResponse.data._id;
            setConversationId(convId);

            // Get messages
            const messagesResponse = await chatService.getMessages(convId);
            setMessages(messagesResponse.data || []);
        } catch (error) {
            Alert.alert('Error', 'Could not load chat');
        }
    };

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        try {
            const message = inputMessage.trim();
            setInputMessage('');

            await chatService.sendMessage(conversationId, message);

            // Scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            Alert.alert('Error', 'Could not send message');
        }
    };

    useEffect(() => {
        // Scroll to bottom when messages change
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [messages]);

    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === user._id;

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessage : styles.otherMessage,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        isMyMessage ? styles.myMessageText : styles.otherMessageText,
                    ]}
                >
                    {item.message}
                </Text>
                <Text style={styles.messageTime}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
                }
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>📤</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        maxWidth: '75%',
        marginVertical: 4,
        padding: 12,
        borderRadius: 16,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#4F46E5',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#1f2937',
    },
    messageTime: {
        fontSize: 10,
        color: '#9ca3af',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        fontSize: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 40,
        fontSize: 16,
    },
});

export default ChatScreen;
