ALTER TABLE "tasks" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "recurring_interval" text;