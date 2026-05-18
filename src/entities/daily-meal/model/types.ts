import { MealType } from "@prisma/client";

export type DailyMealResponse = {
    id: string;
    date: string;
    items: {
      id: string;
      type: MealType;
      recipe: {
        name: string;
        description: string | null;
        protein: number;
        fat: number;
        carbs: number;
        calories: number;
      };
    }[];
  };