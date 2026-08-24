import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export const applicationsTable = pgTable('applications', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  shortDescription: text('short_description').notNull().default(''),
  longDescription: text('long_description').notNull().default(''),
  serviceSlug: varchar('service_slug', { length: 255 }),
  primaryImage: text('primary_image').notNull().default(''),
  primaryImageAlt: text('primary_image_alt').notNull().default(''),
  galleryImages: text('gallery_images').array().notNull().default([]),
  displayOrder: integer('display_order').notNull().default(0),
  published: boolean('published').notNull().default(true),
  seoTitle: text('seo_title').notNull().default(''),
  metaDescription: text('meta_description').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
