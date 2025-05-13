import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, User } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users = { users: [] },
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users?.users?.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?.id === user.id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              {user.profile?.imageUrl ? (
                <img
                  src={user.profile.imageUrl}
                  alt={user.profile?.username}
                  className="size-12 object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="size-12 rounded-full bg-base-300 flex items-center justify-center">
                  <User className="size-8 text-base-content/50" />
                </div>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">
                {user.profile?.firstName} {user.profile?.lastName}
              </div>
              <div className="text-sm text-zinc-400">
                @{user.profile?.username}
              </div>
            </div>
          </button>
        ))}

        {(!users?.users || users.users.length === 0) && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
