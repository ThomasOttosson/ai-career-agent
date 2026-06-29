import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function getCurrentUserId(): string | null {
  const savedUser = localStorage.getItem("ai-career-user");

  if (!savedUser) return null;

  try {
    const parsed = JSON.parse(savedUser) as {
      userId?: string;
      id?: string;
      user?: { userId?: string; id?: string };
    };

    return (
      parsed.userId ??
      parsed.id ??
      parsed.user?.userId ??
      parsed.user?.id ??
      null
    );
  } catch {
    return null;
  }
}

export function getUserScopedStorageKey(baseKey: string): string {
  const userId = getCurrentUserId();
  return userId ? `${baseKey}-${userId}` : `${baseKey}-guest`;
}

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userId = getCurrentUserId();

  if (userId) {
    config.headers["X-User-Id"] = userId;
  }

  return config;
});
