import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.14:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach the token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default api;
