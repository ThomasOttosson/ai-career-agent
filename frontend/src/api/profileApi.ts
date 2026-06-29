import { api } from "./apiClient";

export interface UserProfile {
  fullName: string;
  currentTitle: string;
  experienceLevel: string;
  skills: string[];
  preferredRole: string;
  workMode: string;
  desiredSalary: string;
}

export const getProfile = async (): Promise<UserProfile | null> => {
  const response = await api.get<UserProfile | null>(`/api/profile`);
  return response.data;
};

export const saveProfile = async (
  profile: UserProfile
): Promise<UserProfile> => {
  const response = await api.post<UserProfile>(
    `/api/profile`,
    profile
  );

  return response.data;
};