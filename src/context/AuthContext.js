import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkUserLoggedIn = async () => {
      const token = Cookies.get("token");
      console.log("Checking if user is logged in, token:", token);
      if (token) {
        try {
          const response = await axios.get(
            "http://api.meetu.life/api/users/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("User data from token:", response.data);
          if (response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error(
            "Error fetching user:",
            error.response?.data || error.message
          );
        }
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting to log in with:", email, password);
      const response = await axios.post(
        "http://api.meetu.life/api/auth/local",
        {
          identifier: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login response:", response.data);
      setUser(response.data.user);
      Cookies.set("token", response.data.jwt, { expires: 7 });
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out user:", user);
    setUser(null);
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
