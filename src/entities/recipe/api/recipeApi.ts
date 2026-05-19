import { DailyMealItem } from "@prisma/client";
import type { AddRecipePayload, RecipeWithIngredients } from "@/entities/recipe";
import { apiFetch } from "@/shared/api/api";

export const getRecipes = () => {
  return apiFetch<RecipeWithIngredients[]>("/api/recipes");
};

export const addRecipe = (payload: AddRecipePayload) => {
  return apiFetch<DailyMealItem>("/api/daily-meal/item", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
