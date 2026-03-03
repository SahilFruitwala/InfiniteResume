import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  resumes: defineTable({
    title: v.string(),
    template: v.string(),
    content: v.any(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_updated", ["updatedAt"]),
});
