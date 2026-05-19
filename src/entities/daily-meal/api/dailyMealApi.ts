import { apiFetch } from "@/shared/api/api";
import type { DailyMealResponse } from "@/entities/daily-meal";

export const getDailyMeal = () => {
  return apiFetch<DailyMealResponse>("/api/daily-meal");
};

export const deleteMealItem = (id: string) => {
  return apiFetch<void>(`/api/daily-meal/item/${id}`, {
    method: "DELETE",
  });
};
