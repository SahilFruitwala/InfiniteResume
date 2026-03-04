import { resumeSchema } from "@/app/lib/schemas";
import { ResumeExtractionSettings } from "./resume-extraction-settings";

type ParseSuccess = {
  success: true;
  data: ReturnType<typeof resumeSchema.parse>;
};

type ParseFailure = {
  success: false;
  error: string;
};

type ParseResult = ParseSuccess | ParseFailure;

const MODEL = "gemini-2.5-flash";
const OPENROUTER_MODEL = "google/gemini-2.0-flash-001";

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  }
  return trimmed;
}

export async function parseResumeInBrowser(
  pdfBytes: Uint8Array,
  settings: ResumeExtractionSettings,
): Promise<ParseResult> {
  const isGoogle = settings.provider === "google";
  const activeApiKey = isGoogle
    ? settings.googleApiKey?.trim()
    : settings.openrouterApiKey?.trim();

  if (!activeApiKey) {
    return {
      success: false,
      error: "Add your API key in Settings to use AI resume extraction.",
    };
  }

  try {
    const prompt = `Extract information from this resume PDF and return ONLY valid JSON matching this exact structure:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "website": "", "summary": "" },
  "experience": [{ "id": "1", "company": "", "position": "", "startDate": "", "endDate": "", "description": "<ul><li>...</li></ul>" }],
  "education": [{ "id": "1", "institution": "", "degree": "", "startDate": "", "endDate": "" }],
  "skills": [{ "id": "1", "name": "", "skills": "" }],
  "projects": [{ "id": "1", "name": "", "description": "", "link": "" }],
  "awards": [{ "id": "1", "name": "", "issuer": "", "date": "", "description": "" }],
  "languages": [{ "id": "1", "name": "", "proficiency": "" }]
}
Rules:
- If information is missing, use empty string or empty array.
- Use only <ul> and <li> tags in experience.description.
- Generate unique string IDs in arrays.
- No markdown code fences. JSON only.`;

    const base64Pdf = toBase64(pdfBytes);
    const response = isGoogle
      ? await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(activeApiKey)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: "application/pdf",
                        data: base64Pdf,
                      },
                    },
                  ],
                },
              ],
            }),
          },
        )
      : await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${activeApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: prompt,
                  },
                  {
                    type: "file",
                    filename: "resume.pdf",
                    file_data: `data:application/pdf;base64,${base64Pdf}`,
                  },
                ],
              },
            ],
          }),
        });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: errText || "Failed to parse resume",
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
        error: "Model did not return structured resume data.",
      };
    }

    const parsedJson = JSON.parse(extractJson(text));
    const validated = resumeSchema.safeParse(parsedJson);
    if (!validated.success) {
      return {
        success: false,
        error: "Failed to validate extracted resume structure.",
      };
    }

    return { success: true, data: validated.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to parse resume",
    };
  }
}
