import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const save = mutation({
  args: {
    id: v.optional(v.id("resumes")),
    title: v.string(),
    template: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    if (args.id) {
      // Update existing resume
      await ctx.db.patch(args.id, {
        title: args.title,
        template: args.template,
        content: args.content,
        updatedAt: now,
      });
      return args.id;
    } else {
      // Create new resume
      const id = await ctx.db.insert("resumes", {
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
    return await ctx.db
      .query("resumes")
      .withIndex("by_updated")
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
