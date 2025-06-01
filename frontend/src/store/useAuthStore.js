import { create } from 'zustand'
import   { axiosInstance } from "../lib/axios"
import toast from 'react-hot-toast'
import { io } from "socket.io-client"


  

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,    
  onlineUsers:[],
  socket:null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check')
      set({ authUser: res.data })
      get().connectSocket();
    } catch (error) {
      console.log("check auth error:", error.message)
      set({ authUser: null })
    }
    finally {
      set({ isCheckingAuth: false })
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data)
      set({ authUser: res.data })
      toast.success("Account created successfully !!")
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally {
      set({ isSigningUp: false })
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
      get().disconnectSocket();
      window.location.href = "/login";
    } catch (error) {
      toast.error(" failed!, please try again");
      console.log(error);
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to login. Please try again.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
updateProfile: async(data)=>{
  set({isUpdatingProfile: true})
try {
  const res= await axiosInstance.put("/auth/update-profile", data)
  if (res.data) {
    set({ authUser: res.data });
  }
  toast.success("Profile picture updated successfully")

} catch (error) {
  console.log("error in update", error)
  toast.error(error.response.data.message);
}
finally{
  set({isUpdatingProfile:false})
}
},
connectSocket: () => {
  const { authUser } = get();
  if (!authUser) return;

  // If socket exists and is connected, don't create a new one
  if (get().socket?.connected) {
    console.log("Socket already connected, skipping new connection");
    return;
  }

  console.log("Attempting to connect socket for user:", authUser._id);

  // Disconnect existing socket if any
  if (get().socket) {
    console.log("Disconnecting existing socket");
    get().socket.disconnect();
    set({ socket: null }); // Clear the socket reference
  }

  const socket = io(BASE_URL, {
    query: {
      userId: authUser._id
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    forceNew: true
  });

  // Remove any existing listeners before adding new ones
  socket.removeAllListeners();

  // Set up event listeners
  const setupListeners = () => {
    socket.on("connect", () => {
      console.log("Socket connected successfully with ID:", socket.id);
      socket.emit("getOnlineUsers");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("Received online users from server:", userIds);
      if (Array.isArray(userIds)) {
        const filteredUsers = userIds.filter(id => id !== authUser._id);
        console.log("Filtered online users:", filteredUsers);
        set({ onlineUsers: filteredUsers });
      } else {
        console.error("Received invalid online users data:", userIds);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      socket.emit("getOnlineUsers");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      set({ onlineUsers: [] });
    });
  };

  // Set up listeners
  setupListeners();

  // Store the socket instance
  set({ socket });
},
disconnectSocket: () => {
  const socket = get().socket;
  if (socket) {
    console.log("Disconnecting socket");
    socket.removeAllListeners(); 
    socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  }
},
})) 
