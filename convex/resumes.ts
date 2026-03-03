import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// --- Dummy user bootstrap ---
// Creates a dummy user if one doesn't exist yet.
// Called automatically on first resume save.
const DUMMY_CLERK_ID = "dummy_user_1";

export const ensureDummyUser = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", DUMMY_CLERK_ID))
      .first();

    if (existing) return existing._id;

    const id = await ctx.db.insert("users", {
      clerkId: DUMMY_CLERK_ID,
      email: "demo@infiniteresume.app",
      name: "Demo User",
      plan: "free",
      createdAt: Date.now(),
    });
    return id;
  },
});

// --- Resume CRUD ---

export const save = mutation({
  args: {
    id: v.optional(v.id("resumes")),
    title: v.string(),
    template: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get or create dummy user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", DUMMY_CLERK_ID))
      .first();

    let userId = user?._id;

    if (!userId) {
      userId = await ctx.db.insert("users", {
        clerkId: DUMMY_CLERK_ID,
        email: "demo@infiniteresume.app",
        name: "Demo User",
        plan: "free",
        createdAt: now,
      });
    }

    if (args.id) {
      await ctx.db.patch(args.id, {
        title: args.title,
        template: args.template,
        content: args.content,
        updatedAt: now,
      });
      return args.id;
    } else {
      const id = await ctx.db.insert("resumes", {
        userId,
        title: args.title,
        template: args.template,
        content: args.content,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    }
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    // For now, list all resumes for dummy user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", DUMMY_CLERK_ID))
      .first();

    if (!user) return [];

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
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const rename = mutation({
  args: {
    id: v.id("resumes"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const duplicate = mutation({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) throw new Error("Resume not found");

    const now = Date.now();
    const newId = await ctx.db.insert("resumes", {
      userId: resume.userId,
      title: `Copy of ${resume.title}`,
      template: resume.template,
      content: resume.content,
      createdAt: now,
      updatedAt: now,
    });

    return newId;
  },
});
