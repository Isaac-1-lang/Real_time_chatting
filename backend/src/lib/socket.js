import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],  // Update this based on your front-end origin
  },
});

const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Emit to all users the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for typing events
  socket.on("typing", ({ receiverId }) => {
    // Ensure receiverId exists in userSocketMap
    if (userSocketMap[receiverId]) {
      io.to(userSocketMap[receiverId]).emit("typing", {
        senderId: userId,
      });
    }
  });

  // Listen for stopTyping events
  socket.on("stopTyping", ({ receiverId }) => {
    // Ensure receiverId exists in userSocketMap
    if (userSocketMap[receiverId]) {
      io.to(userSocketMap[receiverId]).emit("stopTyping", {
        senderId: userId,
      });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
