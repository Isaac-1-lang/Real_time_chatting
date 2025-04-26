import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const Notifications = () => {
  const { Notifications, resetNotifications, sendersOnHover } = useChatStore();
  const [showSenders, setShowSenders] = useState(false); // State to track hover state

  // Toggle the visibility of senders on hover
  const handleMouseEnter = () => setShowSenders(true);
  const handleMouseLeave = () => setShowSenders(false);

  return (
    <div 
      className="relative" 
      onClick={resetNotifications} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {/* Bell Icon */}
      <Bell className="text-2xl text-gray-700 cursor-pointer" />
      
      {/* Notification Count */}
      {Notifications > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {Notifications}
        </span>
      )}

      {/* Display sender names on hover */}
      {showSenders && sendersOnHover.length > 0 && (
        <div className="absolute top-full mt-2 bg-white p-2 rounded shadow-md w-48">
          <div className="font-medium text-gray-700">Senders:</div>
          <ul className="mt-2 text-sm">
            {sendersOnHover.map((sender, index) => (
              <li key={index} className="truncate">{sender}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;



