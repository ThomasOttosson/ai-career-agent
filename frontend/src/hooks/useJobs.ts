import { useMutation, useQuery } from "@tanstack/react-query";
import { createJob, getJobs } from "../api/jobApi";

export function useJobs(userId?: string) {
  const { data: jobs = [], refetch } = useQuery({
    queryKey: ["jobs", userId],
    queryFn: getJobs,
    enabled: Boolean(userId),
  });

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      refetch();
    },
  });

  return {
    jobs,
    createJobMutation,
  };
}
