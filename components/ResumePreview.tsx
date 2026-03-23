"use client";

interface ResumePreviewProps {
  text: string;
  variant?: "original" | "optimized";
  /** When true, outer box grows with parent; parent should own scrolling (e.g. full-screen modal). */
  fillParent?: boolean;
}

interface ParsedSection {
  heading: string;
  lines: string[];
}

interface ResumeData {
  name: string;
  contactLines: string[];
  sections: ParsedSection[];
}

// Detect if a line is contact info (phone, email, url, address-like)
function isContactInfo(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Phone numbers
  if (/^[\+]?\d[\d\s\-\(\)\.]{6,}$/.test(trimmed)) return true;
  if (/(\+?\d{1,3}[\s\-]?)?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}/.test(trimmed) && trimmed.length < 25) return true;
  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;
  // URL / LinkedIn / GitHub
  if (/^(https?:\/\/|www\.|linkedin|github)/i.test(trimmed)) return true;
  // Short address-like lines (city, state pattern)
  if (/^[A-Z][a-z]+,\s*[A-Z][a-z]/.test(trimmed) && trimmed.length < 50) return true;
  // Lines with multiple contact items separated by | or ,
  if (trimmed.includes("@") || /\b\d{10}\b/.test(trimmed.replace(/[\s\-\+\(\)]/g, ""))) return true;
  return false;
}

// Detect if a line is a person's name (not a phone number, not a heading, not contact info)
function isLikelyName(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 60) return false;
  // Must have alphabetic characters
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  // Should not be a phone number
  if (/^[\+]?\d[\d\s\-\(\)\.]{6,}$/.test(trimmed)) return false;
  // Should not be an email
  if (/@/.test(trimmed)) return false;
  // Should not be a URL
  if (/^(https?|www\.)/i.test(trimmed)) return false;
  // Typically 1-4 words, all starting with capital letters
  const words = trimmed.split(/\s+/);
  if (words.length >= 1 && words.length <= 5) {
    const capitalized = words.filter((w) => /^[A-Z]/.test(w) || w === w.toUpperCase());
    if (capitalized.length >= words.length * 0.5) return true;
  }
  return false;
}

function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed === "" || trimmed.length > 80) return false;

  const headingKeywords = [
    "education", "experience", "work experience", "professional experience",
    "skills", "technical skills", "core competencies", "projects",
    "certifications", "certificates", "summary", "professional summary",
    "objective", "career objective", "profile", "professional profile",
    "achievements", "awards", "publications", "references", "languages",
    "interests", "activities", "volunteer", "training", "contact",
    "personal information", "personal details", "additional information",
    "extracurricular", "hobbies", "coursework", "relevant coursework",
  ];

  const normalized = trimmed.toLowerCase().replace(/[:\-_#*]/g, "").trim();
  if (headingKeywords.some((k) => normalized === k)) return true;

  // ALL CAPS with at least 3 alpha chars, no digits (avoids phone numbers)
  if (
    trimmed.length < 50 &&
    trimmed === trimmed.toUpperCase() &&
    (trimmed.match(/[A-Z]/g) || []).length >= 3 &&
    !/\d/.test(trimmed)
  ) return true;

  // Ending with colon
  if (trimmed.endsWith(":") && trimmed.length < 40 && !/\d{3}/.test(trimmed)) return true;

  return false;
}

function formatHeading(text: string): string {
  const cleaned = text.replace(/[:\-_#*]/g, "").trim();
  return cleaned
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseResumeText(text: string): ResumeData {
  const rawLines = text.split("\n");
  const lines = rawLines.map((l) => l.trimEnd());

  let name = "";
  const contactLines: string[] = [];
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  // Scan first ~10 non-empty lines for header info
  let headerEndIdx = 0;
  let foundFirstHeading = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === "") {
      // After we found name + some contact, an empty line might end the header
      if (name && contactLines.length > 0) {
        headerEndIdx = i;
        break;
      }
      continue;
    }

    if (isHeading(trimmed)) {
      foundFirstHeading = true;
      headerEndIdx = i;
      break;
    }

    if (!name && isLikelyName(trimmed)) {
      name = trimmed;
      continue;
    }

    if (isContactInfo(trimmed)) {
      contactLines.push(trimmed);
      continue;
    }

    // If we already have a name but this isn't contact or heading, it could be
    // a title/tagline or contact continuation
    if (name && trimmed.length < 80) {
      contactLines.push(trimmed);
      continue;
    }

    // If nothing matches and we haven't found a name yet,
    // treat it as name anyway if it's the first line
    if (!name) {
      name = trimmed;
      continue;
    }

    // We've gone too far without finding structure, stop header parsing
    headerEndIdx = i;
    break;
  }

  if (!foundFirstHeading && headerEndIdx === 0) {
    headerEndIdx = 0;
  }

  // Now parse from headerEndIdx onward for sections
  for (let i = headerEndIdx; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (isHeading(trimmed)) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: formatHeading(trimmed), lines: [] };
      continue;
    }

    if (currentSection) {
      currentSection.lines.push(lines[i]);
    }
  }

  if (currentSection) sections.push(currentSection);

  return { name, contactLines, sections };
}

