"use client";

import { useState, useEffect } from "react";
import UploadResume from "@/components/UploadResume";
import ResultCard from "@/components/ResultCard";
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

export default function DashboardPage() {
  const isReady = useProtectedRoute();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getUsername());
  }, []);

  const fetchHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }

    setHistoryLoading(true);
    try {
      const token = getToken();
      const res = await fetch("http://127.0.0.1:8000/api/history/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const fetchAnalysisDetail = async (resumeId: number) => {
    try {
      const token = getToken();
      const res = await fetch("http://127.0.0.1:8000/api/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resume_id: resumeId }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          score: data.score,
          missingSkills: data.missing_skills,
          suggestions: data.suggestions,
        });
      }
    } catch {
      // silently fail
    }
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  const handleResult = (newResult: AnalysisResult) => {
    setResult(newResult);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Welcome, {username}. Upload your resume for AI analysis.
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col items-center gap-8">
          <UploadResume onResult={handleResult} />

          {result && (
            <ResultCard
              score={result.score}
              missingSkills={result.missingSkills}
              suggestions={result.suggestions}
            />
          )}

          <button
            onClick={fetchHistory}
            disabled={historyLoading}
            className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {historyLoading
              ? "Loading..."
              : showHistory
                ? "Hide History"
                : "Previous History"}
          </button>

          {showHistory && history.length > 0 && (
            <div className="w-full max-w-2xl">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                Previous Analyses
              </h2>
              <div className="space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => fetchAnalysisDetail(item.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:bg-zinc-50"
                  >
                    <span className="text-sm text-zinc-600">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-lg font-bold text-zinc-900">
                      Score: {item.score ?? "N/A"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showHistory && history.length === 0 && (
            <p className="text-sm text-zinc-500">No previous analyses found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
