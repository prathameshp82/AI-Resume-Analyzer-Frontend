"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DashboardData {
  total_matches: number;
  average_score: number;
  best_score: number;
  trend: { created_at: string; match_score: number }[];
}

export default function JobMatchDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/backend/job-match/dashboard", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="animate-pulse rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-sm sm:rounded-3xl sm:p-10">
          <div className="mb-6 flex justify-center sm:mb-8">
            <div className="h-5 w-40 rounded-lg bg-slate-200 sm:h-6 sm:w-48" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6 sm:gap-4 sm:mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-100 sm:h-28 sm:rounded-2xl" />
            ))}
          </div>
          <div className="h-44 rounded-xl bg-slate-100 sm:h-52 sm:rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/60 bg-white/70 py-10 shadow-lg backdrop-blur-sm sm:rounded-3xl sm:py-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 sm:h-16 sm:w-16">
            <svg className="h-7 w-7 text-slate-300 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div className="text-center px-4">
            <p className="font-medium text-slate-500">No dashboard data yet</p>
            <p className="mt-1 text-sm text-slate-400">Run some job matches to see insights here</p>
          </div>
        </div>
      </div>
    );
  }

  const trendData = data.trend.map((item) => ({
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: item.match_score,
  }));

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const avgRounded = Math.round(data.average_score);

  const stats = [
    {
      label: "Total Matches",
      value: data.total_matches,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      ),
      gradient: "from-violet-500 to-fuchsia-500",
      shadow: "shadow-violet-500/20",
      bgLight: "from-violet-50 to-fuchsia-50",
      borderColor: "border-violet-100",
      textColor: "text-violet-600",
    },
    {
      label: "Average",
      value: avgRounded,
      suffix: "%",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      ),
      gradient: getScoreGradient(avgRounded),
      shadow: "shadow-indigo-500/20",
      bgLight: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-100",
      textColor: getScoreTextColor(avgRounded),
    },
    {
      label: "Best Score",
      value: data.best_score,
      suffix: "%",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.952m0 0a6.004 6.004 0 01-2.77-.952" />
      ),
      gradient: getScoreGradient(data.best_score),
      shadow: "shadow-emerald-500/20",
      bgLight: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-100",
      textColor: getScoreTextColor(data.best_score),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
      {/* Stats */}
      <div className="animate-fade-in-up rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl shadow-violet-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
        <div className="mb-5 flex items-center justify-center gap-2 sm:mb-8 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
            <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">Match Insights</h2>
            <p className="text-xs text-slate-400">Your job matching performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgLight} p-3 text-center transition-all duration-300 hover:shadow-lg sm:rounded-2xl sm:p-5 sm:hover:-translate-y-1`}
              style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow} sm:mb-3 sm:h-10 sm:w-10 sm:rounded-xl`}>
                <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  {stat.icon}
                </svg>
              </div>
              <p className={`text-xl font-extrabold sm:text-3xl ${stat.textColor}`}>
                {stat.value}
                {stat.suffix && <span className="text-sm sm:text-lg">{stat.suffix}</span>}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500 sm:mt-1 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <div
          className="animate-fade-in-up delay-200 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl shadow-violet-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8"
          style={{ animationFillMode: "both" }}
        >
          <div className="mb-4 flex items-center justify-center gap-2 sm:mb-6 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
              <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">Score Trend</h3>
              <p className="text-xs text-slate-400">How your match scores evolved</p>
            </div>
          </div>

          <div className="h-48 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    padding: "10px 14px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value}%`, "Match Score"]}
                  labelStyle={{ color: "#64748b", fontWeight: 600, marginBottom: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#scoreGradient)"
                  dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
