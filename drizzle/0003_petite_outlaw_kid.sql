ALTER TABLE "projects" ADD COLUMN "priority" "task_priority" DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "due_date" timestamp;