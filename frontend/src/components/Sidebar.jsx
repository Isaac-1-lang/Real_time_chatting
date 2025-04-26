import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Mail } from "lucide-react";

const Sidebar = () => {
  const { 
    getUsers, users, selectedUser, setSelectedUser, isUsersLoading, typingUsers,
    getmessagesindicator, indicator, resetindicator 
  } = useChatStore();
  
  const { onlineUsers = [], authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    getmessagesindicator();
  }, [getmessagesindicator]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const onlineCount = Math.max(0, onlineUsers.length - 1);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      
      {/* Top Section */}
      <div className="border-b border-base-300 w-full p-5">
        
        {/* Profile */}
        <div className="flex items-center gap-2">
          <img 
            src={authUser?.profilePic || "/avatar.png"} 
            alt="Profile" 
            className="size-8 rounded-full object-cover" 
          />
          <span className="font-medium hidden lg:block">Profile</span>
        </div>

        {/* Show Online Only Checkbox */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineCount} online)</span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img 
                src={user.profilePic || "/avatar.png"} 
                alt={user.fullName} 
                className="size-12 object-cover rounded-full" 
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User Info */}
            <div className="hidden lg:block text-left min-w-0">
              
              {/* User Name + Typing */}
              <div className="font-medium truncate inline-flex items-center gap-3">
                {user.fullName}
                {typingUsers?.[user._id] && <span className="text-xs text-gray-500">typing...</span>}
              </div>

              {/* Mail + Indicator */}
              <div className="flex items-center gap-2 mt-1">
                <button 
                  className="relative btn btn-sm gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting user when clicking mail
                    resetindicator(user._id); // reset only for this user
                  }}
                >
                  <Mail className="w-5 h-5 text-white-700" />
                  {indicator[user._id] > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {indicator[user._id]}
                    </span>
                  )}
                </button>
              </div>

              {/* Status */}
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

          </button>
        ))}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No users found"}
          </div>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;
