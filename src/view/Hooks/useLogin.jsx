import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Login request function
const login = async (userData) => {
  try {
    const response = await axios.post(
      "http://192.168.0.14:5050/api/login",
      userData
    );
    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Custom hook to handle login
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onError: (error) => {
      console.error("Login failed!", error);
    },
    onSuccess: (data) => {
      console.log("Login success:", data);
    },
  });
};
