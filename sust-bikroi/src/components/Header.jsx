import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showSuccess } from '../utils/notifications';
import { Search, MessageCircle, User, LogOut, ChevronDown, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { ModeToggle } from './mode-toggle';
import { chatService } from '../services/chatService';
import { initSocket } from '../services/socket';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch initial unread count
    const fetchUnreadCount = async () => {
      const result = await chatService.getContacts();
      if (result.success && result.data) {
        const total = result.data.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
        setUnreadCount(total);
      }
    };
    fetchUnreadCount();

    // Listen for new messages to update count
    socketRef.current = initSocket();
    if (socketRef.current) {
      const handleReceiveMessage = (data) => {
        // If we are NOT on the chat page (or even if we are, but not on that specific chat...
        // simpler to just increment. ChatPage handles marking as read which will update the count if we want to sync perfectly.
        // But for now, just incrementing on receive is good enough visual feedback.
        // Ideally we should listen to 'read' events too, but let's keep it simple.)
        setUnreadCount(prev => prev + 1);
      };

      // Also if we mark as read elsewhere (e.g. ChatPage), we might want to decrement?
      // That requires a shared context or event bus.
      // For now, let's just fetch count periodically or rely on user navigation to refresh.
      // Or simpler: The ChatPage marks as read. When navigating back, Header doesn't know.
      // A Global ChatContext would be best.
      // But requested is "when there is a new message... see red icon".
      // Incrementing is the MVP.
      socketRef.current.on('receiveMessage', handleReceiveMessage);

      return () => {
        socketRef.current?.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Site Name */}
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
            <span className="hidden text-xl font-bold tracking-tight text-foreground sm:block">
              SUST Exchange
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted/50 py-2.5 pl-10 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-primary p-2 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-sm active:scale-95"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                  title="Messages"
                  onClick={() => setUnreadCount(0)} // Reset on click for better UX (temporary fix until full sync)
                >
                  <MessageCircle className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-background animate-pulse" />
                  )}
                </Link>

                <Link
                  to="/sell"
                  className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-primary/30 sm:flex"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Sell Item</span>
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 rounded-lg py-1 pl-2 pr-1 transition-colors hover:bg-muted">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 text-xs font-bold text-white shadow-sm ring-2 ring-background">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 translate-y-2 opacity-0 invisible transform rounded-xl border border-border bg-popover p-2 shadow-xl shadow-black/5 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible">
                    <div className="mb-2 px-3 py-2">
                      <p className="text-sm font-medium text-foreground truncate">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>

                    <div className="h-px bg-border mb-1" />

                    <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:shadow-lg"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

