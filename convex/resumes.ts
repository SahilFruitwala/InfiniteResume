import { v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
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

async function requireUserForMutation(ctx: MutationCtx): Promise<Doc<"users">> {
  const identity = await requireIdentity(ctx);
  const clerkId = identity.subject;

  const existingUser = await findUserByClerkId(ctx, clerkId);
  if (existingUser) {
    return existingUser;
  }

  const fullName =
    identity.name ||
    [identity.givenName, identity.familyName].filter(Boolean).join(" ") ||
    undefined;

  const userId = await ctx.db.insert("users", {
    clerkId,
    email: identity.email ?? "",
    name: fullName,
    avatarUrl: identity.pictureUrl,
    plan: "free",
    createdAt: Date.now(),
  });

  const createdUser = await ctx.db.get(userId);
  if (!createdUser) {
    throw new Error("Failed to create user");
  }

  return createdUser;
}

async function findUserForQuery(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await requireIdentity(ctx);
  return await findUserByClerkId(ctx, identity.subject);
}

async function getOwnedResume(
  ctx: ReadCtx,
  resumeId: Id<"resumes">,
  userId: Id<"users">,
): Promise<Doc<"resumes"> | null> {
  const resume = await ctx.db.get(resumeId);

  if (!resume) {
    return null;
  }

  if (resume.userId !== userId) {
    throw new Error("Not authorized");
  }

  return resume;
}

/** Fast djb2 hash for content change detection — not cryptographic, just diffing */
function computeContentHash(content: any): string {
  // Only hash resume content fields, not design fields (typography/spacing/theme)
  const { typography, spacing, theme, layout, ...contentFields } = content;
  const str = JSON.stringify(contentFields);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
}

export const save = mutation({
  args: {
    id: v.optional(v.id("resumes")),
    title: v.string(),
    template: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await requireUserForMutation(ctx);
    const newHash = computeContentHash(args.content);

    if (args.id) {
      const existingResume = await getOwnedResume(ctx, args.id, user._id);
      if (!existingResume) {
        throw new Error("Not authorized");
      }

      // Check if content actually changed (ignore design-only changes)
      // Fallback: compute hash from existing content if no stored hash yet
      const oldHash =
        existingResume.contentHash ??
        computeContentHash(existingResume.content);
      const contentChanged = oldHash !== newHash;

      await ctx.db.patch(args.id, {
        title: args.title,
        template: args.template,
        content: args.content,
        contentHash: newHash,
        updatedAt: now,
      });

      // Mark all analyses stale if content changed
      if (contentChanged) {
        await ctx.runMutation(internal.analyses.markStale, {
          resumeId: args.id,
        });
      }

      return args.id;
    }

    return await ctx.db.insert("resumes", {
      userId: user._id,
      title: args.title,
      template: args.template,
      content: args.content,
      contentHash: newHash,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await findUserForQuery(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    const user = await findUserForQuery(ctx);
    if (!user) {
      return null;
    }

    return await getOwnedResume(ctx, args.id, user._id);
  },
});

export const remove = mutation({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    const user = await requireUserForMutation(ctx);
    const resume = await getOwnedResume(ctx, args.id, user._id);

    if (!resume) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const rename = mutation({
  args: {
    id: v.id("resumes"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUserForMutation(ctx);
    const resume = await getOwnedResume(ctx, args.id, user._id);

    if (!resume) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const duplicate = mutation({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    const user = await requireUserForMutation(ctx);
    const resume = await getOwnedResume(ctx, args.id, user._id);

    if (!resume) {
      throw new Error("Not authorized");
    }

    const now = Date.now();
    return await ctx.db.insert("resumes", {
      userId: user._id,
      title: `Copy of ${resume.title}`,
      template: resume.template,
      content: resume.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});
