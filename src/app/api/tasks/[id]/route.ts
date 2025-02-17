import { NextResponse } from "next/server";
import { db } from "@/app/lib/db/db";
import { tasks } from "@/app/lib/db/schema";
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, priority } = await req.json();
    const taskId = parseInt(params.id);

    const updatedTask = await db.update(tasks)
      .set({
        ...(status && { status }),
        ...(priority && { priority }),
        updatedAt: new Date(),
        completedAt: status === 'completed' ? new Date() : null
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error("Task update error:", error);
    return NextResponse.json(
      { error: "Error updating task" },
      { status: 500 }
    );
  }
} 