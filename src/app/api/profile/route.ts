import { getUserIdFromCookies } from "@/lib/auth";
import { JWT_SECRET } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let decoded = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId;
    const body = await req.json();
    const {
        name,
        age,
        height,
        weight,
        gender,
        activityLevel,
        goal,
      } = body;
      const nutrition = calculateCalories({
        age,
        height,
        weight,
        gender,
        activityLevel,
        goal,
      });
      const profile = await prisma.profile.upsert({
        where: {
          userId,
        },
        update: {
          name,
          age,
          height,
          weight,
          gender,
          activityLevel,
          goal,
          dailyCalories: nutrition.calories,
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs,
        },
        create: {
          userId,
          name,
          age,
          height,
          weight,
          gender,
          activityLevel,
          goal,
          dailyCalories: nutrition.calories,
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs,
        },
      })
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function GET() {
  try{
    const userId = await getUserIdFromCookies();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    })
  
    if (!profile) {
      return NextResponse.json({ profile: null })
    }
  
    return NextResponse.json(profile)
  } catch(error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }

}


function calculateCalories(data: any) {
    let bmr
  
    if (data.gender === "male") {
      bmr =
        10 * data.weight +
        6.25 * data.height -
        5 * data.age +
        5
    } else {
      bmr =
        10 * data.weight +
        6.25 * data.height -
        5 * data.age -
        161
    }
  
    const activityMap: any = {
      low: 1.2,
      medium: 1.55,
      high: 1.725,
    }
  
    let calories = bmr * (activityMap[data.activityLevel] || 1.2)
  
    if (data.goal === "lose") calories *= 0.85
    if (data.goal === "gain") calories *= 1.1
  
    const protein = Math.round(data.weight * 2)
    const fat = Math.round(data.weight * 0.9)
    const carbs = Math.round(
      (calories - protein * 4 - fat * 9) / 4
    )
  
    return {
      calories: Math.round(calories),
      protein,
      fat,
      carbs,
    }
  }


