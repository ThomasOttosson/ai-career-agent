import { api } from "./apiClient";

export interface JobPosting {
  id?: string;
  title: string;
  company: string;
  location: string;
  workMode: string;
  description: string;
  createdAt?: string;
}

export const getJobs = async (): Promise<JobPosting[]> => {
  const response = await api.get<JobPosting[]>(`/api/jobs`);
  return response.data;
};

export const createJob = async (job: JobPosting): Promise<JobPosting> => {
  const response = await api.post<JobPosting>(`/api/jobs`, job);
  return response.data;
};

export interface JobMatchResult {
  jobId: string;
  jobTitle: string;
  company: string;
  score: number;
  confidence: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  risks: string[];
  recommendation: string;
}

export const analyzeJob = async (jobId: string): Promise<JobMatchResult> => {
  const response = await api.post<JobMatchResult>(
    `/api/jobs/${jobId}/analyze`,
  );

  return response.data;
};

export interface CoverLetter {
  id: string;
  jobId?: string;
  title?: string;
  company?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export const generateCoverLetter = async ({
  jobId,
  tone,
}: {
  jobId: string;
  tone: string;
}): Promise<CoverLetter> => {
  const response = await api.post<CoverLetter>(
    `/api/jobs/${jobId}/cover-letter`,
    { tone },
  );

  return response.data;
};

export const getLatestCoverLetter = async (
  jobId: string,
): Promise<CoverLetter | null> => {
  const response = await api.get<CoverLetter | null>(
    `/api/jobs/${jobId}/cover-letter`,
  );

  return response.data;
};

export const getCoverLetters = async (): Promise<CoverLetter[]> => {
  const response = await api.get<CoverLetter[]>(
    `/api/jobs/cover-letters`,
  );

  return response.data;
};

export const createCoverLetter = async ({
  title,
  company,
  content,
}: {
  title: string;
  company: string;
  content: string;
}): Promise<CoverLetter> => {
  const response = await api.post<CoverLetter>(
    `/api/jobs/cover-letters`,
    { title, company, content },
  );

  return response.data;
};

export const updateCoverLetter = async (
  coverLetterId: string,
  data: {
    title?: string;
    company?: string;
    content: string;
  },
): Promise<CoverLetter> => {
  const response = await api.put<CoverLetter>(
    `/api/jobs/cover-letters/${coverLetterId}`,
    data,
  );

  return response.data;
};

export const deleteCoverLetter = async (
  coverLetterId: string,
): Promise<void> => {
  await api.delete(`/api/jobs/cover-letters/${coverLetterId}`);
};

export type CoverLetterAiAction =
  | "IMPROVE"
  | "PROFESSIONAL"
  | "FRIENDLY"
  | "SHORTER"
  | "LONGER"
  | "GRAMMAR";

export const rewriteCoverLetterWithAi = async ({
  content,
  action,
}: {
  content: string;
  action: CoverLetterAiAction;
}): Promise<string> => {
  const response = await api.post<string>(
    `/api/jobs/cover-letters/ai-rewrite`,
    { content, action },
  );

  return response.data;
};

export type ResumeAiAction =
  | "IMPROVE"
  | "PROFESSIONAL"
  | "SHORTER"
  | "LONGER"
  | "GRAMMAR"
  | "ATS";

export const rewriteResumeWithAi = async ({
  resume,
  action,
}: {
  resume: string;
  action: ResumeAiAction;
}): Promise<string> => {
  const response = await api.post<string>(
    `/api/resume/ai-rewrite`,
    { resume, action },
  );

  return response.data;
};

export const askCareerCoach = async ({
  message,
  profileContext,
  resumeContext,
  jobsContext,
  applicationsContext,
}: {
  message: string;
  profileContext: string;
  resumeContext: string;
  jobsContext: string;
  applicationsContext: string;
}): Promise<string> => {
  const response = await api.post<string>(`/api/career-coach`, {
    message,
    profileContext,
    resumeContext,
    jobsContext,
    applicationsContext,
  });

  return response.data;
};