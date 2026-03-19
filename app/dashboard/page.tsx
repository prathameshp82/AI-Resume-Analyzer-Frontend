"use client";

import { useState, useEffect } from "react";
import UploadResume from "@/components/UploadResume";
import ResultCard from "@/components/ResultCard";
import JobMatch from "@/components/JobMatch";
import JobMatchResult from "@/components/JobMatchResult";
import { useProtectedRoute } from "@/utils/protectRoute";
import { getUsername, getToken, logout } from "@/utils/auth";

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
  const [activeTab, setActiveTab] = useState<"analyze" | "jobmatch">("analyze");

  useEffect(() => {
    setUsername(getUsername());
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
      const token = getToken();
      const res = await fetch("http://127.0.0.1:8000/api/history/", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = getToken();
      const res = await fetch("http://127.0.0.1:8000/api/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      const token = getToken();
      const res = await fetch("http://127.0.0.1:8000/api/job-match/history/", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="animate-fade-in-up mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, <span className="gradient-text">{username}</span>
            </h1>
            <p className="mt-2 text-slate-500">
              Upload your resume and let AI do the analysis
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="animate-fade-in-up delay-100 mx-auto mb-10 flex w-full max-w-md items-center rounded-2xl border border-white/60 bg-white/70 p-1.5 shadow-lg shadow-indigo-500/5 backdrop-blur-sm" style={{ animationFillMode: 'both' }}>
          <button
            onClick={() => setActiveTab("analyze")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              activeTab === "analyze"
                ? "gradient-bg text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Resume Analysis
          </button>
          <button
            onClick={() => setActiveTab("jobmatch")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              activeTab === "jobmatch"
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Job Match
          </button>
        </div>

        {/* ===== RESUME ANALYSIS TAB ===== */}
        {activeTab === "analyze" && (
          <div className="flex flex-col items-center gap-10">
            {/* Upload Section */}
            <div className="animate-fade-in-up w-full" style={{ animationFillMode: 'both' }}>
              <UploadResume onResult={handleResult} />
            </div>

            {/* Results */}
            {result && (
              <div className="animate-scale-in flex w-full justify-center">
                <ResultCard
                  score={result.score}
                  missingSkills={result.missingSkills}
                  suggestions={result.suggestions}
                />
              </div>
            )}

            {/* History Section */}
            <div className="w-full max-w-2xl mx-auto">
              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/60" />
                </div>
                <div className="relative flex justify-center">
                  <button
                    onClick={fetchHistory}
                    disabled={historyLoading}
                    className="group inline-flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/90 px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-md shadow-indigo-500/5 backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:shadow-lg hover:shadow-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {historyLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading history...
                      </>
                    ) : (
                      <>
                        <svg className={`h-4 w-4 transition-transform duration-300 ${showHistory ? 'rotate-180' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
                <div className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-slate-900">Previous Analyses</h2>
                      <p className="text-xs text-slate-400">{history.length} {history.length === 1 ? 'analysis' : 'analyses'} found</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {history.map((item, index) => {
                      const scorePercent = item.score ?? 0;
                      return (
                        <button
                          key={item.id}
                          onClick={() => fetchAnalysisDetail(item.id)}
                          className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-5 text-left transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
                          style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.08}s both` }}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-purple-500/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="mb-4 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
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
                            <div className="relative h-14 w-14 shrink-0">
                              <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 44 44">
                                <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                <circle cx="22" cy="22" r="18" fill="none" strokeWidth="4" strokeLinecap="round"
                                  className={`${item.score !== null && item.score >= 80 ? 'stroke-emerald-500' : item.score !== null && item.score >= 60 ? 'stroke-amber-500' : 'stroke-red-400'}`}
                                  strokeDasharray={`${2 * Math.PI * 18}`}
                                  strokeDashoffset={`${2 * Math.PI * 18 - (scorePercent / 100) * 2 * Math.PI * 18}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>{item.score ?? "—"}</span>
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
                                item.score !== null && item.score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                                item.score !== null && item.score >= 60 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                                'bg-gradient-to-r from-red-400 to-red-500'
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
                <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/70 py-14 shadow-lg backdrop-blur-sm">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50">
                    <svg className="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
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
        )}

        {/* ===== JOB MATCH TAB ===== */}
        {activeTab === "jobmatch" && (
          <div className="flex flex-col items-center gap-10">
            {/* Job Match Input */}
            <div className="animate-fade-in-up w-full" style={{ animationFillMode: 'both' }}>
              <JobMatch resumeId={resumeId} onResult={handleMatchResult} />
            </div>

            {/* Match Results */}
            {matchData && (
              <div className="animate-scale-in flex w-full justify-center">
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
                    className="group inline-flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/90 px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-md shadow-violet-500/5 backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50 hover:text-violet-700 hover:shadow-lg hover:shadow-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {jobMatchHistoryLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading history...
                      </>
                    ) : (
                      <>
                        <svg className={`h-4 w-4 transition-transform duration-300 ${showJobMatchHistory ? 'rotate-180' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
                <div className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-violet-500/5 backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-slate-900">Job Match History</h2>
                      <p className="text-xs text-slate-400">{jobMatchHistory.length} {jobMatchHistory.length === 1 ? 'match' : 'matches'} found</p>
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
                          className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-5 transition-all duration-300 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1"
                          style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.08}s both` }}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.02] to-fuchsia-500/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />

                          {/* Top row */}
                          <div className="mb-4 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">
                              Resume #{item.resume_id}
                            </span>
                          </div>

                          {/* Score */}
                          <div className="flex items-end gap-3">
                            <div className="relative h-14 w-14 shrink-0">
                              <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 44 44">
                                <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                <circle cx="22" cy="22" r="18" fill="none" strokeWidth="4" strokeLinecap="round"
                                  className={ringColor}
                                  strokeDasharray={`${2 * Math.PI * 18}`}
                                  strokeDashoffset={`${2 * Math.PI * 18 - (scorePercent / 100) * 2 * Math.PI * 18}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-sm font-bold ${scoreColor}`}>{item.score ?? "—"}</span>
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
                <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/70 py-14 shadow-lg backdrop-blur-sm">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50">
                    <svg className="h-8 w-8 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
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
        )}
      </div>
    </div>
  );
}
