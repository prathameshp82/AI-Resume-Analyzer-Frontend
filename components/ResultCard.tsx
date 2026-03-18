"use client";

interface ResultCardProps {
  score: number;
  missingSkills: string[];
  suggestions: string[];
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 60) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
}

export default function ResultCard({ score, missingSkills, suggestions }: ResultCardProps) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* ATS Score */}
      <div className={`rounded-xl border p-8 text-center ${getScoreBg(score)}`}>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">ATS Score</p>
        <p className={`mt-2 text-6xl font-bold ${getScoreColor(score)}`}>{score}</p>
        <p className="mt-1 text-sm text-zinc-500">out of 100</p>
      </div>

      {/* Missing Skills */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900">Missing Skills</h3>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, i) => (
            <span
              key={i}
              className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900">Improvement Suggestions</h3>
        <ul className="space-y-3">
          {suggestions.map((suggestion, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