function renderLine(line: string, idx: number, ats: boolean) {
  const trimmed = line.trim();

  if (trimmed === "") {
    return <div key={idx} className={ats ? "h-2" : "h-2.5"} />;
  }

  if (/^[\u2022\u2023\u25E6\u2043\u2219•\-\*]\s/.test(trimmed)) {
    const bulletText = trimmed.replace(/^[\u2022\u2023\u25E6\u2043\u2219•\-\*]\s*/, "");
    if (ats) {
      return (
        <div key={idx} className="flex gap-2 py-0.5">
          <span className="w-3 shrink-0 text-[13px] text-neutral-900">-</span>
          <span className="text-[13px] leading-[1.65] text-neutral-800">{bulletText}</span>
        </div>
      );
    }
    return (
      <div key={idx} className="flex gap-2.5 py-[2px] pl-2">
        <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-slate-400/70" />
        <span className="text-[12.5px] leading-[1.7] text-slate-600">{bulletText}</span>
      </div>
    );
  }

  const pipeCount = (trimmed.match(/\|/g) || []).length;
  if (pipeCount >= 1 && trimmed.length < 120) {
    const parts = trimmed.split(/\s*\|\s*/);
    if (ats) {
      return (
        <div key={idx} className="space-y-0.5 pt-2.5 text-[13px] leading-snug text-neutral-800">
          <p className="font-semibold text-neutral-900">{parts[0]}</p>
          {parts[1] && <p className="text-neutral-800">{parts[1]}</p>}
          {parts.length > 2 && <p className="text-neutral-700">{parts.slice(2).join(" | ")}</p>}
        </div>
      );
    }
    return (
      <div key={idx} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 pt-3 pb-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[13px] font-semibold text-slate-800">{parts[0]}</span>
          {parts[1] && <span className="text-[12px] text-slate-500">{parts[1]}</span>}
        </div>
        {parts.length > 2 && (
          <span className="text-[11px] font-medium text-slate-400 tabular-nums">{parts.slice(2).join("  |  ")}</span>
        )}
      </div>
    );
  }

  const hasDates = /\b(19|20)\d{2}\b/.test(trimmed) || /present|current/i.test(trimmed);
  if (hasDates && trimmed.length < 60 && !trimmed.includes(".")) {
    if (ats) {
      return (
        <p key={idx} className="pt-2 text-[13px] font-semibold text-neutral-900">
          {trimmed}
        </p>
      );
    }
    return (
      <div key={idx} className="flex items-baseline justify-between gap-2 pt-2.5 pb-0.5">
        <span className="text-[13px] font-semibold text-slate-800">{trimmed}</span>
      </div>
    );
  }

  if (ats) {
    return (
      <p key={idx} className="py-0.5 text-[13px] leading-[1.65] text-neutral-800">
        {trimmed}
      </p>
    );
  }

  return (
    <p key={idx} className="text-[12.5px] leading-[1.7] text-slate-600 py-[1px]">
      {trimmed}
    </p>
  );
}

