import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const userId = await getUserIdFromCookies();
    const today = new Date().toISOString().split("T")[0];
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const dailyMeal = await prisma.dailyMeal.findUnique({
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
    });

    if (!dailyMeal) {
      return NextResponse.json(
        { error: "Not found dailyMeal" },
        { status: 404 },
      );
    }

    const validList = await prisma.shoppingList.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(today),
        },
      },
    });

    const byId = new Map<
      string,
      { ingredientId: string; name: string; totalMass: number }
    >();
    for (const mealItem of dailyMeal.items) {
      for (const ri of mealItem.recipe.ingredients) {
        const key = ri.ingredientId;
        const prev = byId.get(key);
        const mass = prev ? prev.totalMass + ri.mass : ri.mass;
        byId.set(key, {
          ingredientId: key,
          name: ri.ingredient.name,
          totalMass: mass,
        });
      }
    }
    const aggregatedRows = Array.from(byId.values());
    const itemCreates = aggregatedRows.map((row) => ({
              ingredientNameSnapshot: row.name,
              ingredientId: row.ingredientId,
              totalMass: row.totalMass,
            }))
    let list;

    if (!validList) {
      list = await prisma.shoppingList.create({
        data: {
          userId,
          date: new Date(today),
          dailyMealId: dailyMeal.id,
          items: {
            create: itemCreates,
          },
        },
        include: { items: true },
      });
    } else {
      list = await prisma.$transaction( async(tx) => {
        await tx.shoppingListItem.deleteMany({
          where: {
            shoppingListId: validList.id
          }
        });
        return tx.shoppingList.update({
          where: {
            id: validList.id,
          },
          data: {
            items: {
              create: itemCreates,
            }
          },
          include: { items: true },
        })
      })
    }
    return NextResponse.json(list);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create shopping-list" },
      { status: 500 },
    );
  }
}

export async function GET () {
  try {
    const userId = await getUserIdFromCookies();
    const today = new Date().toISOString().split("T")[0];
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const validList = await prisma.shoppingList.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(today),
        },
      },
      include: {
        items: {
          include: {
            ingredient: {
              select: {
                calories: true,
              }
            }
          }
        }
      }
    });
    if (!validList) {
      return NextResponse.json(null);
    }
    const abc = validList.items.map(({ ingredient, ...rest }) => ({
      ...rest,
      itemCalories: Math.round(
        ((ingredient?.calories ?? 0) * rest.totalMass) / 100,
      ),
    }));
    return NextResponse.json({...validList, items: abc});
  } catch(error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load shopping-list" },
      { status: 500 },
    );
  }
}
