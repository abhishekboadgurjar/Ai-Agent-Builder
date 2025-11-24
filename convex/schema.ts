import { defineSchema,defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
    token: v.optional(v.number()),
  }),

AgentTable: defineTable({
  agentId: v.string(),
  name: v.string(),
  config: v.optional(v.any()),
  nodes:v.optional(v.any()),
  edges:v.optional(v.any()),
  published: v.boolean(),
  userId: v.id("UserTable"), 
  agentToolConfig:v.optional(v.any())
}),

});
