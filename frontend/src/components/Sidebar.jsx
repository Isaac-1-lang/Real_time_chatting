import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Mail, Users } from "lucide-react";

// import OnSidebar from "./onsidebar";


const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading} = useChatStore();
  const { onlineUsers = [],authUser } = useAuthStore();  
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const {getmessagesindicator, indicator, resetindicator} = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    getmessagesindicator(); 
    return () => {
    };
  }, [getmessagesindicator]); 



  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  const onlineCount = Array.isArray(onlineUsers) ? Math.max(0, onlineUsers.length - 1) : 0;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
            <div className="flex items-center gap-2">
        <img 
          src={authUser?.profilePic || "/avatar.png"} 
          alt="Profile" 
          className="size-8 rounded-full object-cover" 
        />
        <span className="font-medium hidden lg:block">Profile</span>
      </div>
      
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
          <span className="text-xs text-zinc-500">
            ({onlineCount} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate inline-flex items-center gap-3">{user.fullName}     
                 </div>

            

                 <div className="flex items-center gap-2">
            <button
              className="relative btn btn-sm gap-2 transition-colors"
              onClick={resetindicator} 
            >
              <Mail className="w-5 h-5 text-white-700" />
              {indicator > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {indicator}
                </span>
              )}
            </button>

</div>


              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};


export default Sidebar;
