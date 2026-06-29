import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeJob, type JobMatchResult } from "../api/jobApi";

const BASE_STORAGE_KEY = "ai-career-agent-match-results";

function getStorageKey(userId?: string) {
  return userId ? `${BASE_STORAGE_KEY}-${userId}` : `${BASE_STORAGE_KEY}-guest`;
}

function loadMatchResults(userId?: string) {
  const saved = localStorage.getItem(getStorageKey(userId));

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved) as Record<string, JobMatchResult>;
  } catch {
    return {};
  }
}

export function useJobMatches(userId?: string) {
  const [matchResults, setMatchResults] = useState<Record<string, JobMatchResult>>(
    () => loadMatchResults(userId),
  );

  useEffect(() => {
    setMatchResults(loadMatchResults(userId));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(matchResults));
  }, [matchResults, userId]);

  const analyzeMutation = useMutation({
    mutationFn: analyzeJob,
    onSuccess: (result) => {
      setMatchResults((prev) => ({
        ...prev,
        [result.jobId]: result,
      }));
    },
  });

  const deleteMatchResult = (jobId: string) => {
    setMatchResults((prev) => {
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
  };

  return {
    matchResults,
    analyzeMutation,
    deleteMatchResult,
  };
}
