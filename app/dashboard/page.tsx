"use client";

import { useState, useEffect } from "react";
import UploadResume from "@/components/UploadResume";
import ResultCard from "@/components/ResultCard";
import JobMatch from "@/components/JobMatch";
import JobMatchResult from "@/components/JobMatchResult";
import JobMatchDashboard from "@/components/JobMatchDashboard";
import ImproveResume from "@/components/ImproveResume";
import OptimizeResume from "@/components/OptimizeResume";
import OptimizedHistory from "@/components/OptimizedHistory";
import { useProtectedRoute } from "@/utils/protectRoute";
import { getSession } from "@/utils/auth";

interface AnalysisResult {
  score: number;
  missingSkills: string[];
  suggestions: string[];
}

interface HistoryItem {
  id: number;
  score: number | null;
  created_at: string;
}

interface JobMatchData {
  match_score: number;
  missing_keywords: string[];
  recommendations: string[];
}

interface JobMatchHistoryItem {
  id: number;
  score: number | null;
  resume_id: number;
  created_at: string;
}

export default function DashboardPage() {
  const isReady = useProtectedRoute();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Job match state
  const [matchData, setMatchData] = useState<JobMatchData | null>(null);
  const [jobMatchHistory, setJobMatchHistory] = useState<JobMatchHistoryItem[]>([]);
  const [showJobMatchHistory, setShowJobMatchHistory] = useState(false);
  const [jobMatchHistoryLoading, setJobMatchHistoryLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<"analyze" | "jobmatch" | "improve" | "optimize">("analyze");

  useEffect(() => {
    void (async () => {
      const session = await getSession();
      setUsername(session.username);
    })();
  }, []);

  const handleResult = (newResult: AnalysisResult, newResumeId: number) => {
    setResult(newResult);
    setResumeId(newResumeId);
  };

  const handleMatchResult = (data: JobMatchData) => {
    setMatchData(data);
  };

  // Resume analysis history
  const fetchHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }

    setHistoryLoading(true);
    try {
      const res = await fetch("/api/backend/history", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        setShowHistory(true);
      }
    } catch {
      // silently fail
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchAnalysisDetail = async (id: number) => {
    try {
      const res = await fetch("/api/backend/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ resume_id: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult({
          score: data.score,
          missingSkills: data.missing_skills,
          suggestions: data.suggestions,
        });
        setResumeId(id);
      }
    } catch {
      // silently fail
    }
  };

  // Job match history
  const fetchJobMatchHistory = async () => {
    if (showJobMatchHistory) {
      setShowJobMatchHistory(false);
      return;
    }

    setJobMatchHistoryLoading(true);
    try {
      const res = await fetch("/api/backend/job-match/history", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setJobMatchHistory(data);
        setShowJobMatchHistory(true);
      }
    } catch {
      // silently fail
    } finally {
      setJobMatchHistoryLoading(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-slate-400";
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center mesh-gradient">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="animate-fade-in-up mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back, <span className="gradient-text">{username}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:mt-2">
              Upload your resume and let AI do the analysis
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          className="animate-fade-in-up delay-100 mx-auto mb-8 flex w-full max-w-xl items-center rounded-2xl border border-white/60 bg-white/70 p-1.5 shadow-lg shadow-indigo-500/5 backdrop-blur-sm sm:mb-10"
          style={{ animationFillMode: "both" }}
        >
          <button
            onClick={() => setActiveTab("analyze")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
              activeTab === "analyze"
                ? "gradient-bg text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Analysis
          </button>
          <button
            onClick={() => setActiveTab("jobmatch")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
              activeTab === "jobmatch"
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Job Match
          </button>
          <button
            onClick={() => setActiveTab("improve")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
              activeTab === "improve"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Improve
          </button>
          <button
            onClick={() => setActiveTab("optimize")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-all duration-300 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
              activeTab === "optimize"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            Optimize
          </button>
        </div>

        {/* ===== RESUME ANALYSIS TAB ===== */}
        <div className={`flex flex-col items-center gap-8 sm:gap-10 ${activeTab === "analyze" ? "" : "hidden"}`}>
            {/* Upload Section */}
            <div className="animate-fade-in-up w-full" style={{ animationFillMode: "both" }}>
              <UploadResume onResult={handleResult} />
            </div>

            {/* Results */}
            {result && (
              <div className="animate-scale-in w-full">
                <ResultCard
                  score={result.score}
                  missingSkills={result.missingSkills}
                  suggestions={result.suggestions}
                />
              </div>
            )}

            {/* History Section */}
            <div className="w-full max-w-2xl mx-auto">
              {/* Divider with button */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/60" />
                </div>
                <div className="relative flex justify-center">
                  <button
                    onClick={fetchHistory}
                    disabled={historyLoading}
                    className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-md shadow-indigo-500/5 backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:shadow-lg hover:shadow-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2.5 sm:px-7 sm:py-3.5"
                  >
                    {historyLoading ? (
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
                        {showHistory ? "Hide History" : "View Previous Analyses"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* History List */}
              {showHistory && history.length > 0 && (
                <div className="mt-6 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl shadow-indigo-500/5 backdrop-blur-sm sm:mt-8 sm:rounded-3xl sm:p-6">
                  <div className="mb-5 flex items-center justify-center gap-3 sm:mb-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                      <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">Previous Analyses</h2>
                      <p className="text-xs text-slate-400">{history.length} {history.length === 1 ? "analysis" : "analyses"} found</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {history.map((item, index) => {
                      const scorePercent = item.score ?? 0;
                      return (
                        <button
                          key={item.id}
                          onClick={() => fetchAnalysisDetail(item.id)}
                          className="group relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 text-left transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 sm:rounded-2xl sm:p-5 sm:hover:-translate-y-1"
                          style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.08}s both` }}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-purple-500/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="mb-3 flex items-center justify-between sm:mb-4">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 sm:px-2.5 sm:py-1 sm:text-xs">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <svg className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </div>
                          <div className="flex items-end gap-3">
                            <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                              <svg className="h-12 w-12 -rotate-90 transform sm:h-14 sm:w-14" viewBox="0 0 44 44">
                                <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                <circle cx="22" cy="22" r="18" fill="none" strokeWidth="4" strokeLinecap="round"
                                  className={`${item.score !== null && item.score >= 80 ? "stroke-emerald-500" : item.score !== null && item.score >= 60 ? "stroke-amber-500" : "stroke-red-400"}`}
                                  strokeDasharray={`${2 * Math.PI * 18}`}
                                  strokeDashoffset={`${2 * Math.PI * 18 - (scorePercent / 100) * 2 * Math.PI * 18}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-xs font-bold sm:text-sm ${getScoreColor(item.score)}`}>{item.score ?? "\u2014"}</span>
                              </div>
                            </div>
                            <div className="min-w-0 pb-1">
                              <p className={`text-xs font-semibold ${getScoreColor(item.score)}`}>
                                {item.score !== null ? (item.score >= 80 ? "Excellent" : item.score >= 60 ? "Good" : item.score >= 40 ? "Fair" : "Needs Work") : "Pending"}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-400">
                                {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                item.score !== null && item.score >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                                item.score !== null && item.score >= 60 ? "bg-gradient-to-r from-amber-400 to-amber-500" :
                                "bg-gradient-to-r from-red-400 to-red-500"
                              }`}
                              style={{ width: `${scorePercent}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {showHistory && history.length === 0 && (
                <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-white/60 bg-white/70 py-10 shadow-lg backdrop-blur-sm sm:mt-8 sm:rounded-3xl sm:py-14">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 sm:h-16 sm:w-16">
                    <svg className="h-7 w-7 text-slate-300 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-slate-500">No previous analyses found</p>
                    <p className="mt-1 text-sm text-slate-400">Upload a resume above to get started</p>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* ===== JOB MATCH TAB ===== */}
        <div className={`flex flex-col items-center gap-8 sm:gap-10 ${activeTab === "jobmatch" ? "" : "hidden"}`}>
            {/* Job Match Dashboard / Insights */}
            <div className="animate-fade-in-up w-full" style={{ animationFillMode: "both" }}>
              <JobMatchDashboard />
            </div>

            {/* Job Match Input */}
            <div className="animate-fade-in-up delay-100 w-full" style={{ animationFillMode: "both" }}>
              <JobMatch resumeId={resumeId} onResult={handleMatchResult} />
            </div>

            {/* Match Results */}
            {matchData && (
              <div className="animate-scale-in w-full">
                <JobMatchResult data={matchData} />
              </div>
            )}

            {/* Job Match History */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/60" />
                </div>
                <div className="relative flex justify-center">
                  <button
                    onClick={fetchJobMatchHistory}
                    disabled={jobMatchHistoryLoading}
                    className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-md shadow-violet-500/5 backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50 hover:text-violet-700 hover:shadow-lg hover:shadow-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2.5 sm:px-7 sm:py-3.5"
                  >
                    {jobMatchHistoryLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className={`h-4 w-4 transition-transform duration-300 ${showJobMatchHistory ? "rotate-180" : "group-hover:scale-110"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          {showJobMatchHistory ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                        {showJobMatchHistory ? "Hide Match History" : "View Match History"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Job Match History List */}
              {showJobMatchHistory && jobMatchHistory.length > 0 && (
                <div className="mt-6 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl shadow-violet-500/5 backdrop-blur-sm sm:mt-8 sm:rounded-3xl sm:p-6">
                  <div className="mb-5 flex items-center justify-center gap-3 sm:mb-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                      <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">Job Match History</h2>
                      <p className="text-xs text-slate-400">{jobMatchHistory.length} {jobMatchHistory.length === 1 ? "match" : "matches"} found</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {jobMatchHistory.map((item, index) => {
                      const scorePercent = item.score ?? 0;
                      const scoreColor = item.score !== null && item.score >= 80 ? "text-emerald-600" : item.score !== null && item.score >= 60 ? "text-amber-600" : item.score !== null ? "text-red-500" : "text-slate-400";
                      const ringColor = item.score !== null && item.score >= 80 ? "stroke-emerald-500" : item.score !== null && item.score >= 60 ? "stroke-amber-500" : "stroke-red-400";
                      const barColor = item.score !== null && item.score >= 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : item.score !== null && item.score >= 60 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-red-400 to-red-500";
                      const label = item.score !== null ? (item.score >= 80 ? "Strong Match" : item.score >= 60 ? "Moderate" : item.score >= 40 ? "Partial" : "Weak") : "Pending";

                      return (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 transition-all duration-300 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10 sm:rounded-2xl sm:p-5 sm:hover:-translate-y-1"
                          style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.08}s both` }}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.02] to-fuchsia-500/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />

                          {/* Top row */}
                          <div className="mb-3 flex items-center justify-between sm:mb-4">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600 sm:px-2.5 sm:py-1 sm:text-xs">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-600 sm:text-[11px]">
                              Resume #{item.resume_id}
                            </span>
                          </div>

                          {/* Score */}
                          <div className="flex items-end gap-3">
                            <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                              <svg className="h-12 w-12 -rotate-90 transform sm:h-14 sm:w-14" viewBox="0 0 44 44">
                                <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                <circle cx="22" cy="22" r="18" fill="none" strokeWidth="4" strokeLinecap="round"
                                  className={ringColor}
                                  strokeDasharray={`${2 * Math.PI * 18}`}
                                  strokeDashoffset={`${2 * Math.PI * 18 - (scorePercent / 100) * 2 * Math.PI * 18}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-xs font-bold sm:text-sm ${scoreColor}`}>{item.score ?? "\u2014"}</span>
                              </div>
                            </div>
                            <div className="min-w-0 pb-1">
                              <p className={`text-xs font-semibold ${scoreColor}`}>{label}</p>
                              <p className="mt-0.5 text-[11px] text-slate-400">
                                {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>

                          {/* Bar */}
                          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${scorePercent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {showJobMatchHistory && jobMatchHistory.length === 0 && (
                <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-white/60 bg-white/70 py-10 shadow-lg backdrop-blur-sm sm:mt-8 sm:rounded-3xl sm:py-14">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 sm:h-16 sm:w-16">
                    <svg className="h-7 w-7 text-violet-300 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-slate-500">No job matches yet</p>
                    <p className="mt-1 text-sm text-slate-400">Paste a job description above to get started</p>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* ===== IMPROVE RESUME TAB ===== */}
        <div className={`flex flex-col items-center gap-8 sm:gap-10 ${activeTab === "improve" ? "" : "hidden"}`}>
          <div className="animate-fade-in-up w-full" style={{ animationFillMode: "both" }}>
            <ImproveResume resumeId={resumeId} />
          </div>
        </div>

        {/* ===== OPTIMIZE RESUME TAB ===== */}
        <div className={`flex flex-col items-center gap-8 sm:gap-10 ${activeTab === "optimize" ? "" : "hidden"}`}>
          <div className="animate-fade-in-up w-full" style={{ animationFillMode: "both" }}>
            <OptimizeResume resumeId={resumeId} />
          </div>

          <div className="animate-fade-in-up delay-200 w-full" style={{ animationFillMode: "both" }}>
            <OptimizedHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
