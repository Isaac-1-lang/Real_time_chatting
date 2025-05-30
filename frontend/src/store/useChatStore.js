import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  sendersOnHover: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  resetTyping:() => {
    set({ typingUsers: null})
  },
  resetindicator: (userId) => {
    set((state) => {
      const updated = { ...state.indicator, [userId]: 0 };
      localStorage.setItem("indicator", JSON.stringify(updated));
      return { indicator: updated };
    });
  },
  Notifications: parseInt(localStorage.getItem("notifications") || "0"),
  indicator: parseInt(localStorage.getItem("indicator") || "0"),
  userNotifications: JSON.parse(localStorage.getItem("userNotifications") || "{}"),

  resetNotifications: () => {
    set({ Notifications: 0, userNotifications: {},});
    localStorage.setItem("notifications", "0");
   
  },
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({ messages: [...get().messages, newMessage] });
      } else {
        set((state) => {
          const newUserNotifications = { ...state.userNotifications };
          newUserNotifications[newMessage.senderId] = (newUserNotifications[newMessage.senderId] || 0) + 1;

          localStorage.setItem("userNotifications", JSON.stringify(newUserNotifications));

          return { userNotifications: newUserNotifications };
        });
      }
    });
  },

  getNotifications: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({ messages: [...get().messages, newMessage] });
      } else {
        set((state) => {
          const newNotifications = state.Notifications + 1;
          localStorage.setItem("notifications", newNotifications);
          return { Notifications: newNotifications };
        });
      }
    });
  },


  getmessagesindicator: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
  
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, indicator } = get();
  
     
      if (newMessage.receiverId === selectedUser?._id && newMessage.senderId !== selectedUser?._id) {
        set((state) => {
          const newIndicator = state.indicator + 1;
          localStorage.setItem("indicator", newIndicator);
          return { indicator: newIndicator };
        });
      }
    });
  },


  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  onhover: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, sendersOnHover } = get();
      if (!selectedUser || newMessage.senderId !== selectedUser._id) {
        set((state) => ({
          sendersOnHover: [...new Set([...state.sendersOnHover, newMessage.user.fullName])],
        }));
        localStorage.setItem("sendersOnHover", JSON.stringify(get().sendersOnHover));
      }
    });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  startTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if(!socket) return;
    socket.emit("typing",{ receiverId});
  },
  stopTyping:(receiverId) => {
    const socket = useAuthStore.getState().socket;
    if(!socket) return;
    socket.emit("stopTyping",{ receiverId});
  },
  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("typing", (typingInfo) => {
      const { userId, isTyping } = typingInfo;
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [userId]: isTyping ? true : false,  // Mark user as typing or not typing
        },
      }));
    });
  },
}));


