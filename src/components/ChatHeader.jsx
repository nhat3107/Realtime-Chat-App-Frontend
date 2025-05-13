import { X, User } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedUser.profile?.imageUrl ? (
                <img
                  src={selectedUser.profile.imageUrl}
                  alt={selectedUser.profile?.username}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="size-10 rounded-full bg-base-300 flex items-center justify-center">
                  <User className="size-6 text-base-content/50" />
                </div>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
            </h3>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
