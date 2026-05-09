import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { id } = await params;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const item = await prisma.dailyMealItem.findUnique({
      where: { id },
      include: {
        dailyMeal: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!item || item.dailyMeal.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await prisma.dailyMealItem.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete dailyMealItem" },
      { status: 500 },
    );
  }
}
