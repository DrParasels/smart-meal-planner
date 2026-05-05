import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
    const result = recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients.map((item) => ({
        name: item.ingredient.name,
        mass: item.mass,
        calories: item.ingredient.calories,
        protein: item.ingredient.protein,
        fat: item.ingredient.fat,
        carbs: item.ingredient.carbs,
      })),
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
