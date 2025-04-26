import express from "express";
import  protectRoute  from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// 1. Static first
router.get("/users", protectRoute, getUsersForSidebar);

// 2. Then more specific dynamic
router.post("/send/:id", protectRoute, sendMessage);

// 3. Then general dynamic at last
router.get("/:id", protectRoute, getMessages);


export default router;