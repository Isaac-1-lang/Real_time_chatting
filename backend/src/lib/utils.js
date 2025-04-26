import jwt from 'jsonwebtoken';


export const generateToken = (userId,res) => {
   const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:'1h'
   })

   res.cookie("jwt",token,{
    maxAge: 1*60*60*1000,
    httpOnly:true, // to prevent cross site scriptings
    sameSite:"strict",
    secure:process.env.NODE_ENV !=="development",
   });


   return token;
}