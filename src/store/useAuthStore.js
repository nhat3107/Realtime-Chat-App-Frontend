import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";
import io from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = "https://realtime-chat-app-backend-l0eb.onrender.com";
export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      token: null,
      socket: null,
      onlineUsers: [],
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,

      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
          query: {
            userId: authUser.id,
          },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },

      checkAuth: async () => {
        try {
          const response = await axiosInstance.get("/auth/check");
          set({ authUser: response.data.user });
          get().connectSocket();
        } catch (error) {
          console.log("error in checkAuth", error);
          set({ authUser: null, token: null });
        }
        set({ isCheckingAuth: false });
      },

      uploadProfileImage: async (imageData) => {
        try {
          const res = await axiosInstance.post(
            "/auth/uploadUserImage",
            imageData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          return res.data;
        } catch (error) {
          throw error;
        }
      },

      signup: async (formData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", formData);
          set({
            authUser: res.data.user,
            token: res.data.token,
          });

          get().connectSocket();

          if (res.data.token) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.token}`;
          }

          return res.data;
        } catch (error) {
          throw error;
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (formData) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", formData);

          set({
            authUser: res.data.user,
            token: res.data.token,
          });

          get().connectSocket();

          if (res.data.token) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.token}`;
          }
          return res.data;
        } catch (error) {
          throw error;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          toast.success("Logged out successfully");
          set({ authUser: null, token: null });
          useChatStore.getState().setSelectedUser(null);
          get().disconnectSocket();
          delete axiosInstance.defaults.headers.common["Authorization"];
        } catch (error) {
          throw error;
        }
      },

      updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put(
            "/userProfile/updateProfile",
            formData
          );
          set({
            authUser: {
              ...get().authUser,
              profile: {
                ...get().authUser.profile,
                ...formData,
              },
            },
          });

          return res.data;
        } catch (error) {
          throw error;
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser, token: state.token }),
    }
  )
);
