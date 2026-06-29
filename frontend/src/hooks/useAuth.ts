import { useEffect, useState } from "react";
import { login, register, type AuthResponse } from "../api/authApi";

export function useAuth() {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const savedUser = localStorage.getItem("ai-career-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [message, setMessage] = useState("");

  const isLoggedIn = user !== null;

  useEffect(() => {
    if (user) {
      localStorage.setItem("ai-career-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ai-career-user");
    }
  }, [user]);

  const handleLogin = async (email: string, password: string) => {
    const response = await login({ email, password });
    localStorage.setItem("ai-career-user", JSON.stringify(response));
    setUser(response);
    setMessage(`Logged in as ${response.email}`);
  };

  const handleRegister = async (email: string, password: string) => {
    const response = await register({ email, password });
    localStorage.setItem("ai-career-user", JSON.stringify(response));
    setUser(response);
    setMessage("Registration successful");
  };

  const logout = () => {
    localStorage.removeItem("ai-career-user");
    setUser(null);
    setMessage("Logged out");
  };

  const clearMessage = () => {
    setMessage("");
  };

  return {
    user,
    isLoggedIn,
    message,
    clearMessage,
    login: handleLogin,
    register: handleRegister,
    logout,
  };
}
