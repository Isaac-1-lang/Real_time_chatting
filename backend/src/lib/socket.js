import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true, // <-- Add this
  },
});

// Use Map instead of plain object for safety
const userSocketMap = new Map();

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} mapped to socket ${socket.id}`);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys())); // send all online users
  }

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

    // Remove user from map
    for (let [id, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(id);
        break;
      }
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };