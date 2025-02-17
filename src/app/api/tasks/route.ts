import { NextResponse } from "next/server";
import { db } from "@/app/lib/db/db";
import { tasks } from "@/app/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { eq, and } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { categories } from "@/app/lib/db/schema";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, status, priority, dueDate, projectId, category } = await req.json();

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "Title and project ID are required" },
        { status: 400 }
      );
    }

    // First create the category if provided
    let categoryId = null;
    if (category?.name) {
      const newCategory = await db.insert(categories)
        .values({
          name: category.name,
          projectId: projectId,
        })
        .returning();
      categoryId = newCategory[0].id;
    }

    // Then create the task with the new category ID
    const newTask = await db.insert(tasks)
      .values({
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        userId: parseInt(session.user.id),
        categoryId: categoryId || undefined
      })
      .returning();

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error("Task creation error:", error);
    return NextResponse.json(
      { error: "Error creating task" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    const query = db.select().from(tasks);
    
    const conditions = [eq(tasks.userId, parseInt(session.user.id))];
    if (projectId) {
      conditions.push(eq(tasks.projectId, parseInt(projectId)));
    }

    const userTasks = await query
      .where(and(...conditions))
      .orderBy(desc(tasks.createdAt));

    return NextResponse.json(userTasks, { status: 200 });
  } catch (error) {
    console.error("Task fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}   