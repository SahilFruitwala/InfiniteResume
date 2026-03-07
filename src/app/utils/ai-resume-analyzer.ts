import { ResumeExtractionSettings } from "./resume-extraction-settings";

export interface AIAnalysisResult {
  overallScore: number;
  scoreBreakdown: {
    content: number;
    format: number;
    impact: number;
    keywords: number;
  };
  matchScore?: number;
  jobTitle?: string;
  jobCompany?: string;
  strengths: string[];
  improvements: string[];
  missingKeywords?: string[];
  matchedKeywords?: string[];
  aiSummary: string;
}

type AnalysisSuccess = {
  success: true;
  data: AIAnalysisResult;
};

type AnalysisFailure = {
  success: false;
  error: string;
};

type AnalysisResponse = AnalysisSuccess | AnalysisFailure;

const MODEL = "gemini-2.5-flash";
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/, "")
      .trim();
  }
  return trimmed;
}

function buildPrompt(resumeText: string, jobDescription?: string): string {
  const base = `You are an expert resume analyst and career coach. Analyze the following resume and provide a detailed assessment.

RESUME:
---
${resumeText}
---`;

  const jdSection = jobDescription
    ? `

JOB DESCRIPTION:
---
${jobDescription}
---

Also analyze how well this resume matches the job description. Extract the job title and company name from the JD.`
    : "";

  return `${base}${jdSection}

Return ONLY valid JSON (no markdown fences) matching this exact structure:
{
  "overallScore": <number 0-100, holistic quality score>,
  "scoreBreakdown": {
    "content": <number 0-25, quality of experience descriptions, achievements, specificity>,
    "format": <number 0-25, structure, readability, section completeness>,
    "impact": <number 0-25, use of metrics, action verbs, quantified results>,
    "keywords": <number 0-25, relevant industry terms, technical skills, ATS-friendliness>
  },${
    jobDescription
      ? `
  "matchScore": <number 0-100, how well resume matches the JD>,
  "jobTitle": "<extracted job title from JD>",
  "jobCompany": "<extracted company name from JD, or empty string if not found>",
  "missingKeywords": ["<important keywords from JD missing in resume, max 10>"],
  "matchedKeywords": ["<keywords from JD found in resume, max 10>"],`
      : ""
  }
  "strengths": ["<3-5 specific strengths of this resume>"],
  "improvements": ["<3-5 specific, actionable improvement suggestions>"],
  "aiSummary": "<2-3 sentence executive summary of the resume quality${jobDescription ? " and job fit" : ""}>"
}

Rules:
- Be specific and actionable in suggestions — reference actual content from the resume.
- Scores should reflect real quality, not just length or keyword density.
- overallScore should be the weighted combination of the breakdown scores.
- No markdown fences. JSON only.`;
}

export async function analyzeResumeWithAI(
  resumeText: string,
  settings: ResumeExtractionSettings,
  jobDescription?: string,
): Promise<AnalysisResponse> {
  const isGoogle = settings.provider === "google";
  const activeApiKey = isGoogle
    ? settings.googleApiKey?.trim()
    : settings.openrouterApiKey?.trim();

  if (!activeApiKey) {
    return {
      success: false,
      error: "Add your API key in Settings to use AI analysis.",
    };
  }

  try {
    const prompt = buildPrompt(resumeText, jobDescription);

    const response = isGoogle
      ? await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
          {
            method: "POST",
            referrerPolicy: "no-referrer",
            headers: {
              "x-goog-api-key": activeApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              ],
            }),
          },
        )
      : await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          referrerPolicy: "no-referrer",
          headers: {
            Authorization: `Bearer ${activeApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: errText || "AI analysis failed",
      };
    }

    const payload = await response.json();
    const rawOpenRouterContent = payload?.choices?.[0]?.message?.content;
    const text = isGoogle
      ? payload?.candidates?.[0]?.content?.parts?.[0]?.text
      : typeof rawOpenRouterContent === "string"
        ? rawOpenRouterContent
        : Array.isArray(rawOpenRouterContent)
          ? rawOpenRouterContent
              .map((part: any) =>
                typeof part?.text === "string" ? part.text : "",
              )
              .join("\n")
          : undefined;

    if (typeof text !== "string" || text.trim().length === 0) {
      return {
        success: false,
        error: "AI model did not return analysis data.",
      };
    }

    const parsed: AIAnalysisResult = JSON.parse(extractJson(text));

    // Validate required fields
    if (
      typeof parsed.overallScore !== "number" ||
      !parsed.scoreBreakdown ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.improvements) ||
      typeof parsed.aiSummary !== "string"
    ) {
      return {
        success: false,
        error: "AI returned an invalid analysis structure.",
      };
    }

    return { success: true, data: parsed };
  } catch (error: any) {
    if (
      /invalid api key|api key not valid|unauthorized|permission/i.test(
        error?.message || "",
      )
    ) {
      return {
        success: false,
        error: "Invalid API key. Update your key in Settings and try again.",
      };
    }
    if (/quota|rate limit|429/i.test(error?.message || "")) {
      return {
        success: false,
        error: "API quota exceeded or rate-limited. Try again later.",
      };
    }
    return {
      success: false,
      error: error?.message || "AI analysis failed",
    };
  }
}
