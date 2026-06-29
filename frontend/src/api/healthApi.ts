import { api } from "./apiClient";

export interface HealthResponse {
  status: string;
  service: string;
}

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>(
    `/api/health`
  );

  return response.data;
};