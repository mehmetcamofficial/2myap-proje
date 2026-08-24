import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  short: text('short').notNull().default(''),
  description: text('description').notNull().default(''),
  image: text('image').notNull().default(''),
  imageAlt: text('image_alt').notNull().default(''),
  applicationImage: text('application_image').notNull().default(''),
  applicationImageAlt: text('application_image_alt').notNull().default(''),
  enabled: boolean('enabled').notNull().default(true),
  sortOrder: varchar('sort_order', { length: 10 }).notNull().default('0'),
  seoTitle: text('seo_title').notNull().default(''),
  seoDesc: text('seo_desc').notNull().default(''),
  whatsapp: text('whatsapp').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
