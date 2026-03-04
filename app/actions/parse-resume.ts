"use server";

import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { resumeSchema } from "@/app/lib/schemas";
import { sanitizeRichText } from "@/app/utils/security";

function sanitizeParsedResumePayload(payload: any): any {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  if (payload.personalInfo && typeof payload.personalInfo === "object") {
    payload.personalInfo.summary = sanitizeRichText(payload.personalInfo.summary);
  }

  if (Array.isArray(payload.experience)) {
    payload.experience = payload.experience.map((item: any) => ({
      ...item,
      description: sanitizeRichText(item?.description),
    }));
  }

  if (Array.isArray(payload.projects)) {
    payload.projects = payload.projects.map((item: any) => ({
      ...item,
      description: sanitizeRichText(item?.description),
    }));
  }

  if (Array.isArray(payload.awards)) {
    payload.awards = payload.awards.map((item: any) => ({
      ...item,
      description: sanitizeRichText(item?.description),
    }));
  }

  if (Array.isArray(payload.skills)) {
    payload.skills = payload.skills.map((item: any) => ({
      ...item,
      skills: sanitizeRichText(item?.skills),
    }));
  }

  return payload;
}

export async function parseResumeAction(pdfBytes: Uint8Array) {
  // Builder import now uses browser-only BYOK parsing.
  // This server action is kept for compatibility with any non-BYOK callers.
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
  }

  try {
    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({
        schema: resumeSchema,
      }),
      system: `You are an expert resume parser. Extract information from the provided resume PDF into a structured JSON format. 
      - If certain information is missing, use an empty string or empty array as appropriate.
      - Ensure 'description' fields for experience are formatted as safe HTML (only <ul> and <li> tags).
      - Generate unique string IDs (like "1", "2", "3") for each item in arrays.
      - Be accurate and professional in your extraction.`,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract information from this resume." },
            {
              type: "file",
              data: pdfBytes,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
    });

    return { success: true, data: sanitizeParsedResumePayload(output) };
  } catch (error: any) {
    console.error("Error parsing resume:", error);
    return { success: false, error: error.message || "Failed to parse resume" };
  }
}
