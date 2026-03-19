"use client";

import { useState, useCallback, useRef } from "react";
import { getToken } from "@/utils/auth";

interface AnalysisResult {
  score: number;
  missingSkills: string[];
  suggestions: string[];
}

interface UploadResumeProps {
  onResult: (result: AnalysisResult, resumeId: number) => void;
}

export default function UploadResume({ onResult }: UploadResumeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploadSuccess(false);

      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be under 5MB.");
        return;
      }

      setFileName(file.name);
      setIsLoading(true);

      try {
        const token = getToken();

        // Step 1: Upload file
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("http://127.0.0.1:8000/api/upload/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || data.detail || "Upload failed");
        }

        const uploadData = await uploadRes.json();

        // Step 2: Analyze the uploaded resume
        const analyzeRes = await fetch("http://127.0.0.1:8000/api/analyze/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resume_id: uploadData.resume_id }),
        });

        if (!analyzeRes.ok) {
          const data = await analyzeRes.json();
          throw new Error(data.error || data.detail || "Analysis failed");
        }

        const result = await analyzeRes.json();
        setUploadSuccess(true);
        onResult({
          score: result.score,
          missingSkills: result.missing_skills,
          suggestions: result.suggestions,
        }, uploadData.resume_id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [onResult]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-14 text-center transition-all duration-300 ${
          isDragging
            ? "border-indigo-400 bg-indigo-50/80 shadow-xl shadow-indigo-500/10"
            : uploadSuccess
              ? "border-emerald-300 bg-emerald-50/50 hover:border-emerald-400"
              : "border-slate-200 bg-white/60 shadow-lg shadow-indigo-500/5 backdrop-blur-sm hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-xl hover:shadow-indigo-500/10"
        }`}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500" />
        </div>

        {isLoading ? (
          <div className="relative flex flex-col items-center gap-4">
            {/* Animated loader */}
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-3 border-indigo-100" />
              <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-3 border-transparent border-t-indigo-500" style={{ animationDuration: '1s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-700">Analyzing your resume...</p>
              <p className="mt-1 text-xs text-indigo-500/70">{fileName}</p>
            </div>
            {/* Progress bar shimmer */}
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full w-full animate-shimmer rounded-full bg-gradient-to-r from-indigo-200 via-indigo-500 to-indigo-200" style={{ backgroundSize: '200% 100%' }} />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
              uploadSuccess
                ? "bg-emerald-100"
                : "bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:scale-110"
            }`}>
              {uploadSuccess ? (
                <svg className="h-10 w-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-10 w-10 text-indigo-400 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              )}
            </div>
            <p className="text-base font-semibold text-slate-700">
              {uploadSuccess
                ? "Upload another resume"
                : "Drop your resume here or click to browse"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              PDF only, max 5MB
            </p>
            {!uploadSuccess && (
              <div className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-600 transition-colors group-hover:bg-indigo-100">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Choose File
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <div className="animate-fade-in mt-4 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
