import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://realtime-chat-app-backend-l0eb.onrender.com",
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
