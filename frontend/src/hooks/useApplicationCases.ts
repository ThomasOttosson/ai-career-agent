import { useMutation, useQuery } from "@tanstack/react-query";
import {
  approveApplicationCase,
  createApplicationCase,
  deleteApplicationCase,
  getApplicationCases,
  markApplicationApplied,
  markApplicationHired,
  markApplicationInterview,
  markApplicationOffer,
  markApplicationReady,
  markApplicationRejected,
  updateApplicationCase,
} from "../api/applicationApi";

export function useApplicationCases(userId?: string) {
  const { data: applicationCases = [], refetch: refetchCases } = useQuery({
    queryKey: ["applicationCases", userId],
    queryFn: getApplicationCases,
    enabled: Boolean(userId),
  });

  const createCaseMutation = useMutation({
    mutationFn: createApplicationCase,
    onSuccess: () => {
      refetchCases();
    },
  });

  const approveCaseMutation = useMutation({
    mutationFn: approveApplicationCase,
    onSuccess: () => {
      refetchCases();
    },
  });

  const readyCaseMutation = useMutation({
    mutationFn: markApplicationReady,
    onSuccess: () => {
      refetchCases();
    },
  });

  const appliedCaseMutation = useMutation({
    mutationFn: markApplicationApplied,
    onSuccess: () => {
      refetchCases();
    },
  });

  const interviewCaseMutation = useMutation({
    mutationFn: markApplicationInterview,
    onSuccess: () => {
      refetchCases();
    },
  });

  const offerCaseMutation = useMutation({
    mutationFn: markApplicationOffer,
    onSuccess: () => {
      refetchCases();
    },
  });

  const hiredCaseMutation = useMutation({
    mutationFn: markApplicationHired,
    onSuccess: () => {
      refetchCases();
    },
  });

  const rejectedCaseMutation = useMutation({
    mutationFn: markApplicationRejected,
    onSuccess: () => {
      refetchCases();
    },
  });

  const updateCaseMutation = useMutation({
    mutationFn: ({
      caseId,
      status,
      notes,
      followUpDate,
    }: {
      caseId: string;
      status: string;
      notes: string;
      followUpDate: string;
    }) =>
      updateApplicationCase(caseId, {
        status,
        notes,
        followUpDate,
      }),
    onSuccess: () => {
      refetchCases();
    },
  });

  const getCaseForJob = (jobId?: string) => {
    if (!jobId) return undefined;

    return applicationCases?.find(
      (applicationCase) => applicationCase.jobId === jobId,
    );
  };

  const deleteCaseMutation = useMutation({
    mutationFn: deleteApplicationCase,
    onSuccess: () => {
      refetchCases();
    },
  });

  return {
    applicationCases,
    createCaseMutation,
    approveCaseMutation,
    readyCaseMutation,
    appliedCaseMutation,
    interviewCaseMutation,
    offerCaseMutation,
    hiredCaseMutation,
    rejectedCaseMutation,
    deleteCaseMutation,
    updateCaseMutation,
    getCaseForJob,
  };
}
