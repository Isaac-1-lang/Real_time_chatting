import { create } from 'zustand'
import   { axiosInstance } from "../lib/axios"
import toast from 'react-hot-toast'
import { io } from "socket.io-client"


  

const BASE_URL= import.meta.env.MODE === "development" ? "http://localhost:5001/api": "/api";

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
      toast.error(error.response.data.message);
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
connectSocket: ()=>{
  const {authUser} =get()
  if(!authUser || get().socket?.connected ) return
   
  const socket = io( BASE_URL,{
    query:{
      userId:authUser._id
    }
  })
  socket.connect()
  set({socket: socket})
socket.on("getOnlineUsers", (userIds)=>{
  set({onlineUsers:userIds})
})
},
disconnectSocket: ()=>{
if(get().socket?.connected) get().socket?.disconnect()
},
})) 
