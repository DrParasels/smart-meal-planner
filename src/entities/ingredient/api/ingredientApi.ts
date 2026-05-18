import { apiFetch } from "@/shared/api/api";
import { Ingredient } from "@prisma/client";

export const getIngredients = () => {
  return apiFetch<Ingredient[]>("/api/ingredients");
};
