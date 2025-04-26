import express from 'express';
import { signup,login,logout, checkAuth } from '../controllers/auth.controller.js';
import  protectRoute  from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/auth.controller.js';


const route = express.Router();
route.post('/signup',signup);
route.post('/login',login);
route.post('/logout',logout);
route.put('/update-profile',protectRoute,updateProfile);
route.get('/check',protectRoute,checkAuth)
export default route;