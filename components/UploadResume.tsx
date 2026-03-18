"use client";

import { useState, useCallback, useRef } from "react";
import { getToken } from "@/utils/auth";

interface AnalysisResult {
  score: number;
  missingSkills: string[];
  suggestions: string[];
}

interface UploadResumeProps {
  onResult: (result: AnalysisResult) => void;
}

export default function UploadResume({ onResult }: UploadResumeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

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
        onResult({
          score: result.score,
          missingSkills: result.missing_skills,
          suggestions: result.suggestions,
        });
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
    <div className="w-full max-w-lg">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400"
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
            <p className="text-sm text-zinc-600">Analyzing {fileName}...</p>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto mb-3 h-10 w-10 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-medium text-zinc-700">
              Drop your resume here or click to browse
            </p>
            <p className="mt-1 text-xs text-zinc-500">PDF only, max 5MB</p>
          </>
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
        <p className="mt-3 text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
