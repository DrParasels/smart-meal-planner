import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const today = new Date().toISOString().split("T")[0];
    const dailyMeal = await prisma.dailyMeal.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(today),
        },
      },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
          },
        },
      },
      update: {},
      create: {
        userId,
        date: new Date(today),
      },
    });

    const response = {
      id: dailyMeal.id,
      date: dailyMeal.date,
      items: dailyMeal.items.map((item) => {
        const nutrition = item.recipe.ingredients.reduce(
          (acc, ri) => ({
            protein:  acc.protein  + (ri.ingredient.protein  * ri.mass) / 100,
            fat:      acc.fat      + (ri.ingredient.fat      * ri.mass) / 100,
            carbs:    acc.carbs    + (ri.ingredient.carbs    * ri.mass) / 100,
            calories: acc.calories + (ri.ingredient.calories * ri.mass) / 100,
            mass:     acc.mass     + ri.mass
          }),
          { protein: 0, fat: 0, carbs: 0, calories: 0, mass: 0 }
        );
        const nutritionRounded = {
          protein:  Math.ceil(nutrition.protein),
          fat:      Math.ceil(nutrition.fat),
          carbs:    Math.ceil(nutrition.carbs),
          calories: Math.ceil(nutrition.calories),
          mass:     nutrition.mass,
        }
        return {
          id: item.id,
          type: item.type,
          recipe: {
            name: item.recipe.name,
            description: item.recipe.description,
            ...nutritionRounded,
          },
        };
      }),
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load daily-meal" },
      { status: 500 },
    );
  }
}
