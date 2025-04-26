import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';



const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "You need to login first" });
        }

const decoded =jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
        
    }
    catch (error) {
        console.log("protect route error:", error);
        res.status(500).json({ message: "Server error" });

    }
};


export default protectRoute;