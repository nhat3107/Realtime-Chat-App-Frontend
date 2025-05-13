import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
  baseURL: "https://realtime-chat-app-backend-six.vercel.app/api",
  withCredentials: true,
});

// Check for auth token in localStorage on startup
try {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state.token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${state.token}`;
    }
  }
} catch (error) {
  console.error("Error loading auth token from storage:", error);
}

export default axiosInstance;
