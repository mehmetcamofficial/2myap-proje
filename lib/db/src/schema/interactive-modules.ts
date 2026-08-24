import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const interactiveModulesTable = pgTable('interactive_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  page: varchar('page', { length: 255 }),
  section: varchar('section', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  enabled: boolean('enabled').notNull().default(true),
  data: jsonb('data').notNull().default({}),
  ctaText: varchar('cta_text', { length: 255 }),
  ctaUrl: varchar('cta_url', { length: 500 }),
  mobileFallback: text('mobile_fallback'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
