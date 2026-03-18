import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface AnalysisResult {
  score: number;
  missing_skills: string[];
  suggestions: string[];
}

export async function analyzeResume(resumeText: string): Promise<AnalysisResult> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze the following resume and return:

1. ATS Score (0-100)
2. Top 5 missing skills
3. 5 actionable improvement suggestions

Return response ONLY as valid JSON with this exact format, no other text:
{
  "score": <number>,
  "missing_skills": ["skill1", "skill2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...]
}

Resume:
${resumeText}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from AI");
  }

  const parsed = JSON.parse(content.text);
  return {
    score: parsed.score,
    missing_skills: parsed.missing_skills,
    suggestions: parsed.suggestions,
  };
}
