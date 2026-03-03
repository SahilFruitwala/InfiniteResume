import { z } from "zod";

export const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().describe("Full name of the person"),
    email: z.string().email().describe("Email address"),
    phone: z.string().describe("Phone number"),
    location: z.string().describe("City and State/Country"),
    website: z
      .string()
      .describe("LinkedIn, personal website, or GitHub profile link"),
    summary: z.string().describe("A brief professional summary or objective"),
  }),
  experience: z
    .array(
      z.object({
        id: z.string(),
        company: z.string().describe("Name of the company"),
        position: z.string().describe("Job title"),
        startDate: z.string().describe("Starting date (e.g., Jan 2020)"),
        endDate: z.string().describe("End date or 'Present'"),
        description: z
          .string()
          .describe(
            "Work achievements and responsibilities in HTML format (use <ul> and <li> tags)",
          ),
      }),
    )
    .describe("List of professional work experiences"),
  education: z
    .array(
      z.object({
        id: z.string(),
        institution: z.string().describe("Name of the school or university"),
        degree: z.string().describe("Degree or certification obtained"),
        startDate: z.string().describe("Start date"),
        endDate: z.string().describe("Graduation date"),
      }),
    )
    .describe("List of educational background"),
  skills: z
    .array(
      z.object({
        id: z.string(),
        name: z
          .string()
          .describe("Skill category name (e.g., Languages, Frameworks, Tools)"),
        skills: z
          .string()
          .describe("Comma-separated list of skills in this category"),
      }),
    )
    .describe("List of skill categories and skills"),
  projects: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().describe("Project name"),
        description: z.string().describe("Brief description of the project"),
        link: z.string().describe("Link to the project or repository"),
      }),
    )
    .optional(),
  awards: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().describe("Award or recognition title"),
        issuer: z.string().describe("Organization that issued the award"),
        date: z.string().describe("Date received"),
        description: z.string().describe("Brief description of the award"),
      }),
    )
    .optional(),
  languages: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().describe("Language name"),
        proficiency: z
          .string()
          .describe("Proficiency level (e.g., Native, Fluent, Intermediate)"),
      }),
    )
    .optional(),
});

export type ResumeSchemaType = z.infer<typeof resumeSchema>;
