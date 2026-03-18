import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          AI Resume Analyzer
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Upload your resume and get an instant ATS score, identify missing skills,
          and receive actionable improvement suggestions — all powered by AI.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-3 text-3xl">📊</div>
            <h3 className="font-semibold text-zinc-900">ATS Score</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Get a score from 0-100 showing how well your resume passes ATS systems.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-3 text-3xl">🎯</div>
            <h3 className="font-semibold text-zinc-900">Missing Skills</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Discover key skills that are missing from your resume.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-3 text-3xl">💡</div>
            <h3 className="font-semibold text-zinc-900">Suggestions</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Get actionable tips to improve your resume and stand out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
