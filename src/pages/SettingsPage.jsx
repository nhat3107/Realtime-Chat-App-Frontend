import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  Save,
  X,
  Camera,
  Mail,
  Key,
  Send,
  Moon,
  Sun,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import { useThemeStore } from "../store/useThemeStore.js";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { authUser, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { theme, setTheme } = useThemeStore();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        bio: formData.get("bio"),
      };

      const res = await axiosInstance.put("/users/profile", data);
      updateUser(res.data.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      };

      await axiosInstance.put("/users/password", data);
      setMessage({ type: "success", text: "Password updated successfully!" });
      e.target.reset();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosInstance.put("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data.user);
      setMessage({ type: "success", text: "Avatar updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update avatar",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "language", label: "Language", icon: Globe },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-8">
        {/* Theme Section */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6 shadow-lg">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-2xl font-bold text-base-content">
              Theme Settings
            </h2>
            <p className="text-base-content/80">
              Choose between light and dark mode
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-center gap-8">
            {/* Light Theme */}
            <button
              className={`
                group relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all
                ${
                  theme === "light"
                    ? "bg-primary/20 ring-2 ring-primary shadow-lg"
                    : "hover:bg-base-200/80"
                }
              `}
              onClick={() => setTheme("light")}
            >
              <div className="size-12 rounded-full bg-base-200 flex items-center justify-center shadow-md">
                <Sun className="size-6 text-base-content" />
              </div>
              <span className="text-sm font-medium text-base-content">
                Light
              </span>
              {theme === "light" && (
                <div className="absolute top-2 right-2">
                  <div className="size-4 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <div className="size-2 bg-primary-content rounded-full"></div>
                  </div>
                </div>
              )}
            </button>

            {/* Dark Theme */}
            <button
              className={`
                group relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all
                ${
                  theme === "dark"
                    ? "bg-primary/20 ring-2 ring-primary shadow-lg"
                    : "hover:bg-base-200/80"
                }
              `}
              onClick={() => setTheme("dark")}
            >
              <div className="size-12 rounded-full bg-base-200 flex items-center justify-center shadow-md">
                <Moon className="size-6 text-base-content" />
              </div>
              <span className="text-sm font-medium text-base-content">
                Dark
              </span>
              {theme === "dark" && (
                <div className="absolute top-2 right-2">
                  <div className="size-4 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <div className="size-2 bg-primary-content rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-base-100 rounded-xl border border-base-300 p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-base-content">
            Theme Preview
          </h3>
          <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-xl">
            <div className="p-4 bg-base-200">
              <div className="max-w-lg mx-auto">
                {/* Mock Chat UI */}
                <div className="bg-base-100 rounded-xl shadow-md overflow-hidden">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium shadow-sm">
                        J
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-base-content">
                          John Doe
                        </h3>
                        <p className="text-xs text-base-content/80">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`
                            max-w-[80%] rounded-lg px-4 py-2 shadow-sm
                            ${
                              message.isSent
                                ? "bg-primary text-primary-content"
                                : "bg-base-200 text-base-content"
                            }
                          `}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-base-300 bg-base-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-10 shadow-sm"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <button className="btn btn-primary h-10 min-h-0 shadow-md">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
