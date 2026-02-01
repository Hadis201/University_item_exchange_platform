import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { initSocket } from '../services/socket';
import { showError } from '../utils/notifications';

const getSafeUserId = (userOrId) => {
  if (!userOrId) return '';
  if (typeof userOrId === 'string') return userOrId;
  if (userOrId._id) return userOrId._id.toString();
  if (userOrId.id) return userOrId.id.toString();
  return '';
};

const normalizeMessage = (msg) => ({
  ...msg,
  senderId:
    typeof msg.senderId === 'string'
      ? { _id: msg.senderId }
      : msg.senderId || {},
});

const normalizeMessages = (items = []) => items.map(normalizeMessage);

const createContactSkeleton = (user) => ({
  _id: user?._id,
  fullName: user?.fullName || 'Unknown user',
  userName: user?.userName || '',
  lastMessage: user?.lastMessage || 'No messages yet',
  lastMessageTime: user?.lastMessageTime || null,
});

const ChatPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contactsLoading, setContactsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/chat' } });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadContacts = async () => {
      setContactsLoading(true);
      const result = await chatService.getContacts();
      if (result.success) {
        const fetchedContacts = result.data || [];
        setContacts((prev) => {
          const fetchedIds = new Set(fetchedContacts.map((c) => c?._id));
          const preserved = prev.filter(
            (contact) => contact && !fetchedIds.has(contact._id)
          );
          return [...fetchedContacts, ...preserved];
        });
        setFetchError('');
      } else {
        setFetchError(result.message);
        showError(result.message);
      }
      setContactsLoading(false);
    };
    loadContacts();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !location.state?.peer) return;
    const peer = location.state.peer;

    setContacts((prev) => {
      const exists = prev.some((c) => c._id === peer._id);
      if (exists) {
        return prev;
      }
      return [createContactSkeleton(peer), ...prev];
    });

    openChat(peer);
    navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, isAuthenticated]);

  const openChat = async (contact) => {
    if (!contact?._id) return;
    setSelectedUser(contact);
    setMessages([]);
    setMessagesLoading(true);

    // Optimistic update: clear unread count locally
    setContacts((prev) =>
      prev.map((c) =>
        c._id === contact._id ? { ...c, unreadCount: 0 } : c
      )
    );

    // Mark as read in backend
    await chatService.markAsRead(contact._id);

    const result = await chatService.getConversation(contact._id);
    if (result.success) {
      setMessages(normalizeMessages(result.data?.messages));
      setFetchError('');
    } else {
      setFetchError(result.message);
      showError(result.message);
    }
    setMessagesLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    socketRef.current = initSocket();
    if (!socketRef.current) return;

    const handleReceive = (data) => {
      console.log('Socket receiveMessage:', data);

      // Normalize the incoming message immediately
      const message = normalizeMessage(data.message);
      const sender = message.senderId;

      // If the message is from the selected user OR from me (sync), add it to the list
      const selectedId = getSafeUserId(selectedUser);
      const senderId = getSafeUserId(sender);
      const myId = getSafeUserId(user);

      const isFromContact = selectedId && senderId && selectedId === senderId;
      const isFromMe = myId && senderId && myId === senderId;

      if (isFromContact || isFromMe) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });

        if (isFromContact) {
          chatService.markAsRead(sender._id);
        }
      }

      // Update sidebar
      if (sender?._id && !isFromMe) {
        // If viewing, don't increment unread
        const viewing = selectedId && senderId && selectedId === senderId;
        upsertContact(sender, message, !viewing);
      } else if (isFromMe && selectedUser) {
        upsertContact(selectedUser, message, false);
      }
    };

    const handleMessageSent = ({ message: rawMessage }) => {
      console.log('Socket messageSent:', rawMessage);
      if (rawMessage) {
        const message = normalizeMessage(rawMessage);

        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
        if (selectedUser?._id) {
          upsertContact(selectedUser, message, false);
        }
      }
    };

    const handleSocketError = (err) => {
      console.error('Socket error', err);
    };

    // Remove existing listeners before adding new ones
    socketRef.current.off('receiveMessage');
    socketRef.current.off('messageSent');
    socketRef.current.off('error');

    socketRef.current.on('receiveMessage', handleReceive);
    socketRef.current.on('messageSent', handleMessageSent);
    socketRef.current.on('error', handleSocketError);

    return () => {
      socketRef.current?.off('receiveMessage', handleReceive);
      socketRef.current?.off('messageSent', handleMessageSent);
      socketRef.current?.off('error', handleSocketError);
    };
  }, [isAuthenticated, selectedUser]);

  const upsertContact = (contactInfo, messagePayload, incrementUnread = false) => {
    setContacts((prev) => {
      const normalizedContact = createContactSkeleton(contactInfo);
      if (!normalizedContact._id) return prev;

      const existingContact = prev.find((c) => c._id === normalizedContact._id);
      const currentUnread = existingContact?.unreadCount || 0;

      const updatedContact = {
        ...normalizedContact,
        lastMessage: messagePayload?.content || normalizedContact.lastMessage,
        lastMessageTime:
          messagePayload?.createdAt || normalizedContact.lastMessageTime,
        unreadCount: incrementUnread ? currentUnread + 1 : currentUnread,
      };

      const filtered = prev.filter((c) => c._id !== normalizedContact._id);
      return [updatedContact, ...filtered];
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser?._id) return;
    if (!socketRef.current) {
      socketRef.current = initSocket();
    }
    if (!socketRef.current) {
      showError('Unable to connect to chat server');
      return;
    }

    socketRef.current.emit('sendMessage', {
      receiverId: selectedUser._id,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const FirstLetter = ({ name = '' }) => (
    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold border border-primary/20">
      {name.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-muted/20">
      <div className="w-96 bg-card border-r border-border flex flex-col">
        <div className="p-4 bg-primary text-primary-foreground text-xl font-bold">
          My Chats
        </div>
        <div className="flex-1 overflow-y-auto">
          {contactsLoading ? (
            <div className="p-4 text-muted-foreground">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="p-4 text-muted-foreground">No contacts yet.</div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => openChat(contact)}
                className={`p-4 flex items-center gap-3 hover:bg-muted/50 cursor-pointer border-b border-border ${selectedUser?._id === contact._id ? 'bg-muted' : ''
                  }`}
              >
                <div className="relative">
                  <FirstLetter name={contact.fullName} />
                  {contact.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-card">
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="font-semibold text-foreground truncate">{contact.fullName}</div>
                    {contact.lastMessageTime && (
                      <div className="text-[10px] text-muted-foreground ml-2 whitespace-nowrap">
                        {new Date(contact.lastMessageTime).toLocaleDateString() === new Date().toLocaleDateString()
                          ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : new Date(contact.lastMessageTime).toLocaleDateString()
                        }
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">@{contact.userName}</div>
                  <div className={`text-sm truncate ${contact.unreadCount > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                    {contact.lastMessage || 'No messages yet'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
              <FirstLetter name={selectedUser.fullName} />
              <div>
                <div className="font-semibold">{selectedUser.fullName}</div>
                <div className="text-sm opacity-90">@{selectedUser.userName}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
              {messagesLoading ? (
                <div className="text-muted-foreground">Loading chat...</div>
              ) : messages.length === 0 ? (
                <div className="text-muted-foreground">Start the conversation.</div>
              ) : (
                messages.map((msg) => {
                  // Robust ID handling
                  const myId = getSafeUserId(user);
                  const msgSenderId = getSafeUserId(msg.senderId);

                  // Strict ID match
                  const idMatch = myId && msgSenderId && myId === msgSenderId;
                  // Fallback Username match
                  const nameMatch = user?.userName && msg.senderId?.userName && user.userName === msg.senderId.userName;
                  const isMine = idMatch || nameMatch;

                  // Avatar / Name Logic:
                  // If it's mine, use MY details.
                  // If it's not mine, use the Partner's details (selectedUser).
                  const senderName = isMine ? user?.fullName : selectedUser?.fullName;

                  return (
                    <div
                      key={msg._id}
                      className={`mb-4 flex gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMine && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mt-1 shrink-0">
                          {senderName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${isMine
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground'
                          }`}
                      >
                        <div>{msg.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                            : ''}
                        </div>
                      </div>
                      {isMine && (
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-1 border border-primary/20 shrink-0">
                          {senderName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-card border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-input rounded-full outline-none focus:border-primary bg-background text-foreground"
                />
                <button
                  onClick={sendMessage}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90"
                >
                  Send
                </button>
              </div>
              {fetchError && (
                <p className="text-xs text-red-500 mt-2">{fetchError}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-xl">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;