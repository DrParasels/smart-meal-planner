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

      const dailyMeal = await prisma.dailyMeal.findFirst({
        where: {
          id: dailyMealId,
          userId
        }
      })
      if(!dailyMeal) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
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