import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    plan: v.string(), // "free" | "pro"
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    template: v.string(), // "minimal" | "professional" | "modern" | "academic" | "creative"
    content: v.object({
      personalInfo: v.object({
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
        location: v.string(),
        website: v.string(),
        summary: v.string(),
        profilePicture: v.optional(v.string()),
      }),
      experience: v.array(
        v.object({
          id: v.string(),
          company: v.string(),
          position: v.string(),
          startDate: v.string(),
          endDate: v.string(),
          description: v.string(),
        }),
      ),
      education: v.array(
        v.object({
          id: v.string(),
          institution: v.string(),
          degree: v.string(),
          startDate: v.string(),
          endDate: v.string(),
        }),
      ),
      skills: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          skills: v.string(),
        }),
      ),
      projects: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          description: v.string(),
          link: v.string(),
        }),
      ),
      awards: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          issuer: v.string(),
          date: v.string(),
          description: v.string(),
        }),
      ),
      languages: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          proficiency: v.string(),
        }),
      ),
      volunteerWork: v.array(
        v.object({
          id: v.string(),
          organization: v.string(),
          position: v.string(),
          startDate: v.string(),
          endDate: v.string(),
          description: v.string(),
        }),
      ),
      interests: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
        }),
      ),
      socialLinks: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          url: v.string(),
        }),
      ),
      customSections: v.optional(
        v.array(
          v.object({
            id: v.string(),
            title: v.string(),
            items: v.array(
              v.object({
                id: v.string(),
                title: v.string(),
                subtitle: v.optional(v.string()),
                startDate: v.optional(v.string()),
                endDate: v.optional(v.string()),
                description: v.optional(v.string()),
                location: v.optional(v.string()),
              }),
            ),
          }),
        ),
      ),
      typography: v.object({
        fontFamily: v.string(),
        fontSizeBody: v.number(),
        fontSizeHeading: v.number(),
        fontSizeSectionHeading: v.number(),
        fontSizeItemHeading: v.optional(v.number()),
      }),
      spacing: v.object({
        sectionGap: v.number(),
        sectionTitleGap: v.number(),
        itemGap: v.number(),
        pageMarginTop: v.number(),
        pageMarginBottom: v.number(),
        bulletItemGap: v.optional(v.number()),
        bulletListMargin: v.optional(v.number()),
        pageSize: v.optional(v.string()),
      }),
      theme: v.object({
        accentColor: v.string(),
        previewTheme: v.optional(v.string()),
        professional: v.optional(
          v.object({
            sectionBorderColor: v.optional(v.string()),
          }),
        ),
        modern: v.optional(
          v.object({
            accentColor: v.optional(v.string()),
          }),
        ),
        minimal: v.optional(
          v.object({
            accentColor: v.optional(v.string()),
          }),
        ),
        academic: v.optional(
          v.object({
            accentColor: v.optional(v.string()),
          }),
        ),
        creative: v.optional(
          v.object({
            accentColor: v.optional(v.string()),
          }),
        ),
      }),
      layout: v.optional(
        v.object({
          sectionOrder: v.array(v.string()),
        }),
      ),
    }),
    isPublic: v.optional(v.boolean()),
    contentHash: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  exportHistory: defineTable({
    resumeId: v.id("resumes"),
    userId: v.id("users"),
    format: v.string(),
    fileUrl: v.string(),
    exportedAt: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_user", ["userId"]),

  resumeAnalyses: defineTable({
    resumeId: v.id("resumes"),
    userId: v.id("users"),
    type: v.string(), // "standalone" | "jd_match"
    jobTitle: v.optional(v.string()),
    jobCompany: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    resumeContentHash: v.string(),
    isStale: v.boolean(),
    overallScore: v.number(),
    scoreBreakdown: v.object({
      content: v.number(),
      format: v.number(),
      impact: v.number(),
      keywords: v.number(),
    }),
    matchScore: v.optional(v.number()),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    missingKeywords: v.optional(v.array(v.string())),
    matchedKeywords: v.optional(v.array(v.string())),
    aiSummary: v.string(),
    createdAt: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_resume_type", ["resumeId", "type"])
    .index("by_user", ["userId"]),
});
