import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import axiosInstance from "../lib/axios";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  UserPlus,
  UserMinus,
  Users,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [friendCount, setFriendCount] = useState(0);

  const checkFriendRequestStatus = async () => {
    try {
      // Check friend request status
      const response = await axiosInstance.get(`/friendRequest/check`, {
        params: {
          userId: userId,
        },
      });
      const { status, isFriend, isReceiver, isSender } = response.data;

      // Check if users are friends
      setIsFriend(isFriend);

      // If logged-in user is a receiver of a friend request
      if (isReceiver) {
        setHasPendingRequest(true);
        setIsPending(false);
        return;
      }

      // If logged-in user is a sender of a friend request
      if (isSender) {
        setHasPendingRequest(false);
        setIsPending(true);
        return;
      }

      // Handle other friend request statuses
      if (status === null) {
        // No request exists
        setIsPending(false);
        setHasPendingRequest(false);
      } else if (status === false) {
        // Request is pending
        setIsPending(true);
        setHasPendingRequest(false);
      } else if (status === true) {
        // Request was accepted
        setIsPending(false);
        setHasPendingRequest(false);
      }
    } catch (err) {
      console.error("Error checking friend request status:", err);
    }
  };

  const fetchFriendCount = async () => {
    try {
      const response = await axiosInstance.get(
        `/userProfile/countFriend/${userId}`
      );
      setFriendCount(response.data);
    } catch (err) {
      console.error("Error fetching friend count:", err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/userProfile/${userId}`);
        const userData = response.data;
        setUser(userData);

        // Fetch friend count from dedicated API
        await fetchFriendCount();

        // Check friend request status
        await checkFriendRequestStatus();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user profile");
        toast.error(
          err.response?.data?.message || "Failed to load user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, authUser.id]);

  const handleAddFriend = async () => {
    try {
      setIsLoadingAction(true);
      await axiosInstance.post(`/friendRequest/send`, {
        receiverId: userId,
      });
      setIsPending(true);
      toast.success("Friend request sent successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send friend request"
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setIsLoadingAction(true);
      await axiosInstance.delete(`/friendRequest/delete`, {
        params: {
          targetId: userId,
        },
      });
      setIsFriend(false);
      // Fetch updated friend count
      await fetchFriendCount();
      toast.success("Friend removed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove friend");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      setIsLoadingAction(true);
      await axiosInstance.patch(`/friendRequest/accept`, {
        senderId: userId,
      });
      setIsFriend(true);
      setHasPendingRequest(false);
      // Fetch updated friend count
      await fetchFriendCount();
      toast.success("Friend request accepted");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to accept friend request"
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleRejectRequest = async () => {
    try {
      setIsLoadingAction(true);
      await axiosInstance.delete(`/friendRequest/reject`, {
        params: {
          senderId: userId,
        },
      });
      setHasPendingRequest(false);
      toast.success("Friend request rejected");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to reject friend request"
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleStartChat = () => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <span>User not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-8 mb-8 border border-base-300">
          <div className="flex items-center gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-base-200 flex-shrink-0 shadow-lg ring-4 ring-primary/10">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                    e.target.parentElement.classList.add("bg-primary/10");
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User className="w-16 h-16 text-primary" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-base-content/80 text-lg mb-3">
                @{user.username}
              </p>

              {/* Friend Count */}
              <div className="flex items-center gap-2 text-base-content/80 mb-6">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  {friendCount} {friendCount === 1 ? "Friend" : "Friends"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleStartChat}
                  className="btn btn-primary gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  disabled={isLoadingAction}
                >
                  <MessageSquare className="w-5 h-5" />
                  Message
                </button>
                {userId !== authUser.id &&
                  (isFriend ? (
                    <button
                      onClick={handleRemoveFriend}
                      className="btn btn-outline btn-error gap-2 hover:bg-error/10 transition-all duration-300"
                      disabled={isLoadingAction}
                    >
                      <UserMinus className="w-5 h-5" />
                      Remove Friend
                    </button>
                  ) : hasPendingRequest ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleAcceptRequest}
                        className="btn btn-success gap-2 hover:bg-success/10 transition-all duration-300"
                        disabled={isLoadingAction}
                      >
                        <Check className="w-5 h-5" />
                        Accept
                      </button>
                      <button
                        onClick={handleRejectRequest}
                        className="btn btn-outline btn-error gap-2 hover:bg-error/10 transition-all duration-300"
                        disabled={isLoadingAction}
                      >
                        <X className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  ) : isPending ? (
                    <button
                      className="btn btn-outline gap-2 opacity-50 cursor-not-allowed"
                      disabled={true}
                    >
                      <UserPlus className="w-5 h-5" />
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={handleAddFriend}
                      className="btn btn-outline gap-2 hover:bg-primary/10 transition-all duration-300"
                      disabled={isLoadingAction}
                    >
                      <UserPlus className="w-5 h-5" />
                      Add Friend
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-8 border border-base-300">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-base-content/60">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>

            {user.phoneNumber && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-base-content/60">Phone</div>
                  <div className="font-medium">{user.phoneNumber}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-base-content/60">Joined</div>
                <div className="font-medium">
                  {new Date(user.dateRegistered).toLocaleDateString()}
                </div>
              </div>
            </div>

            {user.dateOfBirth && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-base-content/60">Birthday</div>
                  <div className="font-medium">
                    {new Date(user.dateOfBirth).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-base-content/60">Gender</div>
                <div className="font-medium capitalize">{user.gender}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
