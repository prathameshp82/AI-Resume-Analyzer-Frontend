"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ResumePreview from "@/components/ResumePreview";
import { downloadOptimizedResumePdf, downloadOptimizedResumeTxt } from "@/utils/resumeDownload";

interface OptimizedItem {
  id: number;
  job_description: string;
  optimized_text: string;
  created_at: string;
}

function downloadBaseName(item: OptimizedItem) {
  const d = new Date(item.created_at);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `optimized_resume_${item.id}_${y}${m}${day}`;
}

export default function OptimizedHistory() {
  const [history, setHistory] = useState<OptimizedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OptimizedItem | null>(null);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.body);
  }, []);

  const fetchHistory = async () => {
    if (loaded && showHistory) {
      setShowHistory(false);
      return;
    }
    if (loaded) {
      setShowHistory(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/backend/resume/optimized/history", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        setLoaded(true);
        setShowHistory(true);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelectedItem(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (selectedItem) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toggle Button */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200/60" />
        </div>
        <div className="relative flex justify-center">
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-md shadow-amber-500/5 backdrop-blur-sm transition-all hover:border-amber-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 hover:shadow-lg hover:shadow-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2.5 sm:px-7 sm:py-3.5"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className={`h-4 w-4 transition-transform duration-300 ${showHistory ? "rotate-180" : "group-hover:scale-110"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {showHistory ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                {showHistory ? "Hide Optimization History" : "View Optimization History"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Cards */}
      {showHistory && history.length > 0 && (
        <div className="mt-6 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl shadow-amber-500/5 backdrop-blur-sm sm:mt-8 sm:rounded-3xl sm:p-6">
          <div className="mb-5 flex items-center justify-center gap-3 sm:mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
              <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">Optimization History</h2>
              <p className="text-xs text-slate-400">{history.length} optimized {history.length === 1 ? "resume" : "resumes"}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 text-left transition-all duration-300 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/10 sm:rounded-2xl sm:hover:-translate-y-1"
                style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.08}s both` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative flex-1 p-4 sm:p-5">
                  <button
                    type="button"
                    className="absolute inset-0 z-0 rounded-t-xl sm:rounded-t-2xl"
                    onClick={() => setSelectedItem(item)}
                    aria-label={`View optimized resume from ${new Date(item.created_at).toLocaleDateString()}`}
                  />
                  <div className="pointer-events-none relative z-10 space-y-3">
                    <div className="flex items-center justify-between sm:mb-1">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 sm:px-2.5 sm:py-1 sm:text-xs">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <svg className="h-4 w-4 text-slate-300 group-hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Job Description</p>
                      <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{item.job_description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View full preview
                    </div>
                  </div>
                </div>

                <div className="relative z-20 flex flex-wrap items-center justify-end gap-1.5 border-t border-slate-100/90 bg-white/85 px-3 py-2.5 backdrop-blur-sm sm:px-4">
                  <button
                    type="button"
                    onClick={() => downloadOptimizedResumePdf(item.optimized_text, downloadBaseName(item))}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-200/90 bg-amber-50/90 px-2.5 py-1.5 text-[11px] font-semibold text-amber-900 shadow-sm transition-colors hover:bg-amber-100"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadOptimizedResumeTxt(item.optimized_text, downloadBaseName(item))}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    TXT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {showHistory && history.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-white/60 bg-white/70 py-10 shadow-lg backdrop-blur-sm sm:mt-8 sm:rounded-3xl sm:py-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 sm:h-16 sm:w-16">
            <svg className="h-7 w-7 text-amber-300 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-slate-500">No optimized resumes yet</p>
            <p className="mt-1 text-sm text-slate-400">Optimize your resume above to see history here</p>
          </div>
        </div>
      )}

      {/* Modal rendered via portal: dashboard wraps this section in animate-fade-in-up (transform), which breaks position:fixed without a portal */}
      {modalRoot &&
        selectedItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex min-h-0 items-stretch justify-center overflow-hidden p-0 sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="optimized-resume-title"
          >
            <button
              type="button"
              aria-label="Close preview"
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-md animate-fade-in"
              onClick={closeModal}
            />

            <div
              className="relative z-10 flex h-full min-h-0 w-full max-w-7xl flex-col overflow-hidden bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.4)] animate-scale-in sm:max-h-full sm:rounded-2xl sm:ring-1 sm:ring-slate-200/80 md:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/80 px-4 py-3 backdrop-blur-sm sm:gap-3 sm:px-6 sm:py-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 id="optimized-resume-title" className="truncate text-base font-bold text-slate-900 sm:text-lg">
                      Optimized Resume
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(selectedItem.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      {" · "}
                      {new Date(selectedItem.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => downloadOptimizedResumePdf(selectedItem.optimized_text, downloadBaseName(selectedItem))}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 shadow-sm transition-colors hover:bg-amber-100 sm:text-sm"
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadOptimizedResumeTxt(selectedItem.optimized_text, downloadBaseName(selectedItem))}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:text-sm"
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    TXT
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="border-b border-slate-100 bg-slate-50/40 px-4 py-4 sm:px-6 sm:py-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Target Job Description</p>
                  <p className="text-sm leading-relaxed text-slate-600">{selectedItem.job_description}</p>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50/60">
                    <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 bg-white px-4 py-2.5 sm:px-5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-700">ATS-friendly preview</span>
                      <span className="text-[11px] text-neutral-500">Simple layout · standard sections · plain text bullets</span>
                    </div>
                    <div className="min-h-[12rem] bg-white p-3 sm:p-5">
                      <ResumePreview text={selectedItem.optimized_text} variant="optimized" fillParent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          modalRoot
        )}
    </div>
  );
}
