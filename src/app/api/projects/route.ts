import { NextResponse } from "next/server";
import { db } from "@/app/lib/db/db";
import { projects } from "@/app/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { eq } from 'drizzle-orm';
// import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Add error handling for the database query
    try {
      const userProjects = await db.select()
        .from(projects)
        .where(eq(projects.userId, parseInt(session.user.id)))
        .orderBy(projects.createdAt);

      return NextResponse.json(userProjects);
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Log the full error for debugging
      console.error("Full error:", JSON.stringify(dbError, null, 2));
      
      return NextResponse.json(
        { error: "Database error occurred", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description, status, priority, dueDate } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newProject = await db.insert(projects)
      .values({
        name,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: parseInt(session.user.id),
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 }
    );
  }
} 