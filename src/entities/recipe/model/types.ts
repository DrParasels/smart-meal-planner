import { MealType } from "@prisma/client";

export type AddRecipePayload = {
  dailyMealId: string;
  recipeId: string;
  type: MealType;
};

export type RecipeWithIngredients = {
  id: string;
  name: string;
  description: string | null;
  ingredients: RecipeIngredient[];
};

type RecipeIngredient = {
  name: string;
  mass: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};
