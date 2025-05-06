
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MessageSquare,
  User,
  Users,
  Bell,
  Settings,
  Search,
  Send,
  Smile,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageCircle,
  Plus,
  UserPlus,
  Wallpaper,
  Trash2,
  LogIn,
  LogOut,
} from "lucide-react";

// Types
interface UserType {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "busy" | "offline";
  lastActive?: string;
  isTyping?: boolean;
  email?: string;
  phone?: string;
  location?: string;
  isContact?: boolean;
}

interface MessageType {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  reactions: {
    [key: string]: string[];
  };
  isRead: boolean;
  deleted?: boolean;
}

interface ChatType {
  id: string;
  participants: UserType[];
  messages: MessageType[];
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}

interface WallpaperType {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

interface AuthStateType {
  isAuthenticated: boolean;
  currentUser: UserType | null;
}

// Mock Data
const initialUsers: UserType[] = [
  {
    id: "1",
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    status: "online",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    isContact: true,
  },
  {
    id: "2",
    name: "James Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    status: "busy",
    email: "james.rodriguez@example.com",
    phone: "+1 (555) 987-6543",
    location: "Los Angeles, CA",
    isContact: true,
  },
  {
    id: "3",
    name: "Sophia Chen",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "away",
    lastActive: "10m ago",
    email: "sophia.chen@example.com",
    phone: "+1 (555) 234-5678",
    location: "Chicago, IL",
    isContact: true,
  },
  {
    id: "4",
    name: "Liam Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "online",
    email: "liam.johnson@example.com",
    phone: "+1 (555) 345-6789",
    location: "Miami, FL",
    isContact: false,
  },
  {
    id: "5",
    name: "Olivia Davis",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    status: "offline",
    lastActive: "3h ago",
    email: "olivia.davis@example.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    isContact: false,
  },
  {
    id: "6",
    name: "Noah Smith",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    status: "online",
    email: "noah.smith@example.com",
    phone: "+1 (555) 567-8901",
    location: "San Francisco, CA",
  },
  {
    id: "7",
    name: "Ava Brown",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    status: "online",
    email: "ava.brown@example.com",
    phone: "+1 (555) 678-9012",
    location: "Austin, TX",
    isContact: false,
  },
  {
    id: "8",
    name: "Ethan Miller",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    status: "away",
    lastActive: "30m ago",
    email: "ethan.miller@example.com",
    phone: "+1 (555) 789-0123",
    location: "Denver, CO",
    isContact: false,
  },
];

const activityData = [
  { name: "Mon", messages: 10 },
  { name: "Tue", messages: 25 },
  { name: "Wed", messages: 15 },
  { name: "Thu", messages: 30 },
  { name: "Fri", messages: 22 },
  { name: "Sat", messages: 8 },
  { name: "Sun", messages: 5 },
];

const currentUserId = "6"; // Emmma Wilson

const initialChats: ChatType[] = [
  {
    id: "chat1",
    participants: [
      initialUsers.find((user) => user.id === "1")!,
      initialUsers.find((user) => user.id === currentUserId)!,
    ],
    messages: [
      {
        id: "msg1",
        senderId: "1",
        content: "Hey Noah, how's your day going?",
        timestamp: "10:30 AM",
        reactions: {},
        isRead: true,
      },
      {
        id: "msg2",
        senderId: currentUserId,
        content: "Pretty good! Just finishing up some work. How about you?",
        timestamp: "10:32 AM",
        reactions: {
          "👍": ["1"],
        },
        isRead: true,
      },
      {
        id: "msg3",
        senderId: "1",
        content: "I'm great! Planning to go hiking this weekend. Would you like to join?",
        timestamp: "10:35 AM",
        reactions: {},
        isRead: false,
      },
    ],
    unreadCount: 1,
  },
  {
    id: "chat2",
    participants: [
      initialUsers.find((user) => user.id === "2")!,
      initialUsers.find((user) => user.id === currentUserId)!,
    ],
    messages: [
      {
        id: "msg4",
        senderId: "2",
        content: "Did you get the files I sent?",
        timestamp: "Yesterday",
        reactions: {},
        isRead: true,
      },
      {
        id: "msg5",
        senderId: currentUserId,
        content: "Yes, I'm reviewing them now. Will get back to you soon!",
        timestamp: "Yesterday",
        reactions: {},
        isRead: true,
      },
      {
        id: "msg6",
        senderId: "2",
        content: "Sounds good. Let me know if you have any questions.",
        timestamp: "Yesterday",
        reactions: {},
        isRead: true,
      },
    ],
    unreadCount: 0,
  },
  {
    id: "chat3",
    participants: [
      initialUsers.find((user) => user.id === "3")!,
      initialUsers.find((user) => user.id === currentUserId)!,
    ],
    messages: [
      {
        id: "msg7",
        senderId: currentUserId,
        content: "Hi Sophia, are we still meeting at 3PM?",
        timestamp: "Yesterday",
        reactions: {},
        isRead: true,
      },
      {
        id: "msg8",
        senderId: "3",
        content: "Yes, I'll be there! See you at the coffee shop.",
        timestamp: "Yesterday",
        reactions: {
          "👍": [currentUserId],
        },
        isRead: true,
      },
      {
        id: "msg9",
        senderId: "3",
        content: "Actually, can we move it to 4PM? Something came up.",
        timestamp: "1 hour ago",
        reactions: {},
        isRead: false,
      },
    ],
    unreadCount: 1,
  },
  {
    id: "group1",
    isGroup: true,
    groupName: "Project Alpha Team",
    groupAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    participants: [
      initialUsers.find((user) => user.id === "1")!,
      initialUsers.find((user) => user.id === "2")!,
      initialUsers.find((user) => user.id === "3")!,
      initialUsers.find((user) => user.id === currentUserId)!,
    ],
    messages: [
      {
        id: "grp1",
        senderId: "1",
        content: "Hey team, just checking in on our project progress.",
        timestamp: "Yesterday",
        reactions: {
          "👍": ["2", "3", currentUserId],
        },
        isRead: true,
      },
      {
        id: "grp2",
        senderId: "2",
        content: "I've completed the design phase. Will share mockups later today.",
        timestamp: "Yesterday",
        reactions: {
          "🎉": ["1", currentUserId],
        },
        isRead: true,
      },
      {
        id: "grp3",
        senderId: currentUserId,
        content: "Great work everyone! I'll prepare the presentation for Friday's meeting.",
        timestamp: "This morning",
        reactions: {},
        isRead: true,
      },
    ],
    unreadCount: 0,
  },
];

// Emoji reactions
const emojiList = ["👍", "❤️", "😂", "😮", "😢", "👏"];

// Status options
const statusOptions = [
  { label: "Online", value: "online", color: "bg-green-500" },
  { label: "Away", value: "away", color: "bg-yellow-500" },
  { label: "Busy", value: "busy", color: "bg-red-500" },
  { label: "Offline", value: "offline", color: "bg-gray-400" },
];

// Wallpaper options
const wallpaperOptions: WallpaperType[] = [
  {
    id: "wp1",
    name: "Default",
    url: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=1740&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: "wp2",
    name: "Gradient Blue",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1740&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: "wp3",
    name: "Abstract",
    url: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1740&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: "wp4",
    name: "Nature",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: "wp5",
    name: "Dark",
    url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=100&auto=format&fit=crop",
  },
];

const Index = () => {
  // Auth State
  const [authState, setAuthState] = useState<AuthStateType>({
    isAuthenticated: false,
    currentUser: null,
  });
  
  // State
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [chats, setChats] = useState<ChatType[]>(initialChats);
  const [activeChat, setActiveChat] = useState<ChatType | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "busy" | "offline">("online");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(0);
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"chats" | "contacts" | "groups">("chats");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>(wallpaperOptions[0].url);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState<string | null>(null);
  const [showMessageOptions, setShowMessageOptions] = useState<string | null>(null);
  const [showSearchMessages, setShowSearchMessages] = useState(false);
  const [searchResults, setSearchResults] = useState<{chatId: string, messages: MessageType[]}[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: "", password: "" });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for stored auth on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('wavetalk_auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthState(parsedAuth);
        
        // Set current user data
        if (parsedAuth.isAuthenticated && parsedAuth.currentUser) {
          const currentUser = users.find(u => u.id === parsedAuth.currentUser.id);
          if (currentUser) {
            setUserStatus(currentUser.status);
          }
        }
      } catch (e) {
        console.error("Failed to parse stored auth", e);
        localStorage.removeItem('wavetalk_auth');
      }
    }
  }, []);

  // Update local storage when auth changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('wavetalk_auth', JSON.stringify(authState));
    } else {
      localStorage.removeItem('wavetalk_auth');
    }
  }, [authState]);

  // Effects
  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages]);

  // Simulate other users typing periodically
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    
    const typingInterval = setInterval(() => {
      if (activeChat) {
        const otherUser = activeChat.participants.find((p) => p.id !== authState.currentUser?.id);
        if (otherUser && Math.random() > 0.1) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === otherUser.id ? { ...user, isTyping: true } : user
            )
          );

          setTimeout(() => {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === otherUser.id ? { ...user, isTyping: false } : user
              )
            );
          }, 3000);
        }
      }
    }, 8000);

    return () => clearInterval(typingInterval);
  }, [activeChat, authState]);

  // Simulate receiving new messages occasionally
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    
    const messageInterval = setInterval(() => {
      if (activeChat && Math.random() > 0.8) {
        const otherUser = activeChat.participants.find((p) => p.id !== authState.currentUser?.id);
        if (otherUser) {
          const randomMessages = [
            "Hey, how's it going?",
            "Did you see that new movie?",
            "I'm heading out for lunch, want to join?",
            "Can you send me those files when you get a chance?",
            "Let's catch up soon!",
          ];
          const randomMessage =
            randomMessages[Math.floor(Math.random() * randomMessages.length)];

          const newMsg: MessageType = {
            id: `msg${Date.now()}`,
            senderId: otherUser.id,
            content: randomMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            reactions: {},
            isRead: false,
          };

          setChats((prevChats) =>
            prevChats.map((chat) => {
              if (chat.id === activeChat.id) {
                return {
                  ...chat,
                  messages: [...chat.messages, newMsg],
                  unreadCount: chat.unreadCount + 1,
                };
              }
              return chat;
            })
          );
        }
      }
    }, 45000);

    return () => clearInterval(messageInterval);
  }, [activeChat, authState]);

  // Handle typing indicator
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingTimer);
  }, [lastTypingTime]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setLastTypingTime(Date.now());
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChat && authState.isAuthenticated) {
      const newMsg: MessageType = {
        id: `msg${Date.now()}`,
        senderId: authState.currentUser?.id || "",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reactions: {},
        isRead: false,
      };

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, newMsg],
            };
          }
          return chat;
        })
      );

      // Update active chat
      setActiveChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMsg],
        };
      });

      setNewMessage("");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectChat = (chat: ChatType) => {
    // Mark messages as read when selecting chat
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            unreadCount: 0,
            messages: c.messages.map((msg) => ({ ...msg, isRead: true })),
          };
        }
        return c;
      })
    );

    setActiveChat(
      chats.find((c) => c.id === chat.id) || null
    );
    
    // Close search when changing chats
    setShowSearchMessages(false);
    setMessageSearchTerm("");
    setSearchResults([]);
  };

  const handleStatusChange = (status: "online" | "away" | "busy" | "offline") => {
    setUserStatus(status);
    // Update current user in users list
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === authState.currentUser?.id ? { ...user, status } : user
      )
    );
    
    // Update auth state
    if (authState.currentUser) {
      setAuthState({
        ...authState,
        currentUser: {
          ...authState.currentUser,
          status
        }
      });
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!authState.isAuthenticated) return;
    
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChat?.id) {
          return {
            ...chat,
            messages: chat.messages.map((message) => {
              if (message.id === messageId) {
                const reactions = { ...message.reactions };
                
                if (!reactions[emoji]) {
                  reactions[emoji] = [authState.currentUser?.id || ""];
                } else if (!reactions[emoji].includes(authState.currentUser?.id || "")) {
                  reactions[emoji] = [...reactions[emoji], authState.currentUser?.id || ""];
                } else {
                  reactions[emoji] = reactions[emoji].filter(id => id !== authState.currentUser?.id);
                  if (reactions[emoji].length === 0) {
                    delete reactions[emoji];
                  }
                }
                
                return {
                  ...message,
                  reactions,
                };
              }
              return message;
            }),
          };
        }
        return chat;
      })
    );

    setActiveChat((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: prev.messages.map((message) => {
          if (message.id === messageId) {
            const reactions = { ...message.reactions };
            
            if (!reactions[emoji]) {
              reactions[emoji] = [authState.currentUser?.id || ""];
            } else if (!reactions[emoji].includes(authState.currentUser?.id || "")) {
              reactions[emoji] = [...reactions[emoji], authState.currentUser?.id || ""];
            } else {
              reactions[emoji] = reactions[emoji].filter(id => id !== authState.currentUser?.id);
              if (reactions[emoji].length === 0) {
                delete reactions[emoji];
              }
            }
            
            return {
              ...message,
              reactions,
            };
          }
          return message;
        }),
      };
    });

    setReactionTarget(null);
  };

  const handleSendQuickStatus = (status: string) => {
    if (activeChat && authState.isAuthenticated) {
      const newMsg: MessageType = {
        id: `msg${Date.now()}`,
        senderId: authState.currentUser?.id || "",
        content: `[${status}]`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reactions: {},
        isRead: false,
      };

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, newMsg],
            };
          }
          return chat;
        })
      );

      setActiveChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMsg],
        };
      });
    }
  };

  const filterUsers = useCallback(() => {
    if (currentView === "contacts") {
      return users.filter(
        (user) => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          user.id !== authState.currentUser?.id &&
          (user.isContact || false)
      );
    }
    
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== authState.currentUser?.id
    );
  }, [users, searchTerm, currentView, authState]);

  const filterChats = useCallback(() => {
    if (currentView === "groups") {
      return chats.filter(
        (chat) => 
          chat.isGroup && 
          (chat.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    if (currentView === "chats") {
      return chats.filter(
        (chat) => 
          !chat.isGroup && 
          chat.participants.some(p => 
            p.id !== authState.currentUser?.id && 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return [];
  }, [chats, searchTerm, currentView, authState]);

  const handleCreateGroup = () => {
    if (!authState.isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (newGroupName.trim() && selectedContacts.length > 0) {
      const newGroup: ChatType = {
        id: `group${Date.now()}`,
        isGroup: true,
        groupName: newGroupName,
        groupAvatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9) + 1}.jpg`,
        participants: [
          ...users.filter(user => selectedContacts.includes(user.id)),
          users.find(user => user.id === authState.currentUser?.id)!
        ],
        messages: [],
        unreadCount: 0
      };

      setChats([...chats, newGroup]);
      setNewGroupName("");
      setSelectedContacts([]);
      setShowNewGroup(false);
      setActiveChat(newGroup);
      setCurrentView("groups");
    }
  };

  const handleToggleContact = (userId: string) => {
    if (selectedContacts.includes(userId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== userId));
    } else {
      setSelectedContacts([...selectedContacts, userId]);
    }
  };

  const handleAddToContacts = (userId: string) => {
    if (!authState.isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isContact: true } : user
    ));
  };

  const handleCreateContact = (newUser: UserType) => {
    if (!authState.isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    const newUserId = `user${Date.now()}`;
    const userWithId = {
      ...newUser,
      id: newUserId,
      isContact: true
    };
    
    setUsers([...users, userWithId]);
    setShowAddContact(false);
  };
  
  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
    setShowChatOptions(null);
  };
  
  const handleDeleteMessage = (messageId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === activeChat?.id) {
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === messageId 
                ? { ...msg, deleted: true, content: "This message was deleted" }
                : msg
            )
          };
        }
        return chat;
      })
    );
    
    setActiveChat(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, deleted: true, content: "This message was deleted" }
            : msg
        )
      };
    });
    
    setShowMessageOptions(null);
  };
  
  const handleSearchMessages = () => {
    if (!messageSearchTerm.trim()) return;
    
    const results = chats.map(chat => {
      const filteredMessages = chat.messages.filter(
        msg => !msg.deleted && msg.content.toLowerCase().includes(messageSearchTerm.toLowerCase())
      );
      
      return {
        chatId: chat.id,
        messages: filteredMessages
      };
    }).filter(result => result.messages.length > 0);
    
    setSearchResults(results);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find user by email (mock login)
    const foundUser = users.find(u => 
      u.name === "Noah Smith" 
    );

    
    if (foundUser) {
      setAuthState({
        isAuthenticated: true,
        currentUser: foundUser
      });
      setUserStatus(foundUser.status);
      setShowLoginModal(false);
      
      // Set initial active chat
      if (chats.length > 0) {
        setActiveChat(chats[0]);
      }
    } else {
      alert("Invalid credentials. Try any email from the contacts list with password: password");
    }
  };
  
  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      currentUser: null
    });
    setActiveChat(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 p-4 text-white shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6" />
            <h1 className="text-xl font-bold">Chat App</h1>
          </div>
          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <>
                <button 
                  className="relative text-white hover:text-indigo-200 transition-colors"
                  onClick={() => console.log("Notifications clicked")}
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  className="text-white hover:text-indigo-200 transition-colors"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-6 w-6" />
                </button>
                <div 
                  className="flex items-center cursor-pointer space-x-2"
                  onClick={() => setShowUserInfo(!showUserInfo)}
                >
                  <div className="relative">
                    <img
                      src={authState.currentUser?.avatar || "https://randomuser.me/api/portraits/men/54.jpg"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-white"
                    />
                    <div 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        authState.currentUser?.status === "online" ? "bg-green-500" :
                        authState.currentUser?.status === "away" ? "bg-yellow-500" :
                        authState.currentUser?.status === "busy" ? "bg-red-500" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="ml-2 flex items-center bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="flex items-center bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-full text-sm"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-3 font-medium text-sm ${currentView === 'chats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setCurrentView('chats')}
            >
              Chats
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm ${currentView === 'groups' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setCurrentView('groups')}
            >
              Groups
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm ${currentView === 'contacts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setCurrentView('contacts')}
            >
              Contacts
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={currentView === 'contacts' ? "Search contacts..." : currentView === 'groups' ? "Search groups..." : "Search chats..."}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Add New Button */}
          {currentView === 'contacts' && (
            <div className="p-2 flex justify-end">
              <button 
                onClick={() => authState.isAuthenticated ? setShowAddContact(true) : setShowLoginModal(true)}
                className="flex items-center justify-center p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                <UserPlus size={16} />
              </button>
            </div>
          )}

          {currentView === 'groups' && (
            <div className="p-2 flex justify-end">
              <button 
                onClick={() => authState.isAuthenticated ? setShowNewGroup(true) : setShowLoginModal(true)}
                className="flex items-center justify-center p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Users size={16} />
              </button>
            </div>
          )}

          {/* Contacts/Chats/Groups List */}
          <div className="flex-1 overflow-y-auto">
            {!authState.isAuthenticated && (
              <div className="p-6 text-center">
                <User className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Please login to see your conversations</p>
                <button 
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
              </div>
            )}

            {authState.isAuthenticated && currentView === 'chats' && (
              <>
                <div className="py-2 px-4 border-b border-gray-200">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Active Conversations
                  </h2>
                </div>
                <ul>
                  {filterChats().map((chat) => {
                    const otherUser = chat.participants.find(p => p.id !== authState.currentUser?.id);
                    if (!otherUser) return null;
                    
                    return (
                      <motion.li
                        key={chat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          activeChat?.id === chat.id ? "bg-gray-100" : ""
                        } relative`}
                        onClick={() => handleSelectChat(chat)}
                      >
                        <div className="px-4 py-3 flex items-center">
                          <div className="relative">
                            <img
                              src={otherUser.avatar}
                              alt={otherUser.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            <div 
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                otherUser.status === "online" ? "bg-green-500" :
                                otherUser.status === "away" ? "bg-yellow-500" :
                                otherUser.status === "busy" ? "bg-red-500" : "bg-gray-400"
                              }`}
                            ></div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">{otherUser.name}</h3>
                              <span className="text-xs text-gray-500">
                                {chat.messages[chat.messages.length - 1]?.timestamp || ""}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                {otherUser.isTyping ? (
                                  <span className="text-indigo-600 font-medium">typing...</span>
                                ) : (
                                  chat.messages[chat.messages.length - 1]?.deleted ? 
                                  "Message was deleted" :
                                  chat.messages[chat.messages.length - 1]?.content || "No messages yet"
                                )}
                              </p>
                              {chat.unreadCount > 0 && (
                                <span className="bg-indigo-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Chat options button */}
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowChatOptions(showChatOptions === chat.id ? null : chat.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded-full"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            
                            {/* Chat options dropdown */}
                            {showChatOptions === chat.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteChat(chat.id);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete conversation
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                  
                  {filterChats().length === 0 && (
                    <div className="p-6 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">No chats found</p>
                    </div>
                  )}
                </ul>
              </>
            )}

            {authState.isAuthenticated && currentView === 'groups' && (
              <>
                <div className="py-2 px-4 border-b border-gray-200">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Your Groups
                  </h2>
                </div>
                <ul>
                  {filterChats().map((group) => (
                    <motion.li
                      key={group.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        activeChat?.id === group.id ? "bg-gray-100" : ""
                      } relative`}
                      onClick={() => handleSelectChat(group)}
                    >
                      <div className="px-4 py-3 flex items-center">
                        <div className="relative">
                          <img
                            src={group.groupAvatar}
                            alt={group.groupName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="absolute bottom-0 right-0 h-5 w-5 bg-indigo-100 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-[9px] font-medium text-indigo-600">
                              {group.participants.length}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{group.groupName}</h3>
                            <span className="text-xs text-gray-500">
                              {group.messages[group.messages.length - 1]?.timestamp || ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">
                              {group.messages.length > 0 ? 
                                `${users.find(u => u.id === group.messages[group.messages.length - 1].senderId)?.name.split(' ')[0] || 'Someone'}: ${group.messages[group.messages.length - 1].deleted ? 'Message was deleted' : group.messages[group.messages.length - 1].content}` : 
                                "No messages yet"
                              }
                            </p>
                            {group.unreadCount > 0 && (
                              <span className="bg-indigo-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                {group.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Group options button */}
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowChatOptions(showChatOptions === group.id ? null : group.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          
                          {/* Group options dropdown */}
                          {showChatOptions === group.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChat(group.id);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete group
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                  {filterChats().length === 0 && (
                    <div className="p-6 text-center">
                      <Users className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">No groups found</p>
                      <button 
                        className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                        onClick={() => setShowNewGroup(true)}
                      >
                        Create a Group
                      </button>
                    </div>
                  )}
                </ul>
              </>
            )}

            {authState.isAuthenticated && currentView === 'contacts' && (
              <>
                <div className="py-2 px-4 border-b border-gray-200">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Your Contacts
                  </h2>
                </div>
                <ul>
                  {filterUsers().map((user) => (
                    <motion.li
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        // Find if there's an existing chat with this user
                        const existingChat = chats.find(
                          chat => !chat.isGroup && chat.participants.some(p => p.id === user.id)
                        );
                        
                        if (existingChat) {
                          handleSelectChat(existingChat);
                        } else {
                          // Create a new chat when clicking on a user
                          const newChat: ChatType = {
                            id: `chat${Date.now()}`,
                            participants: [user, users.find(u => u.id === authState.currentUser?.id)!],
                            messages: [],
                            unreadCount: 0,
                          };
                          setChats([...chats, newChat]);
                          setActiveChat(newChat);
                        }
                        setCurrentView("chats");
                      }}
                    >
                      <div className="px-4 py-3 flex items-center">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div 
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                              user.status === "online" ? "bg-green-500" :
                              user.status === "away" ? "bg-yellow-500" :
                              user.status === "busy" ? "bg-red-500" : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium">{user.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {user.status === "online" ? "Active now" : 
                               user.status === "away" ? "Away" :
                               user.status === "busy" ? "Do not disturb" :
                               user.lastActive ? `Last seen ${user.lastActive}` : "Offline"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="py-2 px-4 border-b border-t border-gray-200 mt-4">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Suggested Contacts
                  </h2>
                </div>
                <ul>
                  {users.filter(u => !u.isContact && u.id !== authState.currentUser?.id).slice(0, 3).map((user) => (
                    <motion.li
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <div className="px-4 py-3 flex items-center">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div 
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                              user.status === "online" ? "bg-green-500" :
                              user.status === "away" ? "bg-yellow-500" :
                              user.status === "busy" ? "bg-red-500" : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{user.name}</h3>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToContacts(user.id);
                              }}
                              className="p-1 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200"
                            >
                              <UserPlus size={14} />
                            </button>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">{user.location || "Unknown location"}</span>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {activeChat && authState.isAuthenticated ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  {activeChat.isGroup ? (
                    <>
                      <div className="relative">
                        <img
                          src={activeChat.groupAvatar}
                          alt={activeChat.groupName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 h-5 w-5 bg-indigo-100 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-[9px] font-medium text-indigo-600">
                            {activeChat.participants.length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h2 className="text-lg font-medium">{activeChat.groupName}</h2>
                        <p className="text-xs text-gray-500">
                          {activeChat.participants.length} members
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <img
                          src={activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.avatar}
                          alt="Contact"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.status === "online" ? "bg-green-500" :
                            activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.status === "away" ? "bg-yellow-500" :
                            activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.status === "busy" ? "bg-red-500" : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div className="ml-3">
                        <h2 className="text-lg font-medium">
                          {activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.name}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.isTyping ? (
                            <span className="text-indigo-600">typing...</span>
                          ) : (
                            activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.status === "online" ? "Active now" : 
                            activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.status === "away" ? "Away" :
                            activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.status === "busy" ? "Do not disturb" :
                            activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.lastActive ? 
                              `Last seen ${activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.lastActive}` : 
                              "Offline"
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => setShowSearchMessages(!showSearchMessages)}
                  >
                    <Search className="h-5 w-5 text-gray-500" />
                  </button>
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => setShowWallpaperPicker(true)}
                  >
                    <Wallpaper className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Message Search Bar */}
              {showSearchMessages && (
                <div className="p-2 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search in conversation..."
                      className="flex-1 py-1.5 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={messageSearchTerm}
                      onChange={(e) => setMessageSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchMessages()}
                    />
                    <button
                      className="bg-indigo-600 text-white px-4 py-1.5 rounded-r-lg hover:bg-indigo-700 transition-colors"
                      onClick={handleSearchMessages}
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto bg-white rounded-lg shadow-md border border-gray-200">
                      <div className="p-2 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-xs font-medium text-gray-700">{searchResults.reduce((acc, result) => acc + result.messages.length, 0)} results found</h3>
                      </div>
                      
                      {searchResults.map((result) => {
                        const chat = chats.find(c => c.id === result.chatId);
                        if (!chat) return null;
                        
                        return result.messages.map(msg => {
                          const sender = chat.participants.find(p => p.id === msg.senderId);
                          
                          return (
                            <div 
                              key={msg.id} 
                              className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                handleSelectChat(chat);
                                setShowSearchMessages(false);
                                setMessageSearchTerm("");
                                setSearchResults([]);
                                
                                // Scroll to message (simple implementation)
                                setTimeout(() => {
                                  const msgEl = document.getElementById(`msg-${msg.id}`);
                                  if (msgEl) {
                                    msgEl.scrollIntoView({ behavior: "smooth" });
                                    msgEl.classList.add("bg-indigo-100");
                                    setTimeout(() => msgEl.classList.remove("bg-indigo-100"), 2000);
                                  }
                                }, 300);
                              }}
                            >
                              <div className="flex items-center">
                                <img 
                                  src={sender?.avatar || ""} 
                                  alt={sender?.name || "User"}
                                  className="h-6 w-6 rounded-full mr-2" 
                                />
                                <div>
                                  <p className="text-xs font-medium">{sender?.name} <span className="text-gray-400 font-normal">• {msg.timestamp}</span></p>
                                  <p className="text-sm truncate">
                                    {msg.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })}
                    </div>
                  )}
                  
                  {searchResults.length === 0 && messageSearchTerm && (
                    <div className="mt-2 p-3 bg-white rounded-lg text-center border border-gray-200">
                      <p className="text-sm text-gray-500">No messages found matching "{messageSearchTerm}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{
                  backgroundImage: `url(${selectedWallpaper})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg text-center shadow-sm">
                  {activeChat.isGroup ? (
                    <>
                      <h3 className="font-medium">{activeChat.groupName}</h3>
                      <p className="text-sm text-gray-500">Group created with {activeChat.participants.length} members</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium">Conversation with {activeChat.participants.find(p => p.id !== authState.currentUser?.id)?.name}</h3>
                      <p className="text-sm text-gray-500">This conversation is private</p>
                    </>
                  )}
                </div>

                {activeChat.messages.map((message) => {
                  const isCurrentUser = message.senderId === authState.currentUser?.id;
                  const sender = activeChat.participants.find(p => p.id === message.senderId);

                  return (
                    <motion.div
                      id={`msg-${message.id}`}
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} relative transition-colors duration-300`}
                    >
                      <div className="flex items-end">
                        {!isCurrentUser && (
                          <img
                            src={sender?.avatar || ""}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full mr-2 mb-1 object-cover"
                          />
                        )}
                        <div className="group relative">
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              message.deleted 
                                ? "bg-gray-200 text-gray-500 italic" 
                                : isCurrentUser
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white text-gray-800 border border-gray-200"
                            } shadow-sm`}
                          >
                            {activeChat.isGroup && !isCurrentUser && (
                              <p className="text-xs font-medium mb-1">{sender?.name}</p>
                            )}
                            
                            {message.content.startsWith("[") && message.content.endsWith("]") ? (
                              <div className="italic text-sm">
                                {isCurrentUser ? "I am" : sender?.name + " is"} {message.content.replace(/[[\]]/g, "")}
                              </div>
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                            <div className={`text-xs mt-1 ${isCurrentUser ? "text-indigo-200" : "text-gray-500"}`}>
                              {message.timestamp}
                              {isCurrentUser && message.isRead && (
                                <span className="ml-1">✓</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Reaction and delete buttons */}
                          {!message.deleted && (
                            <div 
                              className="hidden group-hover:flex absolute top-0 right-0 transform translate-x-6 -translate-y-1/2 space-x-1"
                            >
                              {/* Reaction button */}
                              <button 
                                className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                                onClick={() => setReactionTarget(message.id)}
                              >
                                <Smile className="h-4 w-4 text-gray-500" />
                              </button>
                              
                              {/* Delete button (only for current user's messages) */}
                              {isCurrentUser && (
                                <button
                                  className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                                  onClick={() => setShowMessageOptions(message.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Message Options Dropdown */}
                          {showMessageOptions === message.id && (
                            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-1/2 bg-white rounded-lg shadow-md z-10 p-2">
                              <button
                                className="flex items-center px-3 py-1 text-xs text-red-600 hover:bg-gray-100 rounded-md"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash2 size={12} className="mr-1" />
                                Delete message
                              </button>
                            </div>
                          )}

                          {/* Reactions */}
                          {!message.deleted && Object.keys(message.reactions).length > 0 && (
                            <div className={`flex space-x-1 mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                              {Object.entries(message.reactions).map(([emoji, users]) => (
                                <div 
                                  key={emoji} 
                                  className="bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 text-xs flex items-center"
                                  onClick={() => handleAddReaction(message.id, emoji)}
                                >
                                  <span className="mr-1">{emoji}</span>
                                  <span className="text-gray-500">{users.length}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Emoji Picker */}
                      {reactionTarget === message.id && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-0 right-0 bg-white rounded-lg shadow-xl p-2 z-10 flex"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {emojiList.map(emoji => (
                            <button 
                              key={emoji} 
                              className="p-1.5 hover:bg-gray-100 rounded-full text-lg"
                              onClick={() => handleAddReaction(message.id, emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Status Bar */}
              <div className="px-4 py-2 border-t border-gray-200 flex space-x-2 bg-white">
                {["brb", "busy", "on a call", "at lunch"].map(status => (
                  <button 
                    key={status}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-xs text-gray-700"
                    onClick={() => handleSendQuickStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                {isTyping && (
                  <div className="text-xs text-gray-500 mt-1">
                    You are typing...
                  </div>
                )}
              </div>
            </>
          ) : (
            <div 
              className="flex-1 flex flex-col items-center justify-center"
              style={{
                backgroundImage: `url(${selectedWallpaper})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <MessageSquare className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">Welcome to Chat App</h2>
                {authState.isAuthenticated ? (
                  <p className="text-gray-600 max-w-md mb-4">
                    Select a conversation to start chatting, or start a new conversation with one of your contacts.
                  </p>
                ) : (
                  <p className="text-gray-600 max-w-md mb-4">
                    Please log in to start chatting with your contacts.
                  </p>
                )}
                <div className="flex space-x-4 justify-center">
                  {authState.isAuthenticated ? (
                    <>
                      <button 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        onClick={() => setCurrentView('contacts')}
                      >
                        View Contacts
                      </button>
                      <button 
                        className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                        onClick={() => setShowNewGroup(true)}
                      >
                        Create Group
                      </button>
                    </>
                  ) : (
                    <button 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      onClick={() => setShowLoginModal(true)}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Login to Chat App
                  </h2>
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="String"
                      placeholder="Enter your name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={loginCredentials.email}
                      onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Try name: Noah Smith
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="Integer"
                      placeholder="Enter your phone number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={loginCredentials.password}
                      onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use Phone number : 9999999999
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Status */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                    <div className="space-y-2">
                      {statusOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center p-2 rounded-md cursor-pointer ${
                            userStatus === option.value
                              ? "bg-indigo-50 border border-indigo-200"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleStatusChange(option.value as any)}
                        >
                          <div className={`h-3 w-3 rounded-full ${option.color} mr-2`}></div>
                          <span>{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Messaging Activity */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Your Messaging Activity</h3>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Area
                            type="monotone"
                            dataKey="messages"
                            stroke="#6366F1"
                            fill="#8884d8"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* App Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">App Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sound</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Wallpaper */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Chat Wallpaper</h3>
                    <button 
                      onClick={() => setShowWallpaperPicker(true)}
                      className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      <Wallpaper className="h-4 w-4 mr-2" />
                      Change Wallpaper
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Info Modal */}
      <AnimatePresence>
        {showUserInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
            onClick={() => setShowUserInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Profile</h2>
                  <button
                    onClick={() => setShowUserInfo(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <img
                    src={authState.currentUser?.avatar || "https://randomuser.me/api/portraits/men/54.jpg"}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-medium">{authState.currentUser?.name || "Guest"}</h3>
                  <div className="flex items-center mt-1">
                    <div className={`h-2 w-2 rounded-full ${
                      userStatus === "online" ? "bg-green-500" :
                      userStatus === "away" ? "bg-yellow-500" :
                      userStatus === "busy" ? "bg-red-500" : "bg-gray-400"
                    } mr-2`}></div>
                    <span className="text-sm text-gray-500">
                      {userStatus === "online" ? "Online" :
                       userStatus === "away" ? "Away" :
                       userStatus === "busy" ? "Busy" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={authState.currentUser?.email || "Not set"}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={authState.currentUser?.phone || "Not set"}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={authState.currentUser?.location || "Not set"}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Group Modal */}
      <AnimatePresence>
        {showNewGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
            onClick={() => setShowNewGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Create New Group</h2>
                  <button
                    onClick={() => setShowNewGroup(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter group name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Members
                    </label>
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                      {users.filter(user => user.id !== authState.currentUser?.id && (user.isContact || false)).map((user) => (
                        <div 
                          key={user.id}
                          className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={selectedContacts.includes(user.id)}
                            onChange={() => handleToggleContact(user.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`user-${user.id}`} className="flex items-center ml-3 cursor-pointer flex-1">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-8 w-8 rounded-full object-cover mr-2" 
                            />
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.status === 'online' ? 'Online' : 'Offline'}</p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={handleCreateGroup}
                      disabled={!newGroupName.trim() || selectedContacts.length === 0}
                    >
                      Create Group
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
            onClick={() => setShowAddContact(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Add New Contact</h2>
                  <button
                    onClick={() => setShowAddContact(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter contact name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      id="contact-name"
                    />
                  </div>
                  

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      id="contact-phone"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      onClick={() => {
                        const name = (document.getElementById('contact-name') as HTMLInputElement).value;
                        const phone = (document.getElementById('contact-phone') as HTMLInputElement).value;
                        
                        if (name) {
                          handleCreateContact({
                            id: '', // Will be set in handleCreateContact
                            name,
                            phone,
                            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`,
                            status: 'offline',
                            isContact: true,
                          });
                        }
                      }}
                    >
                      Add Contact
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallpaper Picker Modal */}
      <AnimatePresence>
        {showWallpaperPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
            onClick={() => setShowWallpaperPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Choose Wallpaper</h2>
                  <button
                    onClick={() => setShowWallpaperPicker(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {wallpaperOptions.map((wallpaper) => (
                    <div
                      key={wallpaper.id}
                      onClick={() => {
                        setSelectedWallpaper(wallpaper.url);
                        setShowWallpaperPicker(false);
                      }}
                      className={`relative cursor-pointer rounded-md overflow-hidden h-24 ${
                        selectedWallpaper === wallpaper.url ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <img 
                        src={wallpaper.thumbnail} 
                        alt={wallpaper.name}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 flex items-end p-1">
                        <div className="bg-black bg-opacity-50 text-white text-xs py-0.5 px-1 rounded w-full text-center">
                          {wallpaper.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={() => {
                      setSelectedWallpaper("");
                      setShowWallpaperPicker(false);
                    }}
                  >
                    No Wallpaper
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

