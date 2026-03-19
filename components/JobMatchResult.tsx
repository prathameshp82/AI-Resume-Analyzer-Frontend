"use client";

interface JobMatchData {
  match_score: number;
  missing_keywords: string[];
  recommendations: string[];
}

interface JobMatchResultProps {
  data: JobMatchData;
}

function getMatchColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function getMatchRingColor(score: number) {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-red-500";
}

function getMatchBg(score: number) {
  if (score >= 80) return "from-emerald-50 to-teal-50 border-emerald-200";
  if (score >= 60) return "from-amber-50 to-yellow-50 border-amber-200";
  return "from-red-50 to-rose-50 border-red-200";
}

function getMatchLabel(score: number) {
  if (score >= 80) return "Strong Match";
  if (score >= 60) return "Moderate Match";
  if (score >= 40) return "Partial Match";
  return "Weak Match";
}

function getMatchLabelColor(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function JobMatchResult({ data }: JobMatchResultProps) {
  const { match_score, missing_keywords, recommendations } = data;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (match_score / 100) * circumference;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Match Score */}
      <div className={`animate-scale-in rounded-3xl border bg-gradient-to-br p-10 text-center shadow-lg ${getMatchBg(match_score)}`}>
        <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Job Match Score
        </p>

        {/* Circular score */}
        <div className="relative mx-auto h-40 w-40">
          <svg className="h-40 w-40 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="currentColor" strokeWidth="6"
              className="text-white/60"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none" strokeWidth="6" strokeLinecap="round"
              className={`${getMatchRingColor(match_score)} score-ring-animated`}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`animate-count-up text-5xl font-bold ${getMatchColor(match_score)}`}>
              {match_score}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="mt-5">
          <span className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold ${getMatchLabelColor(match_score)}`}>
            {getMatchLabel(match_score)}
          </span>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="animate-fade-in-up delay-200 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-lg shadow-red-500/5 backdrop-blur-sm" style={{ animationFillMode: 'both' }}>
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/20">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Missing Keywords</h3>
        </div>

        {missing_keywords.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2.5">
            {missing_keywords.map((keyword, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:shadow-md hover:shadow-red-500/10"
                style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.08}s both` }}
              >
                <svg className="h-3.5 w-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {keyword}
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
            <p className="text-sm font-medium text-emerald-600">No missing keywords!</p>
            <p className="text-xs text-slate-400">Your resume covers all the key terms</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="animate-fade-in-up delay-300 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-lg shadow-violet-500/5 backdrop-blur-sm" style={{ animationFillMode: 'both' }}>
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Recommendations</h3>
          </div>
          <ul className="space-y-4">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50/80 to-violet-50/30 p-5 transition-all hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/5"
                style={{ animation: `slide-in-right 0.4s ease-out ${i * 0.1}s both` }}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white shadow-sm">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-slate-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
