import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const homeBack = () => {
    Navigate()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      // Don't auto-update here, wait for save button
    };
  };

  const handleSave = async () => {
    if (!selectedImg) return;
    
    try {
      setIsSaving(true);
      await updateProfile({ profilePic: selectedImg });
      // Success message could be added here
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Error handling could be added here
    } finally {
      setIsSaving(false);
    }
  };
  const navigate = useNavigate();
  const handleBack = () => {
    // Navigate back or reset state
    setSelectedImg(null);
    navigate('/');
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="size-32 rounded-full border-4 overflow-hidden relative">
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 object-cover"
                />
                {(isUpdatingProfile || isSaving) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${(isUpdatingProfile || isSaving) ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile || isSaving}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile || isSaving ? "Updating profile..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!selectedImg || isUpdatingProfile || isSaving}
              className={`flex items-center justify-center gap-2 
                bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out
                ${(!selectedImg || isUpdatingProfile || isSaving) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {(isUpdatingProfile || isSaving) && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
            <button
              type="button"
              onClick={handleBack}
              disabled={isUpdatingProfile || isSaving}
              className={`bg-gray-600 hover:bg-gray-700 text-white font-semibold 
                py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out
                ${(isUpdatingProfile || isSaving) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;