import { api } from "./apiClient";

export interface ApplicationCase {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  approvedAt?: string;
  appliedAt?: string;
  interviewAt?: string;
  offerAt?: string;
  hiredAt?: string;
  rejectedAt?: string;
  notes?: string;
  followUpDate?: string;
}

export interface ApplicationCaseUpdateRequest {
  status: string;
  notes: string;
  followUpDate: string;
}

export const createApplicationCase = async (
  jobId: string,
): Promise<ApplicationCase> => {
  const response = await api.post<ApplicationCase>(
    `/api/applications`,
    { jobId },
  );

  return response.data;
};

export const getApplicationCases = async (): Promise<ApplicationCase[]> => {
  const response = await api.get<ApplicationCase[]>(
    `/api/applications`,
  );

  return response.data;
};

export const approveApplicationCase = async (
  caseId: string,
): Promise<ApplicationCase> => {
  const response = await api.post<ApplicationCase>(
    `/api/applications/${caseId}/approve`,
  );

  return response.data;
};

export const markApplicationReady = async (
  caseId: string,
): Promise<ApplicationCase> => {
  const response = await api.post<ApplicationCase>(
    `/api/applications/${caseId}/ready`,
  );

  return response.data;
};

export const markApplicationApplied = async (
  caseId: string,
): Promise<ApplicationCase> => {
  const response = await api.put<ApplicationCase>(
    `/api/applications/${caseId}/applied`,
  );

  return response.data;
};

export const markApplicationInterview = async (
  caseId: string,
): Promise<ApplicationCase> => {
  const response = await api.put<ApplicationCase>(
    `/api/applications/${caseId}/interview`,
  );

  return response.data;
};

export const markApplicationOffer = async (
  caseId: string,
): Promise<ApplicationCase> => {
  const response = await api.put<ApplicationCase>(
    `/api/applications/${caseId}/offer`,
  );

  return response.data;
};

export const markApplicationHired = async (
  caseId: string,
): Promise<ApplicationCase> => {
  const response = await api.put<ApplicationCase>(
    `/api/applications/${caseId}/hired`,
  );

  return response.data;
};

export const markApplicationRejected = async (
  caseId: string,
): Promise<ApplicationCase> => {
  const response = await api.put<ApplicationCase>(
    `/api/applications/${caseId}/rejected`,
  );

  return response.data;
};

export const updateApplicationCase = async (
  caseId: string,
  data: ApplicationCaseUpdateRequest,
): Promise<ApplicationCase> => {
  const response = await api.put<ApplicationCase>(
    `/api/applications/${caseId}`,
    data,
  );

  return response.data;
};

export const deleteApplicationCase = async (caseId: string): Promise<void> => {
  await api.delete(`/api/applications/${caseId}`);
};