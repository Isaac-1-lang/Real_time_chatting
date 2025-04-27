import mongoose, { mongo, Schema } from "mongoose";
const userSchema = new mongoose.Schema (
  {
    email: {
      type:String,
      required:true,
      unique:true,
    },
    fullName: {
     type:String,
     required:true,
    },
    password: {
      type:String,
      required:true,
      minlength:6,
    },
    profilePic: {
      type:String,
      default:"",
    },
    isOnline: {
      type:Boolean,
      default:false,
    },
    lastActive: {
      type:Date,
      default:Date.now,
    },
  },
  {
    timestamps:true
  },
)


const User = mongoose.model("User",userSchema);


export default User;