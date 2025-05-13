import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Bell,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

  // Example function to check for unread notifications
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        setHasUnreadNotifications(Math.random() > 0.5);
      } catch (error) {
        console.error("Failed to check notifications:", error);
      }
    };

    checkNotifications();
    const intervalId = setInterval(checkNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-base-100/80 backdrop-blur-lg border-b border-base-300 fixed w-full top-0 z-40">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                XChat
              </h1>
            </Link>
          </div>

          {/* Search Box (only when logged in) */}
          {authUser && <SearchBar />}

          {/* Navigation Section */}
          <div className="flex items-center gap-3">
            {authUser ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="btn btn-ghost btn-sm gap-2 relative group"
                >
                  <Bell className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  {hasUnreadNotifications && (
                    <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full animate-pulse"></span>
                  )}
                  <span className="hidden sm:inline">Notifications</span>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  className="btn btn-ghost btn-sm gap-2 group"
                >
                  <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="btn btn-ghost btn-sm gap-2 group"
                >
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10 group"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link to="/login" className="btn btn-ghost btn-sm gap-2 group">
                  <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline">Login</span>
                </Link>

                {/* Sign Up */}
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm gap-2 group"
                >
                  <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
