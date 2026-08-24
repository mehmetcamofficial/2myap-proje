import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { mediaTable } from './media';

export const galleriesTable = pgTable('galleries', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull().default(''),
  coverImage: text('cover_image').notNull().default(''),
  category: varchar('category', { length: 100 }).notNull().default(''),
  location: varchar('location', { length: 255 }).notNull().default(''),
  size: varchar('size', { length: 20 }).notNull().default('medium'),
  published: boolean('published').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const galleryImagesTable = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  galleryId: integer('gallery_id').notNull().references(() => galleriesTable.id, { onDelete: 'cascade' }),
  mediaId: integer('media_id').references(() => mediaTable.id, { onDelete: 'set null' }),
  imageUrl: text('image_url').notNull().default(''),
  caption: varchar('caption', { length: 500 }).notNull().default(''),
  displayOrder: integer('display_order').notNull().default(0),
});

export const insertGallerySchema = createInsertSchema(galleriesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImagesTable).omit({
  id: true,
});

export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof galleriesTable.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImagesTable.$inferSelect;
