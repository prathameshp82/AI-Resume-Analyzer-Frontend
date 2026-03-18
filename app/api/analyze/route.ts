import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { analyzeResume } from "@/lib/ai";
import { extractTextFromPdf } from "@/utils/parsePdf";
import { Resume } from "@/models/Resume";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await extractTextFromPdf(buffer);

    if (!resumeText.trim()) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // Analyze with AI
    const analysis = await analyzeResume(resumeText);

    // Save to database
    await connectDB();
    const resume = await Resume.create({
      userId: session.user.email,
      score: analysis.score,
      missingSkills: analysis.missing_skills,
      suggestions: analysis.suggestions,
    });

    return NextResponse.json({
      id: resume._id,
      score: analysis.score,
      missingSkills: analysis.missing_skills,
      suggestions: analysis.suggestions,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try again." },
      { status: 500 }
    );
  }
}
