"use client";

interface ResultCardProps {
  score: number;
  missingSkills: string[];
  suggestions: string[];
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function getScoreRingColor(score: number) {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-red-500";
}

function getScoreBg(score: number) {
  if (score >= 80) return "from-emerald-50 to-green-50 border-emerald-200";
  if (score >= 60) return "from-amber-50 to-yellow-50 border-amber-200";
  return "from-red-50 to-rose-50 border-red-200";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

function getScoreLabelColor(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function ResultCard({ score, missingSkills, suggestions }: ResultCardProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
      {/* ATS Score */}
      <div className={`animate-scale-in rounded-2xl border bg-gradient-to-br p-6 text-center shadow-lg sm:rounded-3xl sm:p-10 ${getScoreBg(score)}`}>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 sm:mb-6 sm:text-sm">
          ATS Score
        </p>

        {/* Circular score */}
        <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40">
          <svg className="h-32 w-32 -rotate-90 transform sm:h-40 sm:w-40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/60" />
            <circle
              cx="50" cy="50" r="45"
              fill="none" strokeWidth="6" strokeLinecap="round"
              className={`${getScoreRingColor(score)} score-ring-animated`}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`animate-count-up text-4xl font-bold sm:text-5xl ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="mt-4 sm:mt-5">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold sm:px-4 sm:py-1.5 ${getScoreLabelColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Missing Skills */}
      <div className="animate-fade-in-up delay-200 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8" style={{ animationFillMode: "both" }}>
        <div className="mb-4 flex items-center justify-center gap-2 sm:mb-5 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
            <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">Missing Skills</h3>
        </div>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {missingSkills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-gradient-to-r from-red-50 to-rose-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-all hover:shadow-md hover:shadow-red-500/10 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
                style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.08}s both` }}
              >
                <svg className="h-3 w-3 text-red-400 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
              <svg className="h-6 w-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-emerald-600">No missing skills detected!</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="animate-fade-in-up delay-300 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8" style={{ animationFillMode: "both" }}>
        <div className="mb-4 flex items-center justify-center gap-2 sm:mb-5 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
            <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">Improvement Suggestions</h3>
        </div>
        <ul className="space-y-3 sm:space-y-4">
          {suggestions.map((suggestion, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/80 to-indigo-50/30 p-3 transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 sm:gap-4 sm:rounded-2xl sm:p-4"
              style={{ animation: `slide-in-right 0.4s ease-out ${i * 0.1}s both` }}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg gradient-bg text-[10px] font-bold text-white shadow-sm sm:h-7 sm:w-7 sm:text-xs">
                {i + 1}
              </span>
              <span className="text-xs leading-relaxed text-slate-700 sm:text-sm">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
