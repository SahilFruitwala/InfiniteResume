import { v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

type ReadCtx = QueryCtx | MutationCtx;

type Identity = NonNullable<
  Awaited<ReturnType<QueryCtx["auth"]["getUserIdentity"]>>
>;

async function requireIdentity(ctx: ReadCtx): Promise<Identity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

async function findUserByClerkId(
  ctx: ReadCtx,
  clerkId: string,
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .first();
}

async function requireUser(ctx: ReadCtx): Promise<Doc<"users">> {
  const identity = await requireIdentity(ctx);
  const user = await findUserByClerkId(ctx, identity.subject);
  if (!user) throw new Error("User not found");
  return user;
}

// ── Save Analysis ────────────────────────────────────────────────────────────
export const save = mutation({
  args: {
    resumeId: v.id("resumes"),
    type: v.string(),
    jobTitle: v.optional(v.string()),
    jobCompany: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    resumeContentHash: v.string(),
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
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    // Verify resume ownership
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== user._id) {
      throw new Error("Not authorized");
    }

    // For standalone analysis, replace existing one
    if (args.type === "standalone") {
      const existing = await ctx.db
        .query("resumeAnalyses")
        .withIndex("by_resume_type", (q) =>
          q.eq("resumeId", args.resumeId).eq("type", "standalone"),
        )
        .first();
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    }

    return await ctx.db.insert("resumeAnalyses", {
      resumeId: args.resumeId,
      userId: user._id,
      type: args.type,
      jobTitle: args.jobTitle,
      jobCompany: args.jobCompany,
      jobDescription: args.jobDescription,
      resumeContentHash: args.resumeContentHash,
      isStale: false,
      overallScore: args.overallScore,
      scoreBreakdown: args.scoreBreakdown,
      matchScore: args.matchScore,
      strengths: args.strengths,
      improvements: args.improvements,
      missingKeywords: args.missingKeywords,
      matchedKeywords: args.matchedKeywords,
      aiSummary: args.aiSummary,
      createdAt: Date.now(),
    });
  },
});

// ── List Analyses for Resume ─────────────────────────────────────────────────
export const listByResume = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    // Verify resume ownership
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== user._id) {
      return [];
    }

    return await ctx.db
      .query("resumeAnalyses")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .order("desc")
      .collect();
  },
});

// ── Get Single Analysis ──────────────────────────────────────────────────────
export const get = query({
  args: { id: v.id("resumeAnalyses") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const analysis = await ctx.db.get(args.id);
    if (!analysis || analysis.userId !== user._id) {
      return null;
    }
    return analysis;
  },
});

// ── Delete Analysis ──────────────────────────────────────────────────────────
export const remove = mutation({
  args: { id: v.id("resumeAnalyses") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const analysis = await ctx.db.get(args.id);
    if (!analysis || analysis.userId !== user._id) {
      throw new Error("Not authorized");
    }
    await ctx.db.delete(args.id);
  },
});

// ── Mark All Analyses Stale for a Resume ─────────────────────────────────────
export const markStale = internalMutation({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const analyses = await ctx.db
      .query("resumeAnalyses")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .collect();

    for (const analysis of analyses) {
      if (!analysis.isStale) {
        await ctx.db.patch(analysis._id, { isStale: true });
      }
    }
  },
});
