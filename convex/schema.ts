import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  // Your other tables...
  subscriptions: defineTable({
    userId: v.id('users'),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    productId: v.optional(v.string()),
    priceId: v.optional(v.string()),
    planCode: v.optional(v.string()),
    status: v.string(),
    currentPeriodEnd: v.number(),
    trialEndAt: v.optional(v.number()),
    cancelAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    seats: v.optional(v.number()),
    metadata: v.optional(v.any()),
    creditsBalance: v.number(),
    creditsGrantPerPeriod: v.number(),
    creditsRolloverLimit: v.number(),
    lastGrantCursor: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_polarSubscriptionId', ['polarSubscriptionId'])
    .index('by_status', ['status']),

  credits_ledgers: defineTable({
    userId: v.id('users'),
    subscriptionId: v.id('subscriptions'),
    amount: v.number(),
    type: v.string(),
    reason: v.optional(v.string()),
    idempotencyKey: v.optional(v.string()),
    meta: v.optional(v.any()),
  })
    .index('by_userId', ['userId'])
    .index('by_subscriptionId', ['subscriptionId'])
    .index('by_idempotencyKey', ['idempotencyKey']),

  projects: defineTable({
    userId: v.id('users'),
    name: v.string(),
    description: v.optional(v.string()),
    styleGuide: v.optional(v.string()),
    sketchsData: v.any(),
    viewportData: v.optional(v.any()),
    generatedDesignData: v.optional(v.any()),
    thumbnail: v.optional(v.string()),
    moodBoardImages: v.optional(v.array(v.string())),
    inspirationImages: v.optional(v.array(v.string())),
    lastModified: v.number(),
    createdAt: v.number(),
    isPublic: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    projectNumber: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_lastModified', ['userId', 'lastModified']),

  project_counters: defineTable({
    userId: v.id('users'),
    nextProjectNumber: v.number(),
  }).index('by_userId', ['userId']),
});

export default schema;
