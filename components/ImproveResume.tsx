"use client";

import { useState } from "react";

interface ImproveResumeProps {
  resumeId: number | null;
}

interface ExperienceItem {
  title: string;
  company: string | null;
  location: string | null;
  dates: string;
  bullet_points?: string[];
  bullets?: string[];
}

interface ProjectItem {
  title: string;
  technologies: string;
  dates: string;
  bullet_points?: string[];
  bullets?: string[];
}

interface EducationItem {
  degree: string;
  university: string;
  location: string;
  dates: string;
  details: string;
}

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
}

interface SkillItem {
  category: string;
  skills: string;
}

interface FullResume {
  contact_info: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  skills: Record<string, string> | SkillItem[];
}

interface ImproveResult {
  improved_summary: string;
  improved_experience: ExperienceItem[];
  added_skills: string[];
  full_resume_with_improvements?: FullResume;
}

export default function ImproveResume({ resumeId }: ImproveResumeProps) {
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImproveResult | null>(null);
  const [activeSection, setActiveSection] = useState<"highlights" | "full">("highlights");
  const [copied, setCopied] = useState(false);

  const handleImprove = async () => {
    if (!resumeId) {
      setError("Please upload and analyze a resume first (in the Analysis tab).");
      return;
    }
    if (!jobDesc.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/backend/resume/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          resume_id: resumeId,
          job_description: jobDesc,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.detail || "Failed to improve resume");
      }

      const data = await res.json();
      setResult(data);
      setActiveSection("highlights");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /** Normalize skills to [category, skillsString][] regardless of API shape */
  const normalizeSkills = (skills: Record<string, string> | SkillItem[]): [string, string][] => {
    if (Array.isArray(skills)) {
      return skills.map((s) => [s.category, s.skills]);
    }
    return Object.entries(skills);
  };

  /** Get bullet points from either field name */
  const getBullets = (item: { bullet_points?: string[]; bullets?: string[] }): string[] => {
    return item.bullet_points || item.bullets || [];
  };

  const buildPlainText = () => {
    if (!result || !result.full_resume_with_improvements) return "";
    const r = result.full_resume_with_improvements;
    const lines: string[] = [];

    // Contact
    lines.push(r.contact_info.name);
    lines.push(`${r.contact_info.phone} | ${r.contact_info.email} | ${r.contact_info.location}`);
    lines.push(`LinkedIn: ${r.contact_info.linkedin} | GitHub: ${r.contact_info.github}`);
    lines.push("");

    // Summary
    lines.push("SUMMARY");
    lines.push(r.summary);
    lines.push("");

    // Experience
    lines.push("EXPERIENCE");
    r.experience.forEach((exp) => {
      lines.push(`${exp.title}${exp.company ? ` | ${exp.company}` : ""}${exp.location ? ` | ${exp.location}` : ""}`);
      lines.push(exp.dates);
      getBullets(exp).forEach((bp) => lines.push(`  - ${bp}`));
      lines.push("");
    });

    // Projects
    if (r.projects?.length) {
      lines.push("PROJECTS");
      r.projects.forEach((proj) => {
        lines.push(`${proj.title} | ${proj.technologies} | ${proj.dates}`);
        getBullets(proj).forEach((bp) => lines.push(`  - ${bp}`));
        lines.push("");
      });
    }

    // Education
    lines.push("EDUCATION");
    r.education.forEach((edu) => {
      lines.push(`${edu.degree} | ${edu.university} | ${edu.location}`);
      lines.push(edu.dates);
      if (edu.details) lines.push(edu.details);
      lines.push("");
    });

    // Skills
    lines.push("SKILLS");
    normalizeSkills(r.skills).forEach(([cat, val]) => {
      lines.push(`${cat}: ${val}`);
    });

    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
      {/* Input Card */}
      <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-teal-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-center gap-2 sm:mb-6 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
            <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">AI Resume Improver</h2>
            <p className="text-xs text-slate-400">Tailor your resume for a specific job</p>
          </div>
        </div>

        {/* Resume status */}
        <div
          className={`mb-4 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:mb-5 sm:px-4 sm:py-2.5 sm:text-sm ${
            resumeId
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {resumeId ? (
            <>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Resume #{resumeId} ready</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Upload & analyze a resume first</span>
            </>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-4 sm:mb-5">
          <label htmlFor="improve-job-desc" className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2">
            Target Job Description
          </label>
          <textarea
            id="improve-job-desc"
            rows={5}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description you want to tailor your resume for..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 sm:rounded-2xl sm:px-4 sm:py-3.5"
          />
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
            <span className="hidden sm:inline">AI will rewrite your resume to match this job</span>
            <span className="sm:hidden">Paste target job description</span>
            <span>{jobDesc.length} chars</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="animate-fade-in mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 sm:mb-5 sm:px-4 sm:py-3 sm:text-sm">
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleImprove}
          disabled={loading || !resumeId || !jobDesc.trim()}
          className="group w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg disabled:hover:brightness-100 btn-shine sm:rounded-2xl sm:py-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Improving your resume...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Improve My Resume
            </span>
          )}
        </button>
      </div>

      {/* ===== RESULTS ===== */}
      {result && (
        <>
          {/* View Toggle - only show if full resume is available */}
          {result.full_resume_with_improvements && (
          <div className="animate-fade-in-up flex items-center justify-center">
            <div className="inline-flex items-center rounded-xl border border-white/60 bg-white/70 p-1 shadow-md backdrop-blur-sm">
              <button
                onClick={() => setActiveSection("highlights")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  activeSection === "highlights"
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Key Changes
              </button>
              <button
                onClick={() => setActiveSection("full")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  activeSection === "full"
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Full Resume
              </button>
            </div>
          </div>
          )}

          {/* ===== HIGHLIGHTS VIEW ===== */}
          {activeSection === "highlights" && (
            <>
              {/* Improved Summary */}
              <div className="animate-fade-in-up rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-teal-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8" style={{ animationFillMode: "both" }}>
                <div className="mb-4 flex items-center gap-2 sm:mb-5 sm:gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                    <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">Improved Summary</h3>
                </div>
                <p className="rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50/50 to-emerald-50/30 p-4 text-xs leading-relaxed text-slate-700 sm:rounded-2xl sm:p-5 sm:text-sm">
                  {result.improved_summary}
                </p>
              </div>

              {/* Improved Experience */}
              <div className="animate-fade-in-up delay-100 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-teal-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8" style={{ animationFillMode: "both" }}>
                <div className="mb-4 flex items-center gap-2 sm:mb-5 sm:gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                    <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">Improved Experience</h3>
                </div>
                <div className="space-y-5">
                  {result.improved_experience.map((exp, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-4 sm:rounded-2xl sm:p-5"
                      style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.12}s both` }}
                    >
                      {/* Title row */}
                      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 sm:text-base">{exp.title}</h4>
                          {(exp.company || exp.location) && (
                            <p className="text-xs text-slate-500">
                              {[exp.company, exp.location].filter(Boolean).join(" | ")}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex w-fit items-center rounded-lg bg-indigo-50 px-2.5 py-0.5 text-[10px] font-medium text-indigo-600 sm:text-xs">
                          {exp.dates}
                        </span>
                      </div>
                      {/* Bullets */}
                      <ul className="space-y-2">
                        {getBullets(exp).map((bp, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Added Skills */}
              {result.added_skills.length > 0 && (
                <div className="animate-fade-in-up delay-200 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-teal-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8" style={{ animationFillMode: "both" }}>
                  <div className="mb-4 flex items-center justify-center gap-2 sm:mb-5 sm:gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                      <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">Newly Added Skills</h3>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                    {result.added_skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
                        style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.08}s both` }}
                      >
                        <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== FULL RESUME VIEW ===== */}
          {activeSection === "full" && result.full_resume_with_improvements && (
            <div className="animate-fade-in-up rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-teal-500/5 backdrop-blur-sm sm:rounded-3xl sm:p-8" style={{ animationFillMode: "both" }}>
              {/* Header with copy */}
              <div className="mb-5 flex items-center justify-between sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                    <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">Full Improved Resume</h3>
                </div>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm ${
                    copied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      Copy All
                    </>
                  )}
                </button>
              </div>

              {/* Resume Content */}
              <div className="space-y-6">
                {/* Contact */}
                {(() => {
                  const c = result.full_resume_with_improvements.contact_info;
                  return (
                    <div className="rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-teal-50/20 p-4 text-center sm:rounded-2xl sm:p-5">
                      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{c.name}</h2>
                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        {c.phone} | {c.email} | {c.location}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        LinkedIn: {c.linkedin} | GitHub: {c.github}
                      </p>
                    </div>
                  );
                })()}

                {/* Summary */}
                <ResumeSection title="Summary" color="teal">
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {result.full_resume_with_improvements.summary}
                  </p>
                </ResumeSection>

                {/* Experience */}
                <ResumeSection title="Experience" color="blue">
                  <div className="space-y-4">
                    {result.full_resume_with_improvements.experience.map((exp, i) => (
                      <div key={i} className={i > 0 ? "border-t border-slate-100 pt-4" : ""}>
                        <div className="mb-2 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{exp.title}</p>
                            {(exp.company || exp.location) && (
                              <p className="text-xs text-slate-500">{[exp.company, exp.location].filter(Boolean).join(" | ")}</p>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 sm:text-xs">{exp.dates}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {getBullets(exp).map((bp, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                              {bp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ResumeSection>

                {/* Projects */}
                {result.full_resume_with_improvements.projects?.length > 0 && (
                  <ResumeSection title="Projects" color="purple">
                    <div className="space-y-4">
                      {result.full_resume_with_improvements.projects.map((proj, i) => (
                        <div key={i} className={i > 0 ? "border-t border-slate-100 pt-4" : ""}>
                          <div className="mb-2 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-semibold text-slate-900">{proj.title}</p>
                            <span className="text-[10px] font-medium text-slate-400 sm:text-xs">{proj.technologies} | {proj.dates}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {getBullets(proj).map((bp, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                                {bp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </ResumeSection>
                )}

                {/* Education */}
                <ResumeSection title="Education" color="amber">
                  <div className="space-y-4">
                    {result.full_resume_with_improvements.education.map((edu, i) => (
                      <div key={i} className={i > 0 ? "border-t border-slate-100 pt-4" : ""}>
                        <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-semibold text-slate-900">{edu.degree}</p>
                          <span className="text-[10px] font-medium text-slate-400 sm:text-xs">{edu.dates}</span>
                        </div>
                        <p className="text-xs text-slate-500">{edu.university} | {edu.location}</p>
                        {edu.details && <p className="mt-1 text-xs text-slate-400">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                </ResumeSection>

                {/* Skills */}
                <ResumeSection title="Skills" color="emerald">
                  <div className="space-y-3">
                    {normalizeSkills(result.full_resume_with_improvements.skills).map(([category, skillsStr]) => (
                      <div key={category}>
                        <p className="mb-1 text-xs font-semibold text-slate-700 sm:text-sm">{category}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsStr.split(", ").map((skill, i) => (
                            <span
                              key={i}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-medium sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-xs ${
                                result.added_skills.includes(skill)
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {result.added_skills.includes(skill) && (
                                <span className="mr-1 text-emerald-500">+</span>
                              )}
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ResumeSection>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* Section wrapper for the full resume view */
function ResumeSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    teal: "from-teal-500 to-emerald-500 shadow-teal-500/20",
    blue: "from-blue-500 to-indigo-500 shadow-blue-500/20",
    purple: "from-purple-500 to-violet-500 shadow-purple-500/20",
    amber: "from-amber-500 to-orange-500 shadow-amber-500/20",
    emerald: "from-emerald-500 to-green-500 shadow-emerald-500/20",
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[color]} shadow-lg sm:h-8 sm:w-8`}>
          <span className="text-[10px] font-bold text-white sm:text-xs">{title.charAt(0)}</span>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 sm:text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}
