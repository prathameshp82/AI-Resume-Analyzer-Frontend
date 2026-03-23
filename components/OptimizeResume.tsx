"use client";

import { useState, useRef } from "react";
import ResumePreview from "@/components/ResumePreview";
import { downloadOptimizedResumePdf } from "@/utils/resumeDownload";

interface OptimizeResumeProps {
  resumeId: number | null;
}

interface OptimizeResult {
  original_resume: string;
  optimized_resume: string;
  optimized_id: number;
}

export default function OptimizeResume({ resumeId }: OptimizeResumeProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [editedResume, setEditedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleOptimize = async () => {
    if (!resumeId) {
      setError("Please upload a resume first in the Analysis tab.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/backend/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resume_id: resumeId, job_description: jobDescription }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to optimize resume.");
      }

      const data: OptimizeResult = await res.json();
      setResult(data);
      setEditedResume(data.optimized_resume);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = editedResume;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadOptimizedResumePdf(editedResume, "optimized_resume_ats");
  };

  return (
    <div className="w-full">
      {/* Input Section */}
      <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-xl shadow-indigo-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 sm:h-11 sm:w-11">
            <svg className="h-5 w-5 text-white sm:h-5.5 sm:w-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Optimize Resume</h2>
            <p className="text-xs text-slate-400 sm:text-sm">Tailor your resume for a specific job posting</p>
          </div>
        </div>

        {!resumeId && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
            <svg className="h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm font-medium text-amber-700">Upload a resume in the Analysis tab first to get started.</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-amber-300 focus:bg-white focus:shadow-lg focus:shadow-amber-500/5 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3">
              <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5-.217 3.374-1.948 3.374H4.711c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.252 12.748zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleOptimize}
            disabled={loading || !resumeId}
            className="group w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg sm:text-base"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Optimizing your resume for this job...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Optimize Resume with AI
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 animate-fade-in">
          <div className="rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm sm:rounded-3xl sm:p-12">
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse-glow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-8 w-8 text-amber-500 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-800">Optimizing your resume...</p>
                <p className="mt-1 text-sm text-slate-400">AI is tailoring your resume for this job posting</p>
              </div>
              <div className="mt-2 flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Screen Result */}
      {result && !loading && (
        <div ref={resultRef} className="mt-8 animate-scale-in">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 sm:gap-6">
            {/* Original Resume */}
            <div className="rounded-2xl border border-white/60 bg-white/80 shadow-xl shadow-slate-500/5 backdrop-blur-sm sm:rounded-3xl overflow-hidden">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/50 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/80">
                    <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">Original Resume</h3>
                    <p className="text-[11px] text-slate-400">Your uploaded version</p>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <ResumePreview text={result.original_resume} variant="original" />
              </div>
            </div>

            {/* Optimized Resume */}
            <div className="rounded-2xl border border-amber-100/60 bg-white/80 shadow-xl shadow-amber-500/5 backdrop-blur-sm sm:rounded-3xl overflow-hidden">
              <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/50 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 shadow-md shadow-amber-500/20">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-amber-800">AI Optimized Resume</h3>
                      <p className="text-[11px] text-amber-500">Tailored for the job</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                        isEditing
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-white/80 text-slate-500 hover:bg-amber-50 hover:text-amber-600 border border-slate-200"
                      }`}
                    >
                      {isEditing ? "Editing" : "Edit"}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 transition-all hover:bg-amber-50 hover:text-amber-600"
                    >
                      {copied ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Copied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                          Copy
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 transition-all hover:bg-amber-50 hover:text-amber-600"
                    >
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        ATS PDF
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                {isEditing ? (
                  <textarea
                    value={editedResume}
                    onChange={(e) => setEditedResume(e.target.value)}
                    className="max-h-[500px] min-h-[400px] w-full resize-y rounded-xl border border-amber-200 bg-amber-50/30 p-4 text-sm leading-relaxed text-slate-700 font-mono transition-all focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 sm:max-h-[600px]"
                  />
                ) : (
                  <ResumePreview text={editedResume} variant="optimized" />
                )}
              </div>
            </div>
          </div>

          {/* Optimized ID Badge */}
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-sm">
              <svg className="h-3.5 w-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Saved as Optimized Resume #{result.optimized_id}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
