import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: {
        recipes: {
          include: {
            recipe: true,
          },
        },
      },
    });
    const result = ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      calories: ingredient.calories,
      protein: ingredient.protein,
      fat: ingredient.fat,
      carbs: ingredient.carbs,
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 },
    );
  }
}