export default function ResumePreview({ text, variant = "original", fillParent }: ResumePreviewProps) {
  const { name, contactLines, sections } = parseResumeText(text);

  const isOpt = variant === "optimized";
  const ats = isOpt;
  const accentGradient = isOpt ? "from-amber-500 to-orange-500" : "from-indigo-600 to-purple-600";
  const headingColor = isOpt ? "text-amber-700" : "text-indigo-700";
  const headingBorderColor = isOpt ? "bg-amber-300/40" : "bg-indigo-300/40";
  const accentBg = isOpt ? "bg-amber-500" : "bg-indigo-500";

  const shellClass = fillParent
    ? "h-full min-h-0 max-h-none overflow-visible"
    : "max-h-[600px] overflow-y-auto";

  const outer = ats
    ? `resume-preview rounded-sm border border-neutral-300 bg-white ${shellClass}`
    : `resume-preview rounded-lg border border-slate-200/60 bg-white ${shellClass}`;

  const inner = ats
    ? "relative mx-auto max-w-[640px] px-8 py-9 sm:px-12 sm:py-10"
    : "relative mx-auto max-w-[560px] px-7 py-8 sm:px-10 sm:py-10";

  return (
    <div className={outer}>
      <div className={inner}>
        {!ats && (
          <div className={`absolute left-0 top-8 bottom-8 w-[3px] rounded-full ${accentBg} opacity-20`} />
        )}

        {name && (
          <div className={ats ? "mb-6 border-b border-neutral-800 pb-3" : "mb-5 pb-4 border-b-2 border-slate-100"}>
            <h1
              className={
                ats
                  ? "text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl"
                  : "text-[22px] font-bold tracking-wide text-slate-900 sm:text-[26px]"
              }
            >
              {name}
            </h1>
            {contactLines.length > 0 && (
              ats ? (
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-800">
                  {contactLines.join(" | ")}
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {contactLines.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] text-slate-500 sm:text-[11.5px]">
                      {i > 0 && <span className={`mr-1 inline-block h-[3px] w-[3px] rounded-full ${accentBg} opacity-40`} />}
                      {c}
                    </span>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {sections.map((section, sIdx) =>
          ats ? (
            <section key={sIdx} className={sIdx === 0 ? "" : "mt-7"}>
              <h2 className="border-b border-neutral-500 pb-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-950">
                {section.heading}
              </h2>
              <div className="mt-2.5">
                {section.lines.map((line, lIdx) => renderLine(line, lIdx, true))}
              </div>
            </section>
          ) : (
            <div key={sIdx} className={sIdx === 0 ? "" : "mt-5"}>
              <div className="mb-2 flex items-center gap-2.5">
                <div className={`h-[3px] w-4 rounded-full bg-gradient-to-r ${accentGradient}`} />
                <h2 className={`text-[11px] font-bold uppercase tracking-[0.18em] ${headingColor}`}>
                  {section.heading}
                </h2>
                <div className={`h-[1px] flex-1 ${headingBorderColor} rounded-full`} />
              </div>
              <div className="pl-1">
                {section.lines.map((line, lIdx) => renderLine(line, lIdx, false))}
              </div>
            </div>
          )
        )}

        {sections.length === 0 && !name && (
          <div
            className={
              ats
                ? "whitespace-pre-wrap text-[13px] leading-[1.65] text-neutral-800"
                : "text-[12.5px] leading-[1.75] text-slate-600 whitespace-pre-wrap"
            }
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
}
