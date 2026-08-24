import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const leadsTable = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  service: varchar('service', { length: 255 }).notNull().default(''),
  area: varchar('area', { length: 255 }).notNull().default(''),
  description: text('description').notNull().default(''),
  contactMethod: varchar('contact_method', { length: 50 }).notNull().default('phone'),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Lead = typeof leadsTable.$inferSelect;
