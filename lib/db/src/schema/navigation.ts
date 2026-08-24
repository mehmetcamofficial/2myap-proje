import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export const navigationTable = pgTable('navigation', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  href: varchar('href', { length: 500 }).notNull(),
  parentId: integer('parent_id'),
  type: varchar('type', { length: 50 }).notNull().default('header'),
  displayOrder: integer('display_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
  openInNewTab: boolean('open_in_new_tab').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertNavigationSchema = createInsertSchema(navigationTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNavigation = z.infer<typeof insertNavigationSchema>;
export type NavigationItem = typeof navigationTable.$inferSelect;
