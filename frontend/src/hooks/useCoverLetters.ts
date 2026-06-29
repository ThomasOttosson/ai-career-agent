import {
  createCoverLetter,
  deleteCoverLetter,
  generateCoverLetter,
  getCoverLetters,
  updateCoverLetter,
  type CoverLetter,
  type JobPosting,
} from "../api/jobApi";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useCoverLetters(_jobs?: JobPosting[], userId?: string) {
  const [coverLetters, setCoverLetters] = useState<Record<string, CoverLetter>>(
    {},
  );

  const [manualCoverLetters, setManualCoverLetters] = useState<CoverLetter[]>(
    [],
  );

  const [editedLetters, setEditedLetters] = useState<Record<string, string>>(
    {},
  );

  const loadAllCoverLetters = async () => {
    const letters = await getCoverLetters();

    const generatedByJobId: Record<string, CoverLetter> = {};
    const manualLetters: CoverLetter[] = [];
    const editedByJobId: Record<string, string> = {};

    letters.forEach((letter) => {
      if (letter.jobId) {
        generatedByJobId[letter.jobId] = letter;
        editedByJobId[letter.jobId] = letter.content;
      } else {
        manualLetters.push(letter);
      }
    });

    setCoverLetters(generatedByJobId);
    setManualCoverLetters(manualLetters);
    setEditedLetters(editedByJobId);
  };

  useEffect(() => {
    if (userId) {
      loadAllCoverLetters();
    } else {
      setCoverLetters({});
      setManualCoverLetters([]);
      setEditedLetters({});
    }
  }, [userId]);

  const generateMutation = useMutation({
    mutationFn: ({ jobId, tone }: { jobId: string; tone: string }) =>
      generateCoverLetter({ jobId, tone }),

    onSuccess: (result) => {
      if (!result.jobId) return;

      setCoverLetters((prev) => ({
        ...prev,
        [result.jobId!]: result,
      }));

      setEditedLetters((prev) => ({
        ...prev,
        [result.jobId!]: result.content,
      }));
    },
  });

  const createManualMutation = useMutation({
    mutationFn: createCoverLetter,

    onSuccess: (result) => {
      setManualCoverLetters((prev) => [result, ...prev]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      coverLetterId,
      title,
      company,
      content,
    }: {
      coverLetterId: string;
      title?: string;
      company?: string;
      content: string;
    }) =>
      updateCoverLetter(coverLetterId, {
        title,
        company,
        content,
      }),

    onSuccess: (result) => {
      if (result.jobId) {
        setCoverLetters((prev) => ({
          ...prev,
          [result.jobId!]: result,
        }));

        setEditedLetters((prev) => ({
          ...prev,
          [result.jobId!]: result.content,
        }));
      } else {
        setManualCoverLetters((prev) =>
          prev.map((letter) => (letter.id === result.id ? result : letter)),
        );
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      coverLetterId,
    }: {
      coverLetterId: string;
      jobId?: string;
    }) => deleteCoverLetter(coverLetterId),

    onSuccess: (_data, variables) => {
      if (variables.jobId) {
        setCoverLetters((prev) => {
          const next = { ...prev };
          delete next[variables.jobId!];
          return next;
        });

        setEditedLetters((prev) => {
          const next = { ...prev };
          delete next[variables.jobId!];
          return next;
        });
      } else {
        setManualCoverLetters((prev) =>
          prev.filter((letter) => letter.id !== variables.coverLetterId),
        );
      }
    },
  });

  const editLetter = (jobId: string, content: string) => {
    setEditedLetters((prev) => ({
      ...prev,
      [jobId]: content,
    }));
  };

  const saveEditedLetter = (jobId: string) => {
    const currentLetter = coverLetters[jobId];

    if (!currentLetter) return;

    updateMutation.mutate({
      coverLetterId: currentLetter.id,
      title: currentLetter.title,
      company: currentLetter.company,
      content: editedLetters[jobId] ?? currentLetter.content,
    });
  };

  const removeLetter = (jobId: string) => {
    const currentLetter = coverLetters[jobId];

    if (!currentLetter) return;

    deleteMutation.mutate({
      coverLetterId: currentLetter.id,
      jobId,
    });
  };

  const createManualLetter = (
    title: string,
    company: string,
    content: string,
  ) => {
    createManualMutation.mutate({ title, company, content });
  };

  const updateManualLetter = (
    coverLetterId: string,
    title: string,
    company: string,
    content: string,
  ) => {
    updateMutation.mutate({
      coverLetterId,
      title,
      company,
      content,
    });
  };

  const removeManualLetter = (coverLetterId: string) => {
    deleteMutation.mutate({
      coverLetterId,
    });
  };

  return {
    coverLetters,
    setCoverLetters,
    manualCoverLetters,
    editedLetters,
    setEditedLetters,
    generateMutation,
    updateMutation,
    createManualMutation,
    deleteMutation,
    saveEditedLetter,
    editLetter,
    removeLetter,
    createManualLetter,
    updateManualLetter,
    removeManualLetter,
    reloadCoverLetters: loadAllCoverLetters,
  };
}