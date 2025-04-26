import React, { useEffect } from "react";



import {Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./components/navbar";
import {useAuthStore} from "./store/useAuthStore"; 
import { useThemeStore } from  "./store/useThemeStore"

import Homepage from "./pages/HomePage";
import SignupPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/Profile";
import {Loader, Turtle} from  "lucide-react"
import { Toaster } from "react-hot-toast";

const App =()=>{
  const {authUser, checkAuth, isCheckingAuth ,onlineUsers} = useAuthStore()
const { theme } =useThemeStore()
console.log({onlineUsers});

  useEffect(()=>{
checkAuth()
  }, [checkAuth])

console.log({authUser})
if(isCheckingAuth &&  !authUser){

   return <div className="flex justify-center items-center h-screen">
     < Loader className="size-10 text-luxury animate-spin"/> 
 </div>

 

}



  return(
    <div >
      <Navbar />


<Routes data-theme={theme}>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>


   
<Toaster />

    </div>
  )

}
export default App;





// import React, { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/navbar";
// import { useAuthStore } from "./store/useAuthStore";
// import { useThemeStore } from "./store/useThemeStore";

// import Homepage from "./pages/Homepage";
// import SignupPage from "./pages/SignupPage";
// import LoginPage from "./pages/LoginPage";
// import SettingsPage from "./pages/SettingsPage";
// import ProfilePage from "./pages/ProfilePage";
// import PropertiesPage from "./pages/PropertiesPage";
// import PropertyDetailsPage from "./pages/PropertyDetailsPage";
// import AddPropertyPage from "./pages/AddPropertyPage";
// import ContactPage from "./pages/ContactPage";
// import AboutPage from "./pages/AboutPage";
// import NotFound from "./pages/NotFound";

// import { Loader } from "lucide-react";
// import { Toaster } from "react-hot-toast";

// const App = () => {
//   const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
//   const { theme } = useThemeStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   if (isCheckingAuth && !authUser) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader className="size-10 text-luxury animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar />

//       <Routes >
//         {/* Public Routes */}
//         <Route path="/" element={<Homepage />} />
//         <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
//         <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
//         <Route path="/properties" element={<PropertiesPage />} />
//         <Route path="/properties/:id" element={<PropertyDetailsPage />} />
//         <Route path="/contact" element={<ContactPage />} />
//         <Route path="/about" element={<AboutPage />} />

//         {/* Protected Routes */}
//         <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
//         <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
//         <Route path="/add-property" element={authUser ? <AddPropertyPage /> : <Navigate to="/login" />} />

//         {/* Fallback Route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       <Toaster />
//     </div>
//   );
// };

// export default App;
