"use client";

import { useState } from "react";

interface JobMatchData {
  match_score: number;
  missing_keywords: string[];
  recommendations: string[];
}

interface JobMatchProps {
  resumeId: number | null;
  onResult: (data: JobMatchData) => void;
}

export default function JobMatch({ resumeId, onResult }: JobMatchProps) {
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async () => {
    if (!resumeId) {
      setError("Please upload and analyze a resume first.");
      return;
    }
    if (!jobDesc.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/backend/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          resume_id: resumeId,
          job_description: jobDesc,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.detail || "Job match failed");
      }

      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-indigo-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-center gap-2 sm:mb-6 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
            <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">Job Match Analysis</h2>
            <p className="text-xs text-slate-400">Compare your resume against a job description</p>
          </div>
        </div>

        {/* Resume status */}
        <div
          className={`mb-4 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:mb-5 sm:px-4 sm:py-2.5 sm:text-sm ${
            resumeId
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {resumeId ? (
            <>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Resume ready for matching</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Upload & analyze a resume first</span>
            </>
          )}
        </div>

        {/* Textarea */}
        <div className="mb-4 sm:mb-5">
          <label htmlFor="job-desc" className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2">
            Job Description
          </label>
          <textarea
            id="job-desc"
            rows={5}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:rounded-2xl sm:px-4 sm:py-3.5"
          />
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
            <span className="hidden sm:inline">Include requirements, skills, and qualifications</span>
            <span className="sm:hidden">Paste full job description</span>
            <span>{jobDesc.length} chars</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="animate-fade-in mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 sm:mb-5 sm:px-4 sm:py-3 sm:text-sm">
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleMatch}
          disabled={loading || !resumeId || !jobDesc.trim()}
          className="group w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg disabled:hover:brightness-100 btn-shine sm:rounded-2xl sm:py-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Matching...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              Analyze Job Match
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
