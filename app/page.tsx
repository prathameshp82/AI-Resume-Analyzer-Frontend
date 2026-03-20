import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-57px)] mesh-gradient overflow-hidden sm:min-h-[calc(100vh-73px)]">
      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-12 sm:px-6 sm:pt-20 sm:pb-16">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 sm:mb-6 sm:px-4 sm:py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            <span className="text-xs font-medium text-indigo-700 sm:text-sm">
              AI-Powered Resume Analysis
            </span>
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-in-up delay-100 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.1]"
            style={{ animationFillMode: "both" }}
          >
            Land Your Dream Job with{" "}
            <span className="gradient-text">AI Resume Analysis</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up delay-200 mt-4 max-w-xl px-2 text-base leading-relaxed text-slate-600 sm:mt-6 sm:px-0 sm:text-lg"
            style={{ animationFillMode: "both" }}
          >
            Upload your resume and get an instant ATS score, identify missing
            skills, and receive actionable suggestions — all powered by
            advanced AI.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up delay-300 mt-8 flex w-full flex-col items-center gap-3 px-4 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4 sm:px-0"
            style={{ animationFillMode: "both" }}
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-bg px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:brightness-110 btn-shine sm:w-auto"
            >
              Analyze My Resume
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-8 py-4 text-center text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md sm:w-auto"
            >
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="animate-fade-in delay-400 mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 sm:mt-12 sm:gap-6 sm:text-sm"
            style={{ animationFillMode: "both" }}
          >
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free to use
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Instant results
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              AI-Powered
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div
            className="animate-fade-in-up delay-300 card-hover group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-indigo-500/5 backdrop-blur-sm sm:p-8"
            style={{ animationFillMode: "both" }}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl">
              <svg className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">ATS Score</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Get a comprehensive score from 0-100 showing how well your resume
              passes applicant tracking systems.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="animate-fade-in-up delay-400 card-hover group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-purple-500/5 backdrop-blur-sm sm:p-8"
            style={{ animationFillMode: "both" }}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl">
              <svg className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">Missing Skills</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Discover the key skills and keywords that are missing from your
              resume to maximize impact.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="animate-fade-in-up delay-500 card-hover group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-cyan-500/5 backdrop-blur-sm sm:p-8"
            style={{ animationFillMode: "both" }}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl">
              <svg className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">Smart Suggestions</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Get actionable, personalized tips to improve your resume and
              stand out from the competition.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 text-center sm:mt-20">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500 sm:mt-3 sm:text-base">Three simple steps to a better resume</p>

          <div className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                1
              </div>
              <h4 className="mt-4 font-semibold text-slate-900">Upload PDF</h4>
              <p className="mt-1 text-sm text-slate-500">
                Drag and drop your resume or click to upload
              </p>
            </div>
            {/* Connector for mobile */}
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                2
              </div>
              <h4 className="mt-4 font-semibold text-slate-900">AI Analysis</h4>
              <p className="mt-1 text-sm text-slate-500">
                Our AI scans and evaluates your resume instantly
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-lg font-bold text-cyan-600">
                3
              </div>
              <h4 className="mt-4 font-semibold text-slate-900">Get Results</h4>
              <p className="mt-1 text-sm text-slate-500">
                Receive your score, missing skills, and suggestions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500 sm:px-6 sm:py-8 sm:text-sm">
          Built with AI to help you land your dream job.
        </div>
      </footer>
    </div>
  );
}
