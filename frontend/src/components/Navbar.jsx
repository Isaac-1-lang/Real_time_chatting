
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { LogOut, MessageSquare, Settings, User, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { Notifications, resetNotifications, getNotifications, onhover } = useChatStore(); 

     useEffect(() => {
    getNotifications(); 
    return () => {
    };
  }, [getNotifications]); 


  useEffect(() => {
    
    onhover();
    return ()=>{}
  }, [onhover]);



  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* 🔹 Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Alchat</h1>
            </Link>
          </div>

          {/* 🔹 Notification Bell */}
          <div className="flex items-center gap-2">
            <button
              className="relative btn btn-sm gap-2 transition-colors"
              onClick={resetNotifications} // Clear notifications on click
            >
              <Bell className="w-5 h-5 text-white-700" />
              {Notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Notifications}
                </span>
              )}
            </button>

            {/* 🔹 Settings */}
            <Link to={"/settings"} className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* 🔹 Profile & Logout */}
            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
