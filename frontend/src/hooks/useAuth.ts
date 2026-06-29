import { useEffect, useState } from "react";
import { login, register, type AuthResponse } from "../api/authApi";

function normalizeUser(user: AuthResponse | null): AuthResponse | null {
  if (!user) return null;

  const possibleUser = user as AuthResponse & {
    id?: string;
    user?: { userId?: string; id?: string; email?: string };
  };

  return {
    userId:
      possibleUser.userId ??
      possibleUser.id ??
      possibleUser.user?.userId ??
      possibleUser.user?.id ??
      "",
    email: possibleUser.email ?? possibleUser.user?.email ?? "",
    message: possibleUser.message ?? "",
  };
}


export function useAuth() {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const savedUser = localStorage.getItem("ai-career-user");
    return savedUser ? normalizeUser(JSON.parse(savedUser) as AuthResponse) : null;
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
    const response = normalizeUser(await login({ email, password }));

    if (!response?.userId) {
      throw new Error("Login response did not include a user id.");
    }

    localStorage.setItem("ai-career-user", JSON.stringify(response));
    setUser(response);
    setMessage(`Logged in as ${response.email}`);
  };

  const handleRegister = async (email: string, password: string) => {
    const response = normalizeUser(await register({ email, password }));

    if (!response?.userId) {
      throw new Error("Registration response did not include a user id.");
    }

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
