import bcrypt from 'bcryptjs';
import  User  from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
export const signup = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "The password must have at least 6 characters" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "The user already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
    });
    await newUser.save();
    generateToken(newUser._id, res);
    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

  } catch (error) {
    console.error("Error in sign up:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      console.log("User logged in successfully");
    }
    generateToken(existingUser._id, res);
    return res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic
    });

  } catch (error) {
    console.log("An error in the auth.controller.js", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in the auth.controller.js", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    // Check if profilePic is provided
    if (!profilePic) {
      return res.status(400).json({ message: "New profile image must be selected" });
    }
    const userId = req.user._id; 
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: 'profile_pics', 
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, 
      { new: true }
    );
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Error(s) in auth.controller.js:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
export const checkAuth = (req,res)=> {
  try {
    res.status(200).json(req.user);
  } catch {
    console.log("Error on the page!!!!!!!!!!!!!!!!!!!!!");
  }
}
export const getOnlineUsers = async(req,res) => {
  const onlineUsers = await User.find({ isOnline:true});
  res.json(onlineUsers.map(user => ({
    _id: user._id,
    fullName: user.fullName,
    profilePic: user.profilePic,
  })));
  console.log("Online users:", onlineUsers);
}