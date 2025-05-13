import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";

const NotificationsPage = () => {
  const [unseenNotifications, setUnseenNotifications] = useState([]);
  const [seenNotifications, setSeenNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch from both APIs in parallel
      const [unseenResponse, seenResponse] = await Promise.all([
        axiosInstance.get("/notification/unseen"),
        axiosInstance.get("/notification/seen"),
      ]);

      // Make sure we're getting arrays from the API
      const unseenData = Array.isArray(unseenResponse.data)
        ? unseenResponse.data
        : unseenResponse.data.notifications || [];

      const seenData = Array.isArray(seenResponse.data)
        ? seenResponse.data
        : seenResponse.data.notifications || [];

      setUnseenNotifications(unseenData);
      setSeenNotifications(seenData);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsSeen = async (notificationId) => {
    try {
      await axiosInstance.put(`/notification/seen/${notificationId}`);

      // Move notification from unseen to seen
      const notification = unseenNotifications.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        // Update local state
        setUnseenNotifications((prev) =>
          prev.filter((n) => n.id !== notificationId)
        );
        notification.status = true; // Mark as seen
        setSeenNotifications((prev) => [notification, ...prev]);
      }
    } catch (err) {
      console.error("Error marking notification as seen:", err);
      setError("Failed to mark notification as seen");
    }
  };

  const handleMarkAllAsSeen = async () => {
    try {
      await axiosInstance.put("/notification/markAllSeen");
      // Refresh notifications after operation
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all notifications as seen:", err);
      setError("Failed to mark all notifications as seen");
    }
  };

  const renderStatus = (status) => (
    <span
      className={`badge ${
        status
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
          : "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0"
      }`}
    >
      {status ? "Seen" : "Unseen"}
    </span>
  );

  const renderTable = (notifications, title, isUnseen = false) => (
    <div className="mb-8">
      <h2
        className={`text-xl font-semibold mb-4 ${
          isUnseen ? "text-primary" : "text-base-content/70"
        }`}
      >
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table
          className={`table w-full border border-base-300 rounded-xl shadow-lg ${
            isUnseen
              ? "bg-gradient-to-br from-base-100 to-base-200"
              : "bg-gradient-to-br from-base-100/80 to-base-200/80 opacity-90"
          }`}
        >
          <thead>
            <tr
              className={
                isUnseen
                  ? "border-b border-primary/20"
                  : "border-b border-base-300"
              }
            >
              <th
                className={
                  isUnseen ? "text-primary font-bold" : "text-base-content/70"
                }
              >
                Content
              </th>
              <th
                className={
                  isUnseen ? "text-primary font-bold" : "text-base-content/70"
                }
              >
                Time
              </th>
              <th
                className={
                  isUnseen ? "text-primary font-bold" : "text-base-content/70"
                }
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-base-content/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mb-2 opacity-50"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    No notifications
                  </div>
                </td>
              </tr>
            ) : (
              notifications.map((notification, index) => (
                <tr
                  key={notification.id}
                  className={
                    isUnseen
                      ? index % 2 === 0
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-primary/10"
                      : index % 2 === 0
                      ? "bg-base-200/30 hover:bg-base-200/50"
                      : "hover:bg-base-200/50"
                  }
                >
                  <td
                    className={
                      isUnseen ? "font-medium" : "text-base-content/80"
                    }
                  >
                    {notification.content}
                  </td>
                  <td className="text-sm">
                    <span className="text-base-content/70">
                      {new Date(notification.timeStamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="flex items-center gap-2">
                    {renderStatus(notification.status)}
                    {isUnseen && !notification.status && (
                      <button
                        onClick={() => handleMarkAsSeen(notification.id)}
                        className="btn btn-xs btn-circle btn-ghost text-primary hover:bg-primary/10"
                        title="Mark as seen"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-base-content/70 font-medium">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error shadow-lg bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">{error}</span>
          <button
            className="btn btn-sm bg-white text-red-600 border-0 hover:bg-white/90"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Notifications
          </h1>
          {unseenNotifications.length > 0 && (
            <button
              className="btn btn-primary btn-sm gap-2 shadow-md hover:shadow-primary/20 transition-all duration-300"
              onClick={handleMarkAllAsSeen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Mark all as seen
            </button>
          )}
        </div>

        {renderTable(unseenNotifications, "New Notifications", true)}
        {renderTable(seenNotifications, "Earlier Notifications")}
      </div>
    </div>
  );
};

export default NotificationsPage;
