import { useMutation } from "@tanstack/react-query";
import axios from "axios";
const BASEURL =process.env.REACT_APP_BASE_URL;
// console.log("Base",BASEURL);

// Login request function
const login = async (userData) => {
  try {
    const response = await axios.post(
      `${BASEURL}/login`,
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
      // console.log("Login success:", data);
    },
  });
};
