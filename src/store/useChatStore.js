import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

// Helper function to compress image
const compressImage = async (base64String, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
      resolve(compressedBase64);
    };
    img.onerror = () => resolve(base64String);
  });
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  onlineUsers: [],
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: { ...res.data } });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  updateOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },

  isUserOnline: (userId) => {
    return get().onlineUsers.includes(userId);
  },

  getMessages: async (userId) => {
    const { selectedUser } = get();
    const targetUserId = userId || selectedUser?.id;

    if (!targetUserId) {
      set({ messages: [] });
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/chat/${targetUserId}`);
      if (res.data && Array.isArray(res.data.messages)) {
        set({ messages: res.data.messages });
      } else {
        set({ messages: [] });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      let payload = {
        content: messageData.content || "",
        image: "",
      };

      // Compress image if present
      if (messageData.image) {
        payload.image = await compressImage(messageData.image);
      }

      const res = await axiosInstance.post(
        `/messages/chat/send/${selectedUser.id}`,
        payload
      );

      const newMessage = {
        id: res.data.id,
        content: res.data.content,
        image: res.data.image,
        senderID: res.data.senderID,
        timeStamp: res.data.timeStamp,
        chatLogId: res.data.chatLogId,
      };

      set({ messages: [...messages, newMessage] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
