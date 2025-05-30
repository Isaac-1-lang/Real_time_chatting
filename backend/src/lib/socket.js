import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Use Map instead of plain object for safety
const userSocketMap = new Map();

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

// Function to broadcast online users to all clients
const broadcastOnlineUsers = () => {
  const onlineUsers = Array.from(userSocketMap.keys());
  console.log("Broadcasting online users to all clients:", onlineUsers);
  io.emit("getOnlineUsers", onlineUsers);
};

// Function to update user status safely
const updateUserStatus = async (userId, isOnline) => {
  try {
    if (!mongoose.connection.readyState) {
      console.log("Waiting for database connection...");
      await new Promise(resolve => {
        const checkConnection = () => {
          if (mongoose.connection.readyState === 1) {
            resolve();
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    await User.findByIdAndUpdate(userId, { 
      isOnline, 
      lastActive: new Date() 
    });
    
    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    return false;
  }
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("Connection attempt from user:", userId);

  if (userId) {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} mapped to socket ${socket.id}`);
    
    // Update user's online status in database
    updateUserStatus(userId, true).then(success => {
      if (success) {
        broadcastOnlineUsers();
      } else {
        socket.emit("error", "Failed to update online status");
      }
    });
  } else {
    console.warn("Connection attempt without userId");
    socket.emit("error", "No userId provided");
  }

  // Handle request for online users
  socket.on("getOnlineUsers", () => {
    const onlineUsers = Array.from(userSocketMap.keys());
    console.log("Sending online users list to client:", onlineUsers);
    socket.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove user from map and update database
    for (let [id, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(id);
        console.log(`User ${id} removed from online users`);
        
        // Update user's online status in database
        updateUserStatus(id, false).then(success => {
          if (success) {
            broadcastOnlineUsers();
          }
        });
        break;
      }
    }
  });
});

export { io, app, server };