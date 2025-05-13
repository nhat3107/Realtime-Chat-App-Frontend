import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost:3000/api",
=======
  baseURL: process.env.BACKEND_URL + "/api",
>>>>>>> 5ac7a7469b1c5400f923753df7e01ceb8fc7c29a
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
