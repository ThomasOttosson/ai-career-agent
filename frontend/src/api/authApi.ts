import { api } from "./apiClient";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  message: string;
}

export const register = async (
  request: AuthRequest,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `/api/auth/register`,
    request,
  );

  return response.data;
};

export const login = async (
  request: AuthRequest,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `/api/auth/login`,
    request,
  );

  return response.data;
};