import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUserId } from "../api/apiClient";
import { getProfile, saveProfile, type UserProfile } from "../api/profileApi";

export function useProfile() {
  const userId = getCurrentUserId();

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: getProfile,
    enabled: Boolean(userId),
  });

  const saveProfileMutation = useMutation({
    mutationFn: (profileData: UserProfile) => saveProfile(profileData),
    onSuccess: () => {
      refetch();
    },
  });

  return {
    profile,
    isLoading,
    saveProfileMutation,
  };
}
