import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MealType } from "@prisma/client";
import { NextResponse } from "next/server";

interface CreateDailyMealItemBody {
  dailyMealId: string;
  recipeId: string;
  type: MealType;
}

export async function POST(req: Request) {
  try {
    const { dailyMealId, recipeId, type } =
      (await req.json()) as CreateDailyMealItemBody;
    const userId = await getUserIdFromCookies();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const item = await prisma.dailyMealItem.create({
      data: { dailyMealId, recipeId, type },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create dailyMealItem" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserIdFromCookies();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
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
