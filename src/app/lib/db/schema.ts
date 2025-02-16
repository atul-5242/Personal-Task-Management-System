import { pgTable, serial, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums for various status and role types
export const userRoleEnum = pgEnum('user_role', ['regular', 'pro']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'blocked', 'deferred']);
export const taskPriorityEnum = pgEnum('task_priority', ['high', 'medium', 'low']);
export const projectStatusEnum = pgEnum('project_status', ['active', 'completed', 'on_hold']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  role: userRoleEnum('role').default('regular'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('active'),
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories table (New Table)
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  projectId: serial('project_id').references(() => projects.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tasks table (Updated to include categoryId)
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('pending'),
  priority: taskPriorityEnum('priority').default('medium'),
  dueDate: timestamp('due_date'),
  isRecurring: boolean('is_recurring').default(false),
  userId: serial('user_id').references(() => users.id),
  projectId: serial('project_id').references(() => projects.id),
  categoryId: serial('category_id').references(() => categories.id), // New field
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  categories: many(categories),
  tasks: many(tasks),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  project: one(projects, {
    fields: [categories.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));
