import { NextResponse } from "next/server";
import { db } from "@/app/lib/db/db";
import { categories } from "@/app/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projectCategories = await db.select()
      .from(categories)
      .where(eq(categories.projectId, parseInt(projectId)));

    return NextResponse.json(projectCategories);
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, projectId } = await req.json();

    if (!name || !projectId) {
      return NextResponse.json(
        { error: "Name and project ID are required" },
        { status: 400 }
      );
    }

    const newCategory = await db.insert(categories)
      .values({
        name,
        projectId,
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
} 