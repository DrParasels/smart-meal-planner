import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserIdFromCookies();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    let body: { isChecked?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    
    if (typeof body?.isChecked !== "boolean") {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const isChecked = body.isChecked;

    const res = await prisma.shoppingListItem.updateMany({
      where: { id, shoppingList: {userId} },
      data: { isChecked },
    });
    if (res.count === 0) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update shopping list item" },
      { status: 500 },
    );
  }
}
